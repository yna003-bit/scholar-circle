import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileHeader } from "@/components/ProfileHeader";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, username, school, bio, is_verified, avatar_url, country, city")
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
      <ProfileHeader
        profileId={user.id}
        avatarUrl={profile.avatar_url}
        displayName={profile.display_name}
        username={profile.username}
        bio={profile.bio}
        school={profile.school}
        city={profile.city}
        country={profile.country}
        isVerified={!!profile.is_verified}
        postedCount={postedCount ?? 0}
        followerCount={followerCount ?? 0}
        followingCount={followingCount ?? 0}
      />

      <h2 className="mb-2 text-sm font-medium text-ink/60 dark:text-neutral-400">Edit profile</h2>
      <ProfileForm profile={profile} />
    </div>
  );
}