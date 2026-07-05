import { createClient } from "@/lib/supabase/client";

export async function notify({
  userId,
  actorId,
  type,
  link,
  preview,
}: {
  userId: string;
  actorId: string;
  type: string;
  link: string;
  preview?: string;
}) {
  if (userId === actorId) return;
  const supabase = createClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    actor_id: actorId,
    type,
    link,
    preview: preview ?? null,
  });
}