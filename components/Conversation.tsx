"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { Check, CheckCheck, MoreVertical } from "lucide-react";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
  delivered_at?: string | null;
  read_at?: string | null;
  edited_at?: string | null;
  deleted_for_everyone?: boolean;
  attachment_url?: string | null;
  attachment_type?: string | null;
};

type PersonInfo = { name: string | null; avatarUrl: string | null };

const EDIT_WINDOW_MS = 2 * 60 * 1000;

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageTicks({ message }: { message: Message }) {
  if (message.read_at) return <CheckCheck size={13} className="text-blue-400" />;
  if (message.delivered_at) return <CheckCheck size={13} className="text-white/60" />;
  return <Check size={13} className="text-white/60" />;
}

function MessageBubble({
  message,
  isMine,
  person,
  personId,
  onEdit,
  onDeleteForEveryone,
  onDeleteForMe,
}: {
  message: Message;
  isMine: boolean;
  person: PersonInfo;
  personId: string;
  onEdit: (id: string, newBody: string) => void;
  onDeleteForEveryone: (id: string) => void;
  onDeleteForMe: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(message.body);

  const canEdit =
    isMine &&
    !message.deleted_for_everyone &&
    Date.now() - new Date(message.created_at).getTime() < EDIT_WINDOW_MS;

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editBody.trim()) return;
    onEdit(message.id, editBody);
    setEditing(false);
  }

  return (
    <div className={`mb-3 flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine ? (
        <Link href={`/profile/${personId}`} className="shrink-0">
          <Avatar url={person.avatarUrl} name={person.name} size={28} />
        </Link>
      ) : null}
      <div className={`group flex max-w-[75%] flex-col ${isMine ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1">
          {isMine ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Message options"
                className="opacity-0 transition-opacity group-hover:opacity-100 text-ink/40 hover:text-ink/70 dark:text-neutral-500"
              >
                <MoreVertical size={14} />
              </button>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-black/10 bg-white py-1 text-xs shadow-sm dark:border-white/10 dark:bg-neutral-800">
                    {canEdit ? (
                      <button
                        onClick={() => {
                          setEditing(true);
                          setMenuOpen(false);
                        }}
                        className="block w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Edit
                      </button>
                    ) : null}
                    {!message.deleted_for_everyone ? (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDeleteForEveryone(message.id);
                        }}
                        className="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        Delete for everyone
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteForMe(message.id);
                      }}
                      className="block w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Delete for me
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
          {!isMine ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Message options"
                className="opacity-0 transition-opacity group-hover:opacity-100 text-ink/40 hover:text-ink/70 dark:text-neutral-500"
              >
                <MoreVertical size={14} />
              </button>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute left-0 z-20 mt-1 w-36 rounded-lg border border-black/10 bg-white py-1 text-xs shadow-sm dark:border-white/10 dark:bg-neutral-800">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteForMe(message.id);
                      }}
                      className="block w-full px-3 py-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      Delete for me
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {editing ? (
          <form onSubmit={saveEdit} className="flex flex-col gap-1">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={2}
              className="w-64 resize-none rounded-lg border border-black/15 px-2 py-1.5 text-sm"
              autoFocus
            />
            <div className="flex gap-2 text-xs">
              <button type="submit" className="text-ink underline dark:text-neutral-100">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-ink/50">
                Cancel
              </button>
            </div>
          </form>
        ) : message.deleted_for_everyone ? (
          <div className="rounded-lg bg-black/5 px-3 py-2 text-sm italic text-ink/40 dark:bg-white/5 dark:text-neutral-500">
            This message was deleted
          </div>
        ) : (
          <div
            className={`flex items-end gap-1.5 rounded-lg px-3 py-2 text-sm ${
              isMine ? "bg-ink text-white" : "bg-black/5 text-ink dark:bg-white/10 dark:text-neutral-100"
            }`}
          >
            <span>{message.body}</span>
            {isMine ? <MessageTicks message={message} /> : null}
          </div>
        )}

        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-ink/40 dark:text-neutral-500">
          <span>{formatTime(message.created_at)}</span>
          {message.edited_at ? <span>· edited</span> : null}
        </div>
      </div>
      {isMine ? (
        <Link href={`/profile/${personId}`} className="shrink-0">
          <Avatar url={person.avatarUrl} name={person.name} size={28} />
        </Link>
      ) : null}
    </div>
  );
}

export function Conversation({
  userId,
  otherId,
  initialMessages,
  myProfile,
  otherProfile,
}: {
  userId: string;
  otherId: string;
  initialMessages: Message[];
  myProfile: PersonInfo;
  otherProfile: PersonInfo;
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const channelName = `conversation-${[userId, otherId].sort().join("-")}`;

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          const belongs =
            (m.sender_id === userId && m.receiver_id === otherId) ||
            (m.sender_id === otherId && m.receiver_id === userId);
          if (!belongs) return;

          setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));

          if (m.receiver_id === userId) {
            supabase
              .from("messages")
              .update({ delivered_at: new Date().toISOString(), read_at: new Date().toISOString() })
              .eq("id", m.id)
              .then();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => prev.map((p) => (p.id === m.id ? { ...p, ...m } : p)));
        }
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload?.userId === otherId) {
          setOtherTyping(true);
          if (typingTimeout.current) clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setOtherTyping(false), 3000);
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, otherId, channelName, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, otherTyping]);

  function broadcastTyping() {
    channelRef.current?.send({
      type: "broadcast",
      event: "typing",
      payload: { userId },
    });
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const text = body;
    setBody("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: otherId, body: text });
  }

  async function handleEdit(id: string, newBody: string) {
    await supabase
      .from("messages")
      .update({ body: newBody, edited_at: new Date().toISOString() })
      .eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, body: newBody, edited_at: new Date().toISOString() } : m)));
  }

  async function handleDeleteForEveryone(id: string) {
    if (!confirm("Delete this message for everyone? This can't be undone.")) return;
    await supabase.from("messages").update({ body: "", deleted_for_everyone: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, body: "", deleted_for_everyone: true } : m)));
  }

  async function handleDeleteForMe(id: string) {
    await supabase.from("message_deletions").insert({ message_id: id, user_id: userId });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="relative flex h-[70vh] flex-col overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="rotate-[-20deg] whitespace-nowrap text-5xl font-semibold text-ink/[0.04] dark:text-white/[0.04]">
          Scholar Circle Scholar Circle Scholar Circle
        </span>
      </div>

      <div className="relative flex-1 overflow-y-auto p-4">
        {messages.map((m) => {
          const isMine = m.sender_id === userId;
          const person = isMine ? myProfile : otherProfile;
          const personId = isMine ? userId : otherId;

          return (
            <MessageBubble
              key={m.id}
              message={m}
              isMine={isMine}
              person={person}
              personId={personId}
              onEdit={handleEdit}
              onDeleteForEveryone={handleDeleteForEveryone}
              onDeleteForMe={handleDeleteForMe}
            />
          );
        })}
        {messages.length === 0 ? (
          <p className="relative text-sm text-ink/50 dark:text-neutral-400">No messages yet — say hello.</p>
        ) : null}
        {otherTyping ? (
          <p className="relative text-xs italic text-ink/40 dark:text-neutral-500">
            {otherProfile.name ?? "They"} {otherProfile.name ? "is" : "are"} typing...
          </p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="relative flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            broadcastTyping();
          }}
          placeholder="Write a message"
          rows={1}
          className="min-h-[38px] max-h-32 flex-1 resize-none overflow-y-auto rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="h-fit self-end rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}