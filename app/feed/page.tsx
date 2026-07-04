import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OpportunityCard, PostForm } from "@/components/FeedItems";

export default async function FeedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      "id, title, sponsor_name, amount, currency, deadline, description, tags, author_id, profiles(display_name), likes(user_id), comments(id, body, user_id, profiles(display_name))"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Scholarships &amp; Grants</h1>
      <PostForm userId={user.id} />
      {(opportunities ?? []).map((opp: any) => (
        <OpportunityCard key={opp.id} opp={opp} userId={user.id} />
      ))}
      {opportunities?.length === 0 ? (
        <p className="text-sm text-ink/50">No listings yet — be the first to post one.</p>
      ) : null}
    </div>
  );
}
