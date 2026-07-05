"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Ban } from "lucide-react";

export function BlockToggle({
  userId,
  targetId,
  initiallyBlocked,
}: {
  userId: string;
  targetId: string;
  initiallyBlocked: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [blocked, setBlocked] = useState(initiallyBlocked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (blocked) {
      setBusy(true);
      await supabase.from("blocks").delete().match({ blocker_id: userId, blocked_id: targetId });
      setBlocked(false);
      setBusy(false);
      router.refresh();
      return;
    }

    const confirmed = confirm(
      "Block this student? They won't be able to message you, and you won't see each other's posts. This also removes any follow or friend connection between you."
    );
    if (!confirmed) return;

    setBusy(true);
    await supabase.from("blocks").insert({ blocker_id: userId, blocked_id: targetId });
    await supabase.from("follows").delete().match({ follower_id: userId, followed_id: targetId });
    await supabase.from("follows").delete().match({ follower_id: targetId, followed_id: userId });
    await supabase
      .from("friend_requests")
      .delete()
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${userId})`
      );
    setBlocked(true);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={
        blocked
          ? "flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
          : "flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900 dark:text-red-400"
      }
    >
      <Ban size={14} />
      {blocked ? "Unblock" : "Block"}
    </button>
  );
}