import { createClient } from "@/lib/supabase/client";
import { extractUsernames } from "@/lib/tags";

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

export async function notifyTags({
  text,
  actorId,
  link,
}: {
  text: string;
  actorId: string;
  link: string;
}) {
  const usernames = extractUsernames(text);
  if (usernames.length === 0) return;

  const supabase = createClient();
  const { data: taggedProfiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("username", usernames);

  for (const p of taggedProfiles ?? []) {
    await notify({ userId: p.id, actorId, type: "tag", link, preview: "mentioned you" });
  }
}