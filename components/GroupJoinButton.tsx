"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function GroupJoinButton({
  userId,
  groupId,
  initiallyJoined,
}: {
  userId: string;
  groupId: string;
  initiallyJoined: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [joined, setJoined] = useState(initiallyJoined);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    if (joined) {
      await supabase.from("group_members").delete().match({ group_id: groupId, user_id: userId });
    } else {
      await supabase.from("group_members").insert({ group_id: groupId, user_id: userId });
    }
    setJoined(!joined);
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={
        joined
          ? "rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
          : "rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white"
      }
    >
      {joined ? "Joined" : "Join"}
    </button>
  );
}