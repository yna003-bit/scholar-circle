"use client";

import { useRouter } from "next/navigation";
import { LANGUAGES, LanguageCode } from "@/lib/translations";

export function LanguageSwitcher({ current }: { current: LanguageCode }) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    document.cookie = `lang=${value}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      aria-label="Language"
      className="w-auto shrink-0 rounded-lg border border-black/15 bg-white px-2 py-1.5 text-xs dark:border-white/15 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}