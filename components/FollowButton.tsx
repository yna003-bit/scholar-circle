"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function FollowButton({
  userId,
  targetId,
  initiallyFollowing,
}: {
  userId: string;
  targetId: string;
  initiallyFollowing: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [following, setFollowing] = useState(initiallyFollowing);

  async function toggle() {
    if (following) {
      await supabase.from("follows").delete().match({ follower_id: userId, followed_id: targetId });
    } else {
      await supabase.from("follows").insert({ follower_id: userId, followed_id: targetId });
    }
    setFollowing(!following);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className={
        following
          ? "rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
          : "rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white"
      }
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
