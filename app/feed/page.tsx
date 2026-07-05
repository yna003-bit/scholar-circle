import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { OpportunityCard, PostForm } from "@/components/FeedItems";
import { SearchBar } from "@/components/SearchBar";
import { LanguageCode } from "@/lib/translations";

const OPP_FIELDS =
  "id, title, sponsor_name, amount, currency, deadline, description, tags, author_id, created_at, image_url, profiles!opportunities_author_id_fkey(display_name, is_verified, avatar_url), likes(user_id, profiles!likes_user_id_fkey(display_name, avatar_url)), saved_posts(user_id), reposts(user_id, profiles!reposts_user_id_fkey(display_name, avatar_url)), comments(id, body, user_id, profiles!comments_user_id_fkey(display_name, avatar_url), comment_likes(user_id))";

export default async function FeedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const cookieStore = cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as LanguageCode;

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

  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(OPP_FIELDS)
    .order("created_at", { ascending: false });

  const { data: repostRows } = await supabase
    .from("reposts")
    .select(`id, created_at, user_id, profiles!reposts_user_id_fkey(display_name), opportunities(${OPP_FIELDS})`);

  if (error) {
    console.error("Feed query error:", error);
  }

  type FeedEntry = { sortDate: string; opp: any; repostedBy: { id: string; name: string | null } | null };

  const originalEntries: FeedEntry[] = (opportunities ?? [])
    .filter((o: any) => !excludedIds.has(o.author_id))
    .map((o: any) => ({ sortDate: o.created_at, opp: o, repostedBy: null }));

  const repostEntries: FeedEntry[] = (repostRows ?? [])
    .filter((r: any) => r.opportunities && !excludedIds.has(r.user_id) && !excludedIds.has(r.opportunities.author_id))
    .map((r: any) => ({
      sortDate: r.created_at,
      opp: r.opportunities,
      repostedBy: { id: r.user_id, name: r.profiles?.display_name ?? null },
    }));

  const feedEntries = [...originalEntries, ...repostEntries].sort(
    (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime()
  );

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Scholarships &amp; Grants</h1>
      <div className="mb-4">
        <SearchBar lang={lang} />
      </div>
      <PostForm userId={user.id} />
      {error ? (
        <p className="text-sm text-red-600">Couldn&apos;t load the feed: {error.message}</p>
      ) : null}
      {feedEntries.map((entry, i) => (
        <OpportunityCard
          key={`${entry.opp.id}-${entry.repostedBy?.id ?? "original"}-${i}`}
          opp={entry.opp}
          userId={user.id}
          isAdmin={!!viewer?.is_admin}
          repostedBy={entry.repostedBy}
        />
      ))}
      {!error && feedEntries.length === 0 ? (
        <p className="text-sm text-ink/50">No listings yet — be the first to post one.</p>
      ) : null}
    </div>
  );
}