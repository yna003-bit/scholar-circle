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

  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", otherId)
    .single();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, body, created_at")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (
    <div>
      <Link href="/messages" className="mb-4 inline-block text-xs text-ink/60 underline">
        &larr; Back to messages
      </Link>
      <h1 className="mb-4 text-lg font-medium">{otherProfile?.display_name ?? "Conversation"}</h1>
      <Conversation userId={user.id} otherId={otherId} initialMessages={messages ?? []} />
    </div>
  );
}