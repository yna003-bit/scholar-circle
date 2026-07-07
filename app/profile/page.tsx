import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "@/components/Avatar";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, username, school, bio, is_verified, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const { count: postedCount } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id);

  const { count: followerCount } = await supabase
    .from("follows")
    .select("follower_id", { count: "exact", head: true })
    .eq("followed_id", user.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("followed_id", { count: "exact", head: true })
    .eq("follower_id", user.id);

  return (
    <div>
      <div className="mb-6 flex items-center gap-5">
        <Avatar url={profile.avatar_url} name={profile.display_name} size={72} />
        <div className="flex flex-1 justify-around text-center">
          <Link href={`/profile/${user.id}/posts`}>
            <p className="text-base font-medium">{postedCount ?? 0}</p>
            <p className="text-[11px] text-ink/40 dark:text-neutral-500">Posts</p>
          </Link>
          <Link href={`/profile/${user.id}/followers`}>
            <p className="text-base font-medium">{followerCount ?? 0}</p>
            <p className="text-[11px] text-ink/40 dark:text-neutral-500">Followers</p>
          </Link>
          <Link href={`/profile/${user.id}/following`}>
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
      {profile.bio ? (
        <p className="mt-2 text-sm text-ink/70 dark:text-neutral-300">{profile.bio}</p>
      ) : null}

      <h2 className="mb-2 mt-6 text-sm font-medium text-ink/60 dark:text-neutral-400">Edit profile</h2>
      <ProfileForm profile={profile} />
    </div>
  );
}