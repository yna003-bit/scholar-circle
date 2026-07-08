"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    setPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        type="password"
        required
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-100"
      />
      <input
        type="password"
        required
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink dark:border-white/15 dark:bg-neutral-800 dark:text-neutral-100"
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {saved ? (
        <p className="text-xs text-green-700 dark:text-green-400">
          Password set. Make sure you also have a username on your Profile page, then you can sign
          in with username + password next time.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="w-fit rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white"
      >
        {busy ? "Saving..." : "Set password"}
      </button>
    </form>
  );
}