import { InviteShare } from "@/components/InviteShare";

export default function InvitePage() {
  return (
    <div>
      <h1 className="mb-2 text-lg font-medium">Invite friends</h1>
      <p className="mb-4 text-sm text-ink/70 dark:text-neutral-300">
        Know someone hunting for scholarships or sponsorships? Send them this link — they can sign
        up in a minute and start finding opportunities and connecting with other students.
      </p>
      <InviteShare />
    </div>
  );
}