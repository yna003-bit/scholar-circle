export function Avatar({
  url,
  name,
  size = 36,
}: {
  url?: string | null;
  name?: string | null;
  size?: number;
}) {
  const initials = (name ?? "?").slice(0, 2).toUpperCase();

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? "Profile photo"}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
      className="flex shrink-0 items-center justify-center rounded-full bg-ink/5 font-medium text-ink dark:bg-white/10 dark:text-neutral-100"
    >
      {initials}
    </div>
  );
}