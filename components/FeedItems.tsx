"use client";

import { useState } from "react";
import Link from "next/link";
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
  created_at: string;
  profiles: { display_name: string } | null;
  likes: { user_id: string }[];
  comments: { id: string; body: string; user_id: string; profiles: { display_name: string } | null }[];
};

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function initials(name: string | undefined | null) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

function linkify(text: string) {
  const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/^(?:https?:\/\/|www\.)/.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
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
  const [commentBody, setCommentBody] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: opp.title, description: opp.description ?? "" });

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

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    await supabase
      .from("opportunities")
      .update({ title: editForm.title, description: editForm.description })
      .eq("id", opp.id);
    setEditing(false);
    router.refresh();
  }

  return (
    <div
      id={opp.id}
      className="mb-3 rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
    >
      {editing ? (
        <form onSubmit={saveEdit} className="flex flex-col gap-2">
          <input
            required
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <textarea
            required
            value={editForm.description}
            onChange={(e) => {
              setEditForm({ ...editForm, description: e.target.value });
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="min-h-[96px] resize-none overflow-hidden rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-ink/60">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/profile/${opp.author_id}`} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink dark:bg-white/10 dark:text-neutral-100">
                {initials(opp.profiles?.display_name)}
              </div>
              <div>
                <p className="text-sm font-medium hover:underline">{opp.profiles?.display_name ?? "A student"}</p>
                <p className="text-xs text-ink/40 dark:text-neutral-500">{timeAgo(opp.created_at)}</p>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              {opp.amount ? (
                <span className="whitespace-nowrap rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink dark:bg-white/10 dark:text-neutral-100">
                  {opp.currency ?? "EUR"} {opp.amount}
                </span>
              ) : null}
              {isAuthor ? (
                <button
                  onClick={() => setEditing(true)}
                  aria-label="Edit post"
                  className="text-ink/40 hover:text-ink/70 dark:text-neutral-500 dark:hover:text-neutral-200"
                >
                  <Pencil size={15} />
                </button>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-sm font-medium">{opp.title}</p>
          {opp.sponsor_name ? (
            <p className="text-xs text-ink/50 dark:text-neutral-400">{opp.sponsor_name}</p>
          ) : null}

          {opp.description ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink/70 dark:text-neutral-300">
              {linkify(opp.description)}
            </p>
          ) : null}
          {opp.deadline ? (
            <p className="mt-1 text-xs text-ink/50 dark:text-neutral-400">Deadline: {opp.deadline}</p>
          ) : null}

          {opp.likes.length > 0 || opp.comments.length > 0 ? (
            <p className="mt-3 text-xs text-ink/40 dark:text-neutral-500">
              {opp.likes.length > 0 ? `${opp.likes.length} likes` : ""}
              {opp.likes.length > 0 && opp.comments.length > 0 ? " · " : ""}
              {opp.comments.length > 0 ? `${opp.comments.length} comments` : ""}
            </p>
          ) : null}

          <div className="mt-1 grid grid-cols-3 border-t border-black/10 pt-1 dark:border-white/10">
            <button
              onClick={toggleLike}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
                liked ? "font-medium text-blue-600 dark:text-blue-400" : "text-ink/60 dark:text-neutral-400"
              }`}
            >
              <ThumbsUp size={16} className={liked ? "fill-current" : ""} />
              Like
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-ink/60 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              <MessageCircle size={16} />
              Comment
            </button>
            <button
              onClick={share}
              className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-ink/60 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {showComments ? (
            <div className="mt-2 border-t border-black/5 pt-2 dark:border-white/5">
              {opp.comments.map((c) => (
                <p key={c.id} className="mb-1 text-xs text-ink/70 dark:text-neutral-300">
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
        </>
      )}
    </div>
  );
}
