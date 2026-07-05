"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";

export function NotificationItem({
  id,
  link,
  avatarUrl,
  name,
  label,
  timeLabel,
  unread,
}: {
  id: string;
  link: string;
  avatarUrl: string | null;
  name: string | null;
  label: string;
  timeLabel: string;
  unread: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    await supabase.from("notifications").delete().eq("id", id);
    router.push(link);
    router.refresh();
  }

  return (
    
      href={link}
      onClick={handleClick}
      className={`flex items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10 ${
        unread ? "bg-ink/5 dark:bg-white/5" : "bg-white dark:bg-neutral-900"
      }`}
    >
      <Avatar url={avatarUrl} name={name} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink dark:text-neutral-100">{label}</p>
        <p className="text-xs text-ink/40 dark:text-neutral-500">{timeLabel}</p>
      </div>
    </a>
  );
}