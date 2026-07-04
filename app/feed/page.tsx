import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OpportunityCard, PostForm } from "@/components/FeedItems";

export default async function FeedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(
      "id, title, sponsor_name, amount, currency, deadline, description, tags, author_id, created_at, profiles!opportunities_author_id_fkey(display_name, is_verified), likes(user_id), saved_posts(user_id), comments(id, body, user_id, profiles!comments_user_id_fkey(display_name), comment_likes(user_id))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Feed query error:", error);
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Scholarships &amp; Grants</h1>
      <PostForm userId={user.id} />
      {error ? (
        <p className="text-sm text-red-600">Couldn&apos;t load the feed: {error.message}</p>
      ) : null}
      {(opportunities ?? []).map((opp: any) => (
        <OpportunityCard key={opp.id} opp={opp} userId={user.id} />
      ))}
      {!error && (opportunities ?? []).length === 0 ? (
        <p className="text-sm text-ink/50">No listings yet — be the first to post one.</p>
      ) : null}
    </div>
  );
}