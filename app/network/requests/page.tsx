import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FriendButton } from "@/components/FriendButton";

export default async function FriendRequestsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: incoming } = await supabase
    .from("friend_requests")
    .select("id, sender_id, status, profiles!friend_requests_sender_id_fkey(display_name, school)")
    .eq("receiver_id", user.id)
    .eq("status", "pending");

  return (
    <div>
      <Link href="/network" className="mb-4 inline-block text-xs text-ink/60 underline">
        &larr; Back to students
      </Link>
      <h1 className="mb-4 text-lg font-medium">Friend requests</h1>
      <div className="flex flex-col gap-2">
        {(incoming ?? []).map((req: any) => (
          <div key={req.id} className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                {req.profiles?.display_name?.slice(0, 2).toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-medium">{req.profiles?.display_name ?? "A student"}</p>
                <p className="text-xs text-ink/50">{req.profiles?.school ?? "No school listed"}</p>
              </div>
            </div>
            <FriendButton
              userId={user.id}
              targetId={req.sender_id}
              requestId={req.id}
              initialStatus="received"
            />
          </div>
        ))}
        {incoming?.length === 0 ? <p className="text-sm text-ink/50">No pending requests.</p> : null}
      </div>
    </div>
  );
}