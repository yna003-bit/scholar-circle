import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export default async function FollowingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("follows")
    .select("followed_id, profiles!follows_followed_id_fkey(id, display_name, username, avatar_url, is_verified)")
    .eq("follower_id", user.id);

  const people = (rows ?? []).map((r: any) => r.profiles).filter(Boolean);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Following</h1>
      <div className="flex flex-col gap-2">
        {people.map((p: any) => (
          <Link
            key={p.id}
            href={`/profile/${p.id}`}
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
          <p className="text-sm text-ink/50 dark:text-neutral-400">You&apos;re not following anyone yet.</p>
        ) : null}
      </div>
    </div>
  );
}