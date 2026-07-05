"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

const SITE_URL = "https://www.joinscholarcircle.com";
const SHARE_TEXT =
  "Join me on Scholar Circle — a place to find scholarships and sponsorships, and connect with other students.";

export function InviteShare() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Scholar Circle", text: SHARE_TEXT, url: SITE_URL });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      handleCopy();
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${SHARE_TEXT} ${SITE_URL}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-black/10 bg-white p-3 text-sm text-ink/70 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
        {SITE_URL}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-ink/70 dark:border-white/15 dark:text-neutral-300"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}