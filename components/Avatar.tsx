export function Avatar({
  url,
  name,
  size = 36,
  active,
}: {
  url?: string | null;
  name?: string | null;
  size?: number;
  active?: boolean;
}) {
  const initials = (name ?? "?").slice(0, 2).toUpperCase();
  const dotSize = Math.max(8, Math.round(size * 0.28));

  return (
    <div className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name ?? "Profile photo"}
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      ) : (
        <div
          style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
          className="flex items-center justify-center rounded-full bg-ink/5 font-medium text-ink dark:bg-white/10 dark:text-neutral-100"
        >
          {initials}
        </div>
      )}
      {active !== undefined ? (
        <span
          style={{ width: dotSize, height: dotSize }}
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-neutral-900 ${
            active ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
          }`}
          aria-label={active ? "Active now" : "Offline"}
        />
      ) : null}
    </div>
  );
}