import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default async function UserFollowersPage({ params }: { params: { userId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", params.userId)
    .single();

  if (!profile) notFound();

  const { data: rows } = await supabase
    .from("follows")
    .select("follower_id, profiles!follows_follower_id_fkey(id, display_name, username, avatar_url, is_verified)")
    .eq("followed_id", params.userId);

  const people = (rows ?? []).map((r: any) => r.profiles).filter(Boolean);
  const backHref = params.userId === user.id ? "/profile" : `/profile/${params.userId}`;

  return (
    <div>
      <Link href={backHref} className="mb-4 inline-block text-xs text-ink/60 underline dark:text-neutral-400">
        &larr; Back to profile
      </Link>
      <h1 className="mb-4 text-lg font-medium">
        {params.userId === user.id ? "Your followers" : `${profile.display_name}'s followers`}
      </h1>
      <div className="flex flex-col gap-2">
        {people.map((p: any) => (
          <Link
            key={p.id}
            href={p.id === user.id ? "/profile" : `/profile/${p.id}`}
            className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
          >
            <Avatar url={p.avatar_url} name={p.display_name} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink dark:text-neutral-100">
                {p.display_name}
                <VerifiedBadge verified={p.is_verified} />
              </p>
              {p.username ? (
                <p className="truncate text-xs text-ink/40 dark:text-neutral-500">@{p.username}</p>
              ) : null}
            </div>
          </Link>
        ))}
        {people.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-neutral-400">No followers yet.</p>
        ) : null}
      </div>
    </div>
  );
}