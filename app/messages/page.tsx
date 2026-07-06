import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MessagesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, body, created_at")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const partners = new Map<string, { lastBody: string; lastAt: string }>();
  for (const m of messages ?? []) {
    const partnerId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
    if (!partners.has(partnerId)) {
      partners.set(partnerId, { lastBody: m.body, lastAt: m.created_at });
    }
  }

  const partnerIds = Array.from(partners.keys());
  const { data: profiles } = partnerIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", partnerIds)
    : { data: [] as any[] };

  const nameFor = (id: string) => profiles?.find((p) => p.id === id)?.display_name ?? "A student";

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Messages</h1>
      <div className="flex flex-col gap-2">
        {partnerIds.map((id) => (
          <Link
            key={id}
            href={`/messages/${id}`}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
          >
            <div>
              <p className="text-sm font-medium text-ink dark:text-neutral-100">{nameFor(id)}</p>
              <p className="truncate text-xs text-ink/50 dark:text-neutral-400">{partners.get(id)?.lastBody}</p>
            </div>
          </Link>
        ))}
        {partnerIds.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-neutral-400">
            No conversations yet — start one from a student&apos;s profile in Network.
          </p>
        ) : null}
      </div>
    </div>
  );
}