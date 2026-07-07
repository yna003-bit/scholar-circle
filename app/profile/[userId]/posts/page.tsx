import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OpportunityCard } from "@/components/FeedItems";

const OPP_FIELDS =
  "id, title, sponsor_name, amount, currency, deadline, description, tags, author_id, created_at, image_url, profiles!opportunities_author_id_fkey(display_name, is_verified, avatar_url), likes(user_id, profiles!likes_user_id_fkey(display_name, avatar_url)), saved_posts(user_id), reposts(user_id, profiles!reposts_user_id_fkey(display_name, avatar_url)), comments(id, body, user_id, profiles!comments_user_id_fkey(display_name, avatar_url), comment_likes(user_id))";

export default async function UserPostsPage({ params }: { params: { userId: string } }) {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", params.userId)
    .single();

  if (!profile) notFound();

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(OPP_FIELDS)
    .eq("author_id", params.userId)
    .order("created_at", { ascending: false });

  const backHref = params.userId === user.id ? "/profile" : `/profile/${params.userId}`;

  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-xs text-ink/60 underline dark:text-neutral-400">
        &larr; Back to profile
      </Link>
      <h1 className="mb-4 text-lg font-medium">
        {params.userId === user.id ? "Your posts" : `${profile.display_name}'s posts`}
      </h1>
      {(opportunities ?? []).map((opp: any) => (
        <OpportunityCard key={opp.id} opp={opp} userId={user.id} isAdmin={!!viewer?.is_admin} />
      ))}
      {(opportunities ?? []).length === 0 ? (
        <p className="text-sm text-ink/50 dark:text-neutral-400">No posts yet.</p>
      ) : null}
    </div>
  );
}