import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "@/components/Avatar";
import { isActiveNow, lastSeenLabel } from "@/lib/presence";

export default async function NetworkPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: viewer } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const { data: blockRows } = await supabase
    .from("blocks")
    .select("blocker_id, blocked_id")
    .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`);

  const excludedIds = new Set(
    (blockRows ?? []).map((b) => (b.blocker_id === user.id ? b.blocked_id : b.blocker_id))
  );

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, school, is_verified, avatar_url, last_seen_at, email")
    .neq("id", user.id);

  const profiles = (allProfiles ?? []).filter((p) => !excludedIds.has(p.id));

  const { data: myFollowing } = await supabase
    .from("follows")
    .select("followed_id")
    .eq("follower_id", user.id);

  const { data: followerCounts } = await supabase.from("follows").select("followed_id");

  const { data: friendRequests } = await supabase
    .from("friend_requests")
    .select("id, sender_id, receiver_id, status")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

  const { count: pendingIncomingCount } = await supabase
    .from("friend_requests")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", user.id)
    .eq("status", "pending");

  const followingSet = new Set((myFollowing ?? []).map((f) => f.followed_id));
  const countFor = (id: string) => (followerCounts ?? []).filter((f) => f.followed_id === id).length;

  function friendStateFor(otherId: string) {
    const req = (friendRequests ?? []).find(
      (r) =>
        (r.sender_id === user!.id && r.receiver_id === otherId) ||
        (r.receiver_id === user!.id && r.sender_id === otherId)
    );
    if (!req) return { status: "none" as const, requestId: null };
    if (req.status === "accepted") return { status: "friends" as const, requestId: req.id };
    if (req.sender_id === user!.id) return { status: "sent" as const, requestId: req.id };
    return { status: "received" as const, requestId: req.id };
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">Students</h1>
        <Link href="/network/requests" className="text-xs text-ink/60 underline">
          Friend requests{pendingIncomingCount ? ` (${pendingIncomingCount})` : ""}
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {profiles.map((p) => {
          const friend = friendStateFor(p.id);
          return (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3">
              <Link href={`/profile/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar url={p.avatar_url} name={p.display_name} size={36} active={isActiveNow(p.last_seen_at)} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium hover:underline">
                    {p.display_name}
                    <VerifiedBadge verified={p.is_verified} />
                    {p.username ? <span className="ml-1 text-xs font-normal text-ink/40">@{p.username}</span> : null}
                  </p>
                  <p className="truncate text-xs text-ink/50">
                    {p.school ?? "No school listed"} · {countFor(p.id)} followers · {lastSeenLabel(p.last_seen_at)}
                  </p>
                  {viewer?.is_admin ? (
                    <p className="truncate text-xs text-ink/40">{p.email}</p>
                  ) : null}
                </div>
              </Link>
              <div className="ml-2 flex shrink-0 items-center gap-2">
                <FollowButton userId={user.id} targetId={p.id} initiallyFollowing={followingSet.has(p.id)} />
                <FriendButton
                  userId={user.id}
                  targetId={p.id}
                  requestId={friend.requestId}
                  initialStatus={friend.status}
                />
                <Link
                  href={`/messages/${p.id}`}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70"
                >
                  Message
                </Link>
              </div>
            </div>
          );
        })}
        {profiles.length === 0 ? <p className="text-sm text-ink/50">No other students yet.</p> : null}
      </div>
    </div>
  );
}