import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationItem } from "@/components/NotificationItem";

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
          <NotificationItem
            key={n.id}
            id={n.id}
            link={n.link}
            avatarUrl={n.profiles?.avatar_url ?? null}
            name={n.profiles?.display_name ?? null}
            label={labelFor(n.type, n.profiles?.display_name ?? "Someone", n.preview)}
            timeLabel={timeAgo(n.created_at)}
            unread={!n.read_at}
          />
        ))}
        {notifications?.length === 0 ? (
          <p className="text-sm text-ink/50 dark:text-neutral-400">No notifications yet.</p>
        ) : null}
      </div>
    </div>
  );
}