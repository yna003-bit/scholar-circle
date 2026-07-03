"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  school: string | null;
  bio: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    display_name: profile.display_name ?? "",
    username: profile.username ?? "",
    school: profile.school ?? "",
    bio: profile.bio ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);

    const cleanUsername = form.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: form.display_name,
        username: cleanUsername || null,
        school: form.school || null,
        bio: form.bio || null,
      })
      .eq("id", profile.id);

    setBusy(false);

    if (error) {
      if (error.code === "23505") {
        setError("That username is already taken — try another.");
      } else {
        setError("Something went wrong saving your profile.");
      }
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4">
      <label className="text-xs font-medium text-ink/60">
        Display name
        <input
          value={form.display_name}
          onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
      </label>

      <label className="text-xs font-medium text-ink/60">
        Username
        <div className="mt-1 flex items-center rounded-lg border border-black/15 px-3 py-2 text-sm">
          <span className="text-ink/40">@</span>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="yourname"
            className="ml-1 flex-1 outline-none"
          />
        </div>
        <span className="mt-1 block text-[11px] text-ink/40">
          Lowercase letters, numbers, and underscores only. This is how other students can find
          you.
        </span>
      </label>

      <label className="text-xs font-medium text-ink/60">
        School
        <input
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
      </label>

      <label className="text-xs font-medium text-ink/60">
        Bio
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          rows={3}
        />
      </label>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {saved ? <p className="text-xs text-green-700">Saved.</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white"
      >
        {busy ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}