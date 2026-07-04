"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CreateGroupForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("groups").insert({
      creator_id: userId,
      name: form.name,
      description: form.description,
    });
    setForm({ name: "", description: "" });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 w-full rounded-lg border border-black/10 bg-white py-2 text-sm font-medium text-ink/70 hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300"
      >
        Create a group
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mb-4 flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
    >
      <input
        required
        placeholder="Group name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="rounded-lg border border-black/15 px-3 py-2 text-sm"
      />
      <textarea
        placeholder="What's this group about?"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="rounded-lg border border-black/15 px-3 py-2 text-sm"
        rows={3}
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">
          Create
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-ink/60">
          Cancel
        </button>
      </div>
    </form>
  );
}