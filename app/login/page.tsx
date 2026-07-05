"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
  }

  return (
    <div className="mx-auto mt-12 max-w-sm rounded-xl border border-black/10 bg-white p-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="Scholar Circle" className="mx-auto mb-4 h-12 w-12" />
      <h1 className="text-lg font-medium">Scholar Circle</h1>
      <p className="text-sm text-ink/60">Find funding. Find your people.</p>
      <p className="mb-6 mt-2 text-xs text-ink/50">
        Scholar Circle is a place for students to discover scholarships and sponsorships, and to
        follow and connect with one another.
      </p>

      <button
        onClick={signInWithGoogle}
        className="mb-2 w-full rounded-lg border border-black/15 py-2 text-sm font-medium hover:bg-black/5"
      >
        Continue with Google
      </button>

      {sent ? (
        <p className="mt-4 text-sm text-ink/60">Check your inbox for a sign-in link.</p>
      ) : (
        <form onSubmit={signInWithEmail} className="mt-4 flex flex-col gap-2">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-ink py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Continue with email
          </button>
        </form>
      )}

      <p className="mt-6 text-xs text-ink/40">
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}