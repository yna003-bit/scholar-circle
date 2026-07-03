"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "none" | "sent" | "received" | "friends";

export function FriendButton({
  userId,
  targetId,
  requestId,
  initialStatus,
}: {
  userId: string;
  targetId: string;
  requestId: string | null;
  initialStatus: Status;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [busy, setBusy] = useState(false);

  async function sendRequest() {
    setBusy(true);
    await supabase.from("friend_requests").insert({ sender_id: userId, receiver_id: targetId });
    setStatus("sent");
    setBusy(false);
    router.refresh();
  }

  async function cancelOrRemove() {
    if (!requestId) return;
    setBusy(true);
    await supabase.from("friend_requests").delete().eq("id", requestId);
    setStatus("none");
    setBusy(false);
    router.refresh();
  }

  async function accept() {
    if (!requestId) return;
    setBusy(true);
    await supabase.from("friend_requests").update({ status: "accepted" }).eq("id", requestId);
    setStatus("friends");
    setBusy(false);
    router.refresh();
  }

  async function decline() {
    if (!requestId) return;
    setBusy(true);
    await supabase.from("friend_requests").delete().eq("id", requestId);
    setStatus("none");
    setBusy(false);
    router.refresh();
  }

  if (status === "friends") {
    return (
      <button
        onClick={cancelOrRemove}
        disabled={busy}
        className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70"
      >
        Friends
      </button>
    );
  }

  if (status === "sent") {
    return (
      <button
        onClick={cancelOrRemove}
        disabled={busy}
        className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/50"
      >
        Requested
      </button>
    );
  }

  if (status === "received") {
    return (
      <div className="flex gap-1">
        <button
          onClick={accept}
          disabled={busy}
          className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white"
        >
          Accept
        </button>
        <button
          onClick={decline}
          disabled={busy}
          className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/60"
        >
          Decline
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={sendRequest}
      disabled={busy}
      className="rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium text-ink/70"
    >
      Add Friend
    </button>
  );
}