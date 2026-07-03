import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";

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
        <div className="rounded-lg border border-black/10 bg-white p-4">
          <p className="text-xs font-medium text-ink/60">Signed in as</p>
          <p className="text-sm">{user.email}</p>
        </div>

        <Link
          href="/profile"
          className="rounded-lg border border-black/10 bg-white p-4 text-sm font-medium text-ink"
        >
          Edit profile
        </Link>

        <div className="rounded-lg border border-black/10 bg-white p-4">
          <p className="text-xs font-medium text-ink/60">Need to delete your account?</p>
          <p className="mt-1 text-sm text-ink/80">
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