import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "@/components/FollowButton";

export default async function NetworkPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, school")
    .neq("id", user.id);

  const { data: myFollowing } = await supabase
    .from("follows")
    .select("followed_id")
    .eq("follower_id", user.id);

  const { data: followerCounts } = await supabase.from("follows").select("followed_id");

  const followingSet = new Set((myFollowing ?? []).map((f) => f.followed_id));
  const countFor = (id: string) => (followerCounts ?? []).filter((f) => f.followed_id === id).length;

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Students</h1>
      <div className="flex flex-col gap-2">
        {(profiles ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                {p.display_name?.slice(0, 2).toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-medium">{p.display_name}</p>
                <p className="text-xs text-ink/50">
                  {p.school ?? "No school listed"} · {countFor(p.id)} followers
                </p>
              </div>
            </div>
            <FollowButton userId={user.id} targetId={p.id} initiallyFollowing={followingSet.has(p.id)} />
          </div>
        ))}
        {profiles?.length === 0 ? <p className="text-sm text-ink/50">No other students yet.</p> : null}
      </div>
    </div>
  );
}
