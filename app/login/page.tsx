"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "magiclink";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const supabase = createClient();

  // Sign in with username + password
  const [signinUsername, setSigninUsername] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinError, setSigninError] = useState<string | null>(null);
  const [signinBusy, setSigninBusy] = useState(false);

  // Create account
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupBusy, setSignupBusy] = useState(false);
  const [signupDone, setSignupDone] = useState<"confirm" | "signedin" | null>(null);

  // Magic link (also doubles as "forgot password")
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function signInWithUsername(e: React.FormEvent) {
    e.preventDefault();
    setSigninError(null);
    setSigninBusy(true);

    const { data: email, error: lookupError } = await supabase.rpc("get_email_for_username", {
      input_username: signinUsername.trim().toLowerCase(),
    });

    if (lookupError || !email) {
      setSigninBusy(false);
      setSigninError("We couldn't find an account with that username.");
      return;
    }

    const { error: signinErr } = await supabase.auth.signInWithPassword({
      email,
      password: signinPassword,
    });

    setSigninBusy(false);

    if (signinErr) {
      setSigninError("Incorrect username or password.");
      return;
    }

    location.href = "/feed";
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setSignupError(null);
    setSignupBusy(true);

    const cleanUsername = signupUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (!cleanUsername) {
      setSignupBusy(false);
      setSignupError("Choose a username using letters, numbers, and underscores.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupBusy(false);
      setSignupError("Password must be at least 6 characters.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: { display_name: signupName, username: cleanUsername },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setSignupBusy(false);

    if (error) {
      setSignupError(error.message);
      return;
    }

    if (data.session) {
      setSignupDone("signedin");
      location.href = "/feed";
    } else {
      setSignupDone("confirm");
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setMagicSent(true);
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
        className="mb-4 w-full rounded-lg border border-black/15 py-2 text-sm font-medium hover:bg-black/5"
      >
        Continue with Google
      </button>

      <div className="mb-4 flex items-center gap-2 text-xs text-ink/30">
        <div className="h-px flex-1 bg-black/10" />
        or
        <div className="h-px flex-1 bg-black/10" />
      </div>

      {mode === "signin" ? (
        <form onSubmit={signInWithUsername} className="flex flex-col gap-2 text-left">
          <input
            required
            placeholder="Username"
            value={signinUsername}
            onChange={(e) => setSigninUsername(e.target.value)}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={signinPassword}
            onChange={(e) => setSigninPassword(e.target.value)}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
          {signinError ? <p className="text-xs text-red-600">{signinError}</p> : null}
          <button
            type="submit"
            disabled={signinBusy}
            className="w-full rounded-lg bg-ink py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {signinBusy ? "Signing in..." : "Sign in"}
          </button>
          <div className="flex justify-between text-xs">
            <button type="button" onClick={() => setMode("signup")} className="text-ink/60 underline">
              Create an account
            </button>
            <button type="button" onClick={() => setMode("magiclink")} className="text-ink/60 underline">
              Forgot password?
            </button>
          </div>
        </form>
      ) : null}

      {mode === "signup" ? (
        <>
          {signupDone === "confirm" ? (
            <p className="text-sm text-ink/60">
              Check <strong>{signupEmail}</strong> for a confirmation link, then come back and sign
              in with your username and password.
            </p>
          ) : (
            <form onSubmit={createAccount} className="flex flex-col gap-2 text-left">
              <input
                required
                placeholder="Display name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
              <input
                required
                type="email"
                placeholder="you@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
              <input
                required
                type="password"
                placeholder="Password (at least 6 characters)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
              <p className="text-[11px] text-ink/40">
                Your email is only used for account recovery — you&apos;ll sign in with your
                username afterward.
              </p>
              {signupError ? <p className="text-xs text-red-600">{signupError}</p> : null}
              <button
                type="submit"
                disabled={signupBusy}
                className="w-full rounded-lg bg-ink py-2 text-sm font-medium text-white hover:opacity-90"
              >
                {signupBusy ? "Creating account..." : "Create account"}
              </button>
              <button type="button" onClick={() => setMode("signin")} className="text-xs text-ink/60 underline">
                Already have an account? Sign in
              </button>
            </form>
          )}
        </>
      ) : null}

      {mode === "magiclink" ? (
        <>
          {magicSent ? (
            <p className="text-sm text-ink/60">Check your inbox for a sign-in link.</p>
          ) : (
            <form onSubmit={sendMagicLink} className="flex flex-col gap-2 text-left">
              <p className="text-xs text-ink/50">
                Forgot your password? Enter the email on your account and we&apos;ll send you a
                link to sign in directly — no password needed.
              </p>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-ink py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Send magic link
              </button>
              <button type="button" onClick={() => setMode("signin")} className="text-xs text-ink/60 underline">
                Back to sign in
              </button>
            </form>
          )}
        </>
      ) : null}

      <p className="mt-6 text-xs text-ink/40">
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}