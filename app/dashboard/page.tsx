import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { count: postedCount } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("author_id", user.id);

  const { count: followerCount } = await supabase
    .from("follows")
    .select("follower_id", { count: "exact", head: true })
    .eq("followed_id", user.id);

  const { count: friendCount } = await supabase
    .from("friend_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

  const { count: unreadCount } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("receiver_id", user.id)
    .is("read_at", null);

  const stats = [
    { label: "Scholarships posted", value: postedCount ?? 0, href: "/feed" },
    { label: "Followers", value: followerCount ?? 0, href: "/network" },
    { label: "Friends", value: friendCount ?? 0, href: "/network" },
    { label: "Unread messages", value: unreadCount ?? 0, href: "/messages" },
  ];

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-lg border border-black/10 bg-white p-4"
          >
            <p className="text-2xl font-medium text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-ink/50">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}