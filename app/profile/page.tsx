import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, username, school, bio")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Your profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}