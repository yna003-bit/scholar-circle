import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";
import { SetPasswordForm } from "@/components/SetPasswordForm";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Settings</h1>
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium text-ink/60 dark:text-neutral-400">Signed in as</p>
          <p className="text-sm text-ink dark:text-neutral-100">{user.email}</p>
        </div>

        <Link
          href="/profile"
          className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-ink dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Edit profile
        </Link>

        <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium text-ink/60 dark:text-neutral-400">Sign in with username + password</p>
          <p className="mt-1 mb-3 text-sm text-ink/80 dark:text-neutral-300">
            If you originally signed in with Google, set a password here to also be able to sign in
            with your username and a password next time.
          </p>
          <SetPasswordForm />
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium text-ink/60 dark:text-neutral-400">Need to delete your account?</p>
          <p className="mt-1 text-sm text-ink/80 dark:text-neutral-300">
            Email{" "}
            <a href="mailto:aynalado03@gmail.com" className="underline">
              aynalado03@gmail.com
            </a>{" "}
            and we&apos;ll remove your data.
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );
}