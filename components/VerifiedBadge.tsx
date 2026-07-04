import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ verified }: { verified?: boolean | null }) {
  if (!verified) return null;
  return (
    <BadgeCheck
      size={15}
      className="ml-1 inline-block shrink-0 fill-blue-500 text-white dark:fill-blue-400"
      aria-label="Verified"
    />
  );
}