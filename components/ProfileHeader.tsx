import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadge } from "@/components/VerifiedBadge";

function StatChip({ href, count, label }: { href: string; count: number; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
    >
      <span
        className="text-base font-semibold text-blue-700 dark:text-blue-300"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        {count}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-blue-500/70 dark:text-blue-400/70">
        {label}
      </span>
    </Link>
  );
}

function InfoBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs text-ink/70 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
      {icon}
      {label}
    </span>
  );
}

export function ProfileHeader({
  profileId,
  avatarUrl,
  displayName,
  username,
  bio,
  school,
  city,
  country,
  isVerified,
  active,
  statusLabel,
  postedCount,
  followerCount,
  followingCount,
  actions,
}: {
  profileId: string;
  avatarUrl: string | null;
  displayName: string;
  username: string | null;
  bio: string | null;
  school: string | null;
  city: string | null;
  country: string | null;
  isVerified: boolean;
  active?: boolean;
  statusLabel?: string;
  postedCount: number;
  followerCount: number;
  followingCount: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
      <div className="relative flex h-16 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950">
        <span
          className="select-none text-2xl italic tracking-wide text-blue-700/25 dark:text-blue-200/20"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Scholar Circle
        </span>
      </div>
      <div className="px-5 pb-5 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="rounded-full border-4 border-white bg-white dark:border-neutral-900 dark:bg-neutral-900">
            <Avatar url={avatarUrl} name={displayName} size={76} active={active} />
          </div>
          <div className="grid grid-cols-3 gap-2 sm:mb-1 sm:flex">
            <StatChip href={`/profile/${profileId}/posts`} count={postedCount} label="Posts" />
            <StatChip href={`/profile/${profileId}/followers`} count={followerCount} label="Followers" />
            <StatChip href={`/profile/${profileId}/following`} count={followingCount} label="Following" />
          </div>
        </div>

        <p className="mt-3 text-base font-semibold text-ink dark:text-neutral-100">
          {displayName}
          <VerifiedBadge verified={isVerified} />
        </p>
        <div className="flex items-center gap-2">
          {username ? <p className="text-xs text-ink/40 dark:text-neutral-500">@{username}</p> : null}
          {statusLabel ? <p className="text-xs text-blue-500 dark:text-blue-400">{statusLabel}</p> : null}
        </div>

        {school || city || country ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {school ? <InfoBadge icon={<GraduationCap size={12} />} label={school} /> : null}
            {city || country ? (
              <InfoBadge icon={<MapPin size={12} />} label={[city, country].filter(Boolean).join(", ")} />
            ) : null}
          </div>
        ) : null}

        {bio ? <p className="mt-3 text-sm text-ink/70 dark:text-neutral-300">{bio}</p> : null}

        {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}