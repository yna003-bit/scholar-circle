import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/Avatar";

function labelFor(type: string, actorName: string, preview: string | null) {
  switch (type) {
    case "post_like":
      return `${actorName} liked your post`;
    case "post_comment":
      return `${actorName} commented: ${preview ?? ""}`;
    case "comment_like":
      return `${actorName} liked your comment`;
    case "friend_request":
      return `${actorName} sent you a friend request`;
    case "message":
      return `${actorName} sent you a message: ${preview ?? ""}`;
    case "tag":
      return `${actorName} mentioned you`;
    default:
      return preview ?? `${actorName} did something`;
  }
}

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function NotificationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, link, preview, created_at, read_at, actor_id, profiles!notifications_actor_id_fkey(display_name, avatar_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Notifications</h1>
      <div className="flex flex-col gap-1">
        {(notifications ?? []).map((n: any) => (
          <Link
            key={n.id}
            href={n.link}
            className={`flex items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10 ${
              n.read_at ? "bg-white dark:bg-neutral-900" : "bg-ink/5 dark:bg-white/5"
            }`}
          >
            <Avatar url={n.profiles?.avatar_url} name={n.profiles?.display_name} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink dark:text-neutral-100">
                {labelFor(n.type, n.profiles?.display_name ?? "Someone", n.preview)}
              </p>
              <p className="text-xs text-ink/40 dark:text-neutral-500">{timeAgo(n.created_at)}</p>
            </div>
          </Link>
        ))}
        {notifications?.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-neutral-400">No notifications yet.</p>
        ) : null}
      </div>
    </div>
  );
}