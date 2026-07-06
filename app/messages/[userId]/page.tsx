import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Conversation } from "@/components/Conversation";

export default async function MessageThreadPage({ params }: { params: { userId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const otherId = params.userId;

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", otherId)
    .single();

  // Mark any messages the other person sent me as delivered and read now
  // that I've opened this thread.
  await supabase
    .from("messages")
    .update({ delivered_at: new Date().toISOString(), read_at: new Date().toISOString() })
    .eq("sender_id", otherId)
    .eq("receiver_id", user.id)
    .is("read_at", null);

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, sender_id, receiver_id, body, created_at, delivered_at, read_at, edited_at, deleted_for_everyone, attachment_url, attachment_type"
    )
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  const { data: hiddenRows } = await supabase
    .from("message_deletions")
    .select("message_id")
    .eq("user_id", user.id);
  const hiddenIds = new Set((hiddenRows ?? []).map((h) => h.message_id));

  const visibleMessages = (messages ?? []).filter((m) => !hiddenIds.has(m.id));

  return (
    <div>
      <Link href="/messages" className="mb-4 inline-block text-xs text-ink/60 underline dark:text-neutral-400">
        &larr; Back to messages
      </Link>
      <h1 className="mb-1 text-lg font-medium text-ink dark:text-neutral-100">{otherProfile?.display_name ?? "Conversation"}</h1>
      <p className="mb-4 text-xs text-ink/40 dark:text-neutral-500">
        Messages are private between you and the recipient.
      </p>
      <Conversation
        userId={user.id}
        otherId={otherId}
        initialMessages={visibleMessages}
        myProfile={{ name: myProfile?.display_name ?? null, avatarUrl: myProfile?.avatar_url ?? null }}
        otherProfile={{ name: otherProfile?.display_name ?? null, avatarUrl: otherProfile?.avatar_url ?? null }}
      />
    </div>
  );
}