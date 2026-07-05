"use client";

import { useState, useRef, createElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThumbsUp, MessageCircle, Share2, Pencil, Trash2, Bookmark, Image as ImageIcon, X, Repeat2 } from "lucide-react";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "@/components/Avatar";

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
  image_url?: string | null;
  profiles: { display_name: string; is_verified?: boolean; avatar_url?: string | null } | null;
  likes: { user_id: string }[];
  saved_posts: { user_id: string }[];
  reposts: { user_id: string }[];
  comments: {
    id: string;
    body: string;
    user_id: string;
    profiles: { display_name: string } | null;
    comment_likes: { user_id: string }[];
  }[];
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
      return createElement(
        "a",
        {
          key: i,
          href: href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "break-all text-blue-600 underline dark:text-blue-400",
        },
        part
      );
    }
    return <span key={i}>{part}</span>;
  });
}

async function uploadPostImage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File
): Promise<string | null> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) {
    alert("Couldn't upload image: " + error.message);
    return null;
  }
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export function PostForm({ userId }: { userId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageBusy(true);
    const url = await uploadPostImage(supabase, userId, file);
    if (url) setImageUrl(url);
    setImageBusy(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("opportunities").insert({
      author_id: userId,
      title: form.title,
      description: form.description,
      image_url: imageUrl,
    });
    setForm({ title: "", description: "" });
    setImageUrl(null);
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

      {imageUrl ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="max-h-64 w-full rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-black/15 px-3 py-2 text-xs font-medium text-ink/70 dark:text-neutral-300">
          <ImageIcon size={15} />
          {imageBusy ? "Uploading..." : "Add a picture"}
          <input type="file" accept="image/*" onChange={handleImageChange} disabled={imageBusy} className="hidden" />
        </label>
      )}

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

export function OpportunityCard({
  opp,
  userId,
  isAdmin,
  repostedBy,
}: {
  opp: Opportunity;
  userId: string;
  isAdmin?: boolean;
  repostedBy?: { id: string; name: string | null } | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const liked = opp.likes.some((l) => l.user_id === userId);
  const saved = opp.saved_posts.some((s) => s.user_id === userId);
  const reposted = opp.reposts.some((r) => r.user_id === userId);
  const isAuthor = opp.author_id === userId;
  const canDeletePost = isAuthor || !!isAdmin;
  const [commentBody, setCommentBody] = useState("");
  const [showComments, setShowComments] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: opp.title, description: opp.description ?? "" });
  const [editImageUrl, setEditImageUrl] = useState<string | null>(opp.image_url ?? null);
  const [editImageBusy, setEditImageBusy] = useState(false);

  async function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageBusy(true);
    const url = await uploadPostImage(supabase, userId, file);
    if (url) setEditImageUrl(url);
    setEditImageBusy(false);
  }

  async function toggleLike() {
    if (liked) {
      await supabase.from("likes").delete().match({ user_id: userId, opportunity_id: opp.id });
    } else {
      await supabase.from("likes").insert({ user_id: userId, opportunity_id: opp.id });
    }
    router.refresh();
  }

  async function toggleSave() {
    if (saved) {
      await supabase.from("saved_posts").delete().match({ user_id: userId, opportunity_id: opp.id });
    } else {
      await supabase.from("saved_posts").insert({ user_id: userId, opportunity_id: opp.id });
    }
    router.refresh();
  }

  async function toggleRepost() {
    if (reposted) {
      await supabase.from("reposts").delete().match({ user_id: userId, opportunity_id: opp.id });
    } else {
      await supabase.from("reposts").insert({ user_id: userId, opportunity_id: opp.id });
    }
    router.refresh();
  }

  async function deletePost() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await supabase.from("opportunities").delete().eq("id", opp.id);
    router.refresh();
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    await supabase.from("comments").insert({ user_id: userId, opportunity_id: opp.id, body: commentBody });
    setCommentBody("");
    if (commentInputRef.current) commentInputRef.current.style.height = "auto";
    router.refresh();
  }

  async function toggleCommentLike(commentId: string, alreadyLiked: boolean) {
    if (alreadyLiked) {
      await supabase.from("comment_likes").delete().match({ comment_id: commentId, user_id: userId });
    } else {
      await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: userId });
    }
    router.refresh();
  }

  async function deleteComment(commentId: string) {
    await supabase.from("comments").delete().eq("id", commentId);
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
      .update({ title: editForm.title, description: editForm.description, image_url: editImageUrl })
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

          {editImageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editImageUrl} alt="" className="max-h-64 w-full rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => setEditImageUrl(null)}
                aria-label="Remove image"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-black/15 px-3 py-2 text-xs font-medium text-ink/70 dark:text-neutral-300">
              <ImageIcon size={15} />
              {editImageBusy ? "Uploading..." : "Add a picture"}
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                disabled={editImageBusy}
                className="hidden"
              />
            </label>
          )}

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
          {repostedBy ? (
            <Link
              href={`/profile/${repostedBy.id}`}
              className="mb-2 flex items-center gap-1.5 text-xs text-ink/50 hover:underline dark:text-neutral-500"
            >
              <Repeat2 size={13} />
              Reposted by {repostedBy.name ?? "a student"}
            </Link>
          ) : null}
          <div className="flex items-start justify-between gap-2">
            <Link href={`/profile/${opp.author_id}`} className="flex items-center gap-2.5">
              <Avatar url={opp.profiles?.avatar_url} name={opp.profiles?.display_name} size={36} />
              <div>
                <p className="text-sm font-medium hover:underline">
                  {opp.profiles?.display_name ?? "A student"}
                  <VerifiedBadge verified={opp.profiles?.is_verified} />
                </p>
                <p className="text-xs text-ink/40 dark:text-neutral-500">{timeAgo(opp.created_at)}</p>
              </div>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              {opp.amount ? (
                <span className="whitespace-nowrap rounded-md bg-ink/5 px-2 py-1 text-xs font-medium text-ink dark:bg-white/10 dark:text-neutral-100">
                  {opp.currency ?? "EUR"} {opp.amount}
                </span>
              ) : null}
              <button
                onClick={toggleSave}
                aria-label={saved ? "Unsave post" : "Save post"}
                className={
                  saved
                    ? "text-ink dark:text-neutral-100"
                    : "text-ink/40 hover:text-ink/70 dark:text-neutral-500 dark:hover:text-neutral-200"
                }
              >
                <Bookmark size={15} className={saved ? "fill-current" : ""} />
              </button>
              {isAuthor ? (
                <button
                  onClick={() => setEditing(true)}
                  aria-label="Edit post"
                  className="text-ink/40 hover:text-ink/70 dark:text-neutral-500 dark:hover:text-neutral-200"
                >
                  <Pencil size={15} />
                </button>
              ) : null}
              {canDeletePost ? (
                <button
                  onClick={deletePost}
                  aria-label="Delete post"
                  className="text-ink/40 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-400"
                >
                  <Trash2 size={15} />
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

          {opp.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={opp.image_url}
              alt=""
              className="mt-3 max-h-96 w-full rounded-lg object-cover"
            />
          ) : null}

          {opp.deadline ? (
            <p className="mt-1 text-xs text-ink/50 dark:text-neutral-400">Deadline: {opp.deadline}</p>
          ) : null}

          {opp.likes.length > 0 || opp.comments.length > 0 || opp.reposts.length > 0 ? (
            <p className="mt-3 text-xs text-ink/40 dark:text-neutral-500">
              {opp.likes.length > 0 ? `${opp.likes.length} likes` : ""}
              {opp.likes.length > 0 && opp.comments.length > 0 ? " · " : ""}
              {opp.comments.length > 0 ? (
                <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                  {opp.comments.length} comments
                </button>
              ) : null}
              {(opp.likes.length > 0 || opp.comments.length > 0) && opp.reposts.length > 0 ? " · " : ""}
              {opp.reposts.length > 0 ? `${opp.reposts.length} reposts` : ""}
            </p>
          ) : null}

          <div className="mt-1 grid grid-cols-4 border-t border-black/10 pt-1 dark:border-white/10">
            <button
              onClick={toggleLike}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
                liked ? "font-medium text-blue-600 dark:text-blue-400" : "text-ink/60 dark:text-neutral-400"
              }`}
            >
              <ThumbsUp size={16} className={liked ? "fill-current" : ""} />
              Like
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-ink/60 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              <MessageCircle size={16} />
              Comment
            </button>
            <button
              onClick={toggleRepost}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
                reposted ? "font-medium text-green-600 dark:text-green-400" : "text-ink/60 dark:text-neutral-400"
              }`}
            >
              <Repeat2 size={16} />
              Repost
            </button>
            <button
              onClick={share}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-ink/60 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/5"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {showComments ? (
            <div className="mt-2 border-t border-black/5 pt-2 dark:border-white/5">
              {opp.comments.map((c) => {
                const commentLiked = c.comment_likes.some((l) => l.user_id === userId);
                const canDelete = c.user_id === userId || isAuthor;
                return (
                  <div key={c.id} className="mb-2">
                    <p className="text-xs text-ink/70 dark:text-neutral-300">
                      <span className="font-medium">{c.profiles?.display_name ?? "Student"}:</span> {c.body}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-ink/40 dark:text-neutral-500">
                      <button
                        onClick={() => toggleCommentLike(c.id, commentLiked)}
                        className={
                          commentLiked ? "font-medium text-blue-600 dark:text-blue-400" : "hover:text-ink/70 dark:hover:text-neutral-300"
                        }
                      >
                        Like{c.comment_likes.length > 0 ? ` (${c.comment_likes.length})` : ""}
                      </button>
                      {canDelete ? (
                        <button onClick={() => deleteComment(c.id)} className="hover:text-red-600">
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <form onSubmit={addComment} className="mt-2 flex gap-2">
                <textarea
                  ref={commentInputRef}
                  value={commentBody}
                  onChange={(e) => {
                    setCommentBody(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder="Write a comment"
                  rows={1}
                  className="min-h-[32px] flex-1 resize-none overflow-hidden rounded-lg border border-black/15 px-3 py-1.5 text-xs"
                />
                <button
                  type="submit"
                  className="h-fit self-end rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white"
                >
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