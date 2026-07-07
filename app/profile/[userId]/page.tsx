import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "@/components/FollowButton";
import { FriendButton } from "@/components/FriendButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { VerifyToggle } from "@/components/VerifyToggle";
import { BlockToggle } from "@/components/BlockToggle";
import { SuspendToggle } from "@/components/SuspendToggle";
import { Avatar } from "@/components/Avatar";
import { isActiveNow, lastSeenLabel } from "@/lib/presence";

export default async function PublicProfilePage({ params }: { params: { userId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (params.userId === user.id) {
    redirect("/profile");
  }

  const { data: viewer } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, username, school, bio, is_verified, avatar_url, last_seen_at, is_suspended, email, country, city")
    .eq("id", params.userId)
    .single();

  if (!profile) notFound();

  const { count: postedCount } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("author_id", profile.id);

  const { count: followerCount } = await supabase
    .from("follows")
    .select("follower_id", { count: "exact", head: true })
    .eq("followed_id", profile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("followed_id", { count: "exact", head: true })
    .eq("follower_id", profile.id);

  const { data: myFollow } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", user.id)
    .eq("followed_id", profile.id)
    .maybeSingle();

  const { data: friendRequest } = await supabase
    .from("friend_requests")
    .select("id, sender_id, receiver_id, status")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`
    )
    .maybeSingle();

  const { data: myBlock } = await supabase
    .from("blocks")
    .select("blocker_id")
    .eq("blocker_id", user.id)
    .eq("blocked_id", profile.id)
    .maybeSingle();

  let friendStatus: "none" | "sent" | "received" | "friends" = "none";
  let friendRequestId: string | null = null;
  if (friendRequest) {
    friendRequestId = friendRequest.id;
    if (friendRequest.status === "accepted") friendStatus = "friends";
    else if (friendRequest.sender_id === user.id) friendStatus = "sent";
    else friendStatus = "received";
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <Avatar
          url={profile.avatar_url}
          name={profile.display_name}
          size={72}
          active={isActiveNow(profile.last_seen_at)}
        />
        <div className="flex flex-1 justify-around text-center">
          <Link href={`/profile/${profile.id}/posts`}>
            <p className="text-base font-medium">{postedCount ?? 0}</p>
            <p className="text-[11px] text-ink/40 dark:text-neutral-500">Posts</p>
          </Link>
          <Link href={`/profile/${profile.id}/followers`}>
            <p className="text-base font-medium">{followerCount ?? 0}</p>
            <p className="text-[11px] text-ink/40 dark:text-neutral-500">Followers</p>
          </Link>
          <Link href={`/profile/${profile.id}/following`}>
            <p className="text-base font-medium">{followingCount ?? 0}</p>
            <p className="text-[11px] text-ink/40 dark:text-neutral-500">Following</p>
          </Link>
        </div>
      </div>
      <p className="text-sm font-medium">
        {profile.display_name}
        <VerifiedBadge verified={profile.is_verified} />
      </p>
      {profile.username ? (
        <p className="text-xs text-ink/40 dark:text-neutral-500">@{profile.username}</p>
      ) : null}
      <p className="text-xs text-ink/40 dark:text-neutral-500">
        {profile.school ?? "No school listed"} · {lastSeenLabel(profile.last_seen_at)}
      </p>
      {viewer?.is_admin ? (
        <p className="text-xs text-ink/40 dark:text-neutral-500">{profile.email}</p>
      ) : null}
      {profile.bio ? (
        <p className="mt-2 text-sm text-ink/70 dark:text-neutral-300">{profile.bio}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <FollowButton userId={user.id} targetId={profile.id} initiallyFollowing={!!myFollow} />
        <FriendButton
          userId={user.id}
          targetId={profile.id}
          requestId={friendRequestId}
          initialStatus={friendStatus}
        />
        <Link
          href={`/messages/${profile.id}`}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
        >
          Message
        </Link>
        <BlockToggle userId={user.id} targetId={profile.id} initiallyBlocked={!!myBlock} />
        {viewer?.is_admin ? (
          <VerifyToggle targetId={profile.id} initiallyVerified={!!profile.is_verified} />
        ) : null}
        {viewer?.is_admin ? (
          <SuspendToggle targetId={profile.id} initiallySuspended={!!profile.is_suspended} />
        ) : null}
      </div>
    </div>
  );
}