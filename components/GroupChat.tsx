"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { notifyTags } from "@/lib/notifications";
import { renderRichText } from "@/lib/richText";

type GroupMessage = {
  id: string;
  group_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender_name?: string;
};

export function GroupChat({
  groupId,
  userId,
  initialMessages,
}: {
  groupId: string;
  userId: string;
  initialMessages: GroupMessage[];
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`group-${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "group_messages" },
        (payload) => {
          const m = payload.new as GroupMessage;
          if (m.group_id === groupId) {
            setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const text = body;
    setBody("");
    await supabase.from("group_messages").insert({ group_id: groupId, sender_id: userId, body: text });
    notifyTags({ text, actorId: userId, link: `/groups/${groupId}` });
  }

  return (
    <div className="flex h-[65vh] flex-col rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={`mb-2 flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
            <div>
              {m.sender_id !== userId ? (
                <p className="mb-0.5 text-[11px] text-ink/40">{m.sender_name ?? "Student"}</p>
              ) : null}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  m.sender_id === userId ? "bg-ink text-white" : "bg-black/5 text-ink"
                }`}
              >
                {renderRichText(m.body)}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 ? <p className="text-sm text-ink/50">No messages yet — say hello.</p> : null}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/10">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message"
          className="flex-1 rounded-lg border border-black/15 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">
          Send
        </button>
      </form>
    </div>
  );
}