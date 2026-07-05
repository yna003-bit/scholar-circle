"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Ban } from "lucide-react";

export function SuspendToggle({ targetId, initiallySuspended }: { targetId: string; initiallySuspended: boolean }) {
  const supabase = createClient();
  const router = useRouter();
  const [suspended, setSuspended] = useState(initiallySuspended);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!suspended) {
      const confirmed = confirm(
        "Suspend this account? They won't be able to use the app until you unsuspend them."
      );
      if (!confirmed) return;
    }
    setBusy(true);
    const { error } = await supabase.rpc("set_suspended", { target_id: targetId, suspended: !suspended });
    setBusy(false);
    if (error) {
      alert("Couldn't update suspension: " + error.message);
      return;
    }
    setSuspended(!suspended);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={
        suspended
          ? "flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white"
          : "flex items-center gap-1.5 rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-600 dark:border-orange-900 dark:text-orange-400"
      }
    >
      <Ban size={14} />
      {suspended ? "Unsuspend" : "Suspend"}
    </button>
  );
}