"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";

type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  school: string | null;
  bio: string | null;
  avatar_url?: string | null;
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
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);

    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setAvatarBusy(false);
      alert("Couldn't upload photo: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);

    setAvatarUrl(publicUrl);
    setAvatarBusy(false);
    router.refresh();
  }

  async function removeAvatar() {
    setAvatarBusy(true);
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", profile.id);
    setAvatarUrl(null);
    setAvatarBusy(false);
    router.refresh();
  }

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <Avatar url={avatarUrl} name={form.display_name} size={56} />
        <div className="flex flex-col gap-1">
          <label className="cursor-pointer text-xs font-medium text-ink underline dark:text-neutral-100">
            {avatarBusy ? "Uploading..." : avatarUrl ? "Change photo" : "Add photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={avatarBusy}
              className="hidden"
            />
          </label>
          {avatarUrl ? (
            <button
              onClick={removeAvatar}
              disabled={avatarBusy}
              className="text-left text-xs text-red-600 underline"
            >
              Remove photo
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={save} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <label className="text-xs font-medium text-ink/60 dark:text-neutral-400">
          Display name
          <input
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="text-xs font-medium text-ink/60 dark:text-neutral-400">
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

        <label className="text-xs font-medium text-ink/60 dark:text-neutral-400">
          School
          <input
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
        </label>

        <label className="text-xs font-medium text-ink/60 dark:text-neutral-400">
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
    </div>
  );
}