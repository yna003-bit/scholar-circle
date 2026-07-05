"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function PresenceHeartbeat({ userId }: { userId: string }) {
  useEffect(() => {
    const supabase = createClient();

    async function ping() {
      await supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", userId);
    }

    ping();
    const interval = setInterval(ping, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  return null;
}