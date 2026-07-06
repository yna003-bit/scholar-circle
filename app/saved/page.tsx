import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OpportunityCard } from "@/components/FeedItems";

export default async function SavedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: saved, error } = await supabase
    .from("saved_posts")
    .select(
      "created_at, opportunities(id, title, sponsor_name, amount, currency, deadline, description, tags, author_id, created_at, profiles!opportunities_author_id_fkey(display_name, is_verified), likes(user_id), saved_posts(user_id), comments(id, body, user_id, profiles!comments_user_id_fkey(display_name), comment_likes(user_id)))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Saved posts query error:", error);
  }

  const opportunities = (saved ?? []).map((row: any) => row.opportunities).filter(Boolean);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Saved posts</h1>
      {error ? (
        <p className="text-sm text-red-600">Couldn&apos;t load saved posts: {error.message}</p>
      ) : null}
      {opportunities.map((opp: any) => (
        <OpportunityCard key={opp.id} opp={opp} userId={user.id} />
      ))}
      {!error && opportunities.length === 0 ? (
        <p className="text-sm text-ink/50 dark:text-neutral-400">
          Nothing saved yet — tap the bookmark icon on any post in the Feed to save it here.
        </p>
      ) : null}
    </div>
  );
}