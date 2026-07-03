"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
};

export function Conversation({
  userId,
  otherId,
  initialMessages,
}: {
  userId: string;
  otherId: string;
  initialMessages: Message[];
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${userId}-${otherId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new as Message;
          const belongs =
            (m.sender_id === userId && m.receiver_id === otherId) ||
            (m.sender_id === otherId && m.receiver_id === userId);
          if (belongs) {
            setMessages((prev) => (prev.some((p) => p.id === m.id) ? prev : [...prev, m]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, otherId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const text = body;
    setBody("");
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: otherId, body: text });
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-black/10 bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                m.sender_id === userId ? "bg-ink text-white" : "bg-black/5 text-ink"
              }`}
            >
              {m.body}
            </div>
          </div>
        ))}
        {messages.length === 0 ? (
          <p className="text-sm text-ink/50">No messages yet — say hello.</p>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-black/10 p-3">
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