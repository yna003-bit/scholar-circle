import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GroupChat } from "@/components/GroupChat";
import { GroupJoinButton } from "@/components/GroupJoinButton";

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, description, creator_id")
    .eq("id", params.groupId)
    .single();

  if (!group) notFound();

  const { data: membership } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { count: memberCount } = await supabase
    .from("group_members")
    .select("user_id", { count: "exact", head: true })
    .eq("group_id", group.id);

  const { data: messages } = await supabase
    .from("group_messages")
    .select("id, group_id, sender_id, body, created_at, profiles(display_name)")
    .eq("group_id", group.id)
    .order("created_at", { ascending: true });

  const formattedMessages = (messages ?? []).map((m: any) => ({
    ...m,
    sender_name: m.profiles?.display_name,
  }));

  return (
    <div>
      <Link href="/groups" className="mb-4 inline-block text-xs text-ink/60 underline">
        &larr; Back to groups
      </Link>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-medium">{group.name}</h1>
          <p className="text-xs text-ink/50">
            {group.description} · {memberCount ?? 0} members
          </p>
        </div>
        <GroupJoinButton userId={user.id} groupId={group.id} initiallyJoined={!!membership} />
      </div>
      {membership ? (
        <GroupChat groupId={group.id} userId={user.id} initialMessages={formattedMessages} />
      ) : (
        <p className="text-sm text-ink/50">Join this group to see and send messages.</p>
      )}
    </div>
  );
}