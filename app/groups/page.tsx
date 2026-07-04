import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { GroupJoinButton } from "@/components/GroupJoinButton";

export default async function GroupsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description, creator_id")
    .order("created_at", { ascending: false });

  const { data: myMemberships } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);

  const { data: memberCounts } = await supabase.from("group_members").select("group_id");

  const joinedSet = new Set((myMemberships ?? []).map((m) => m.group_id));
  const countFor = (id: string) => (memberCounts ?? []).filter((m) => m.group_id === id).length;

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Groups</h1>
      <CreateGroupForm userId={user.id} />
      <div className="flex flex-col gap-2">
        {(groups ?? []).map((g) => (
          <div
            key={g.id}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
          >
            <Link href={`/groups/${g.id}`} className="min-w-0 flex-1">
              <p className="text-sm font-medium">{g.name}</p>
              <p className="truncate text-xs text-ink/50">
                {g.description ?? "No description"} · {countFor(g.id)} members
              </p>
            </Link>
            <GroupJoinButton userId={user.id} groupId={g.id} initiallyJoined={joinedSet.has(g.id)} />
          </div>
        ))}
        {groups?.length === 0 ? <p className="text-sm text-ink/50">No groups yet — start one.</p> : null}
      </div>
    </div>
  );
}