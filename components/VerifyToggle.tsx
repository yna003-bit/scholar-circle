"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BadgeCheck } from "lucide-react";

export function VerifyToggle({ targetId, initiallyVerified }: { targetId: string; initiallyVerified: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [verified, setVerified] = useState(initiallyVerified);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const { error } = await supabase.rpc("set_verified", { target_id: targetId, verified: !verified });
    setBusy(false);
    if (error) {
      alert("Couldn't update verification: " + error.message);
      return;
    }
    setVerified(!verified);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={
        verified
          ? "flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
          : "flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
      }
    >
      <BadgeCheck size={14} />
      {verified ? "Remove verification" : "Verify"}
    </button>
  );
}