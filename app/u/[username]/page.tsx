import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function UsernameRedirectPage({ params }: { params: { username: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  if (profile.id === user.id) redirect("/profile");
  redirect(`/profile/${profile.id}`);
}