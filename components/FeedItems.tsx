"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThumbsUp, MessageCircle, Share2, Pencil } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  sponsor_name: string | null;
  amount: number | null;
  currency: string | null;
  deadline: string | null;
  description: string | null;
  tags: string[] | null;
  author_id: string;
  profiles: { display_name: string } | null;
  likes: { user_id: string }[];
  comments: { id: string; body: string; user_id: string; profiles: { display_name: string } | null }[];
};

function linkify(text: string) {
  const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/^(?:https?:\/\/|www\.)/.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-blue-600 underline dark:text-blue-400"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function PostForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("opportunities").insert({
      author_id: userId,
      title: form.title,
      description: form.description,
    });
    setForm({ title: "", description: "" });
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-4 w-full rounded-lg border border-black/10 bg-white py-2 text-sm font-medium text-ink/70 hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300"
      >
        Post a scholarship or sponsorship
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
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="rounded-lg border border-black/15 px-3 py-2 text-sm"
      />
      <textarea
        required
        placeholder="Description — sponsor, amount, deadline, how to apply, anything else"
        value={form.description}
        onChange={(e) => {
          setForm({ ...form, description: e.target.value });
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        className="min-h-[96px] resize-none overflow-hidden rounded-lg border border-black/15 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">
          Post
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-ink/60">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function OpportunityCard({ opp, userId }: { opp: Opportunity; userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const liked = opp.likes.some((l) => l.user_id === userId);
  const isAuthor = opp.author_id === userId;
  const [commentBody, setCommentBody] =