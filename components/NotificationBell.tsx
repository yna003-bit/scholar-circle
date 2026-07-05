"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "lucide-react";

export function NotificationBell({ userId, initialCount }: { userId: string; initialCount: number }) {
  const supabase = createClient();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => {
          setCount((c) => c + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <Link href="/notifications" className="relative flex items-center p-1 text-ink dark:text-neutral-200">
      <Bell size={20} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}