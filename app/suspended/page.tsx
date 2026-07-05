import { SignOutButton } from "@/components/SignOutButton";

export default function SuspendedPage() {
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <h1 className="text-lg font-medium">Your account has been suspended</h1>
      <p className="mt-3 text-sm text-ink/70 dark:text-neutral-300">
        You currently can&apos;t use Scholar Circle. If you believe this is a mistake, email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>
        .
      </p>
      <div className="mt-6 flex justify-center">
        <SignOutButton />
      </div>
    </div>
  );
}