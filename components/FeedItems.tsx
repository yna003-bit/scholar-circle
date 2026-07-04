"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
        className="mb-4 w-full rounded-lg border border-black/10 bg-white py-2 text-sm font-medium text-ink/70 hover:bg-black/5"
      >
        Post a scholarship or sponsorship
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mb-4 flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-4">
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
  const [commentBody, setCommentBody] = useState("");
  const [showComments, setShowComments] = useState(false);

  async function toggleLike() {
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: userId, opportunity_id: opp.id });
    } else {
      await supabase.from("likes").insert({ user_id: userId, opportunity_id: opp.id });
    }
    router.refresh();
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    await supabase.from("comments").insert({ user_id: userId, opportunity_id: opp.id, body: commentBody });
    setCommentBody("");
    router.refresh();
  }

  async function share() {
    const url = `${location.origin}/feed#${opp.id}`;
    if (navigator.share) {
      await navigator.share({ title: opp.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  }

  return (
    <div id={opp.id} className="mb-3 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{opp.title}</p>
          <p className="text-xs text-ink/50">
            {opp.sponsor_name ? `${opp.sponsor_name} · ` : ""}posted by {opp.profiles?.display_name ?? "a student"}
          </p>
        </div>
        {opp.amount ? (
          <span className="whitespace-nowrap rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink">
            {opp.currency ?? "EUR"} {opp.amount}
          </span>
        ) : null}
      </div>

      {opp.description ? <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70">{opp.description}</p> : null}
      {opp.deadline ? <p className="mt-1 text-xs text-ink/50">Deadline: {opp.deadline}</p> : null}

      <div className="mt-3 flex gap-4 border-t border-black/5 pt-2 text-xs text-ink/60">
        <button onClick={toggleLike} className={liked ? "font-medium text-ink" : ""}>
          {liked ? "Liked" : "Like"} ({opp.likes.length})
        </button>
        <button onClick={() => setShowComments(!showComments)}>Comments ({opp.comments.length})</button>
        <button onClick={share}>Share</button>
      </div>

      {showComments ? (
        <div className="mt-2 border-t border-black/5 pt-2">
          {opp.comments.map((c) => (
            <p key={c.id} className="mb-1 text-xs text-ink/70">
              <span className="font-medium">{c.profiles?.display_name ?? "Student"}:</span> {c.body}
            </p>
          ))}
          <form onSubmit={addComment} className="mt-2 flex gap-2">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment"
              className="flex-1 rounded-lg border border-black/15 px-3 py-1.5 text-xs"
            />
            <button type="submit" className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white">
              Send
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}