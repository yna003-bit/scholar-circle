export default function PrivacyPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Privacy Policy</h1>
      <p className="text-xs text-ink/50">Last updated: July 2026</p>

      <p className="mt-4 text-sm text-ink/80">
        Scholar Circle helps students discover scholarships and sponsorships and connect with one
        another. This page explains what information we collect, including through Google
        Sign-In, and how we use it.
      </p>

      <h2 className="mt-6 text-sm font-medium">Google user data we access</h2>
      <p className="text-sm text-ink/80">
        When you sign in with Google, we request only your basic profile information: your name,
        email address, and profile photo (if available). We do not request access to your Gmail,
        Google Drive, Google Contacts, or any other Google service or data beyond this basic
        sign-in information.
      </p>

      <h2 className="mt-6 text-sm font-medium">How we use this data</h2>
      <p className="text-sm text-ink/80">
        We use your name, email, and photo solely to create and display your Scholar Circle
        profile, authenticate you when you sign in, and let other students recognize you when you
        post, follow, comment, or send a friend request. We do not use this data for advertising
        and do not build advertising profiles from it.
      </p>

      <h2 className="mt-6 text-sm font-medium">Data sharing</h2>
      <p className="text-sm text-ink/80">
        We do not sell Google user data or share it with advertisers or data brokers. The only
        third party involved is Supabase, our database and authentication infrastructure
        provider, which stores this data on our behalf under its own security and confidentiality
        commitments in order to operate the app. We do not share your Google user data with any
        other third party.
      </p>

      <h2 className="mt-6 text-sm font-medium">Data storage and protection</h2>
      <p className="text-sm text-ink/80">
        Data is stored in a Postgres database managed by Supabase, protected by row-level security
        rules that restrict who can read or modify each record. All traffic between your browser
        and our servers, and between our servers and Supabase, is encrypted in transit via HTTPS.
      </p>

      <h2 className="mt-6 text-sm font-medium">Data retention and deletion</h2>
      <p className="text-sm text-ink/80">
        We retain your account and profile data for as long as your account remains active. You
        can request full deletion of your account and all associated data at any time by emailing
        us at the address below; we will process deletion requests within a reasonable time and
        confirm once complete.
      </p>

      <h2 className="mt-6 text-sm font-medium">Your choices</h2>
      <p className="text-sm text-ink/80">
        You can edit or remove your profile information, delete posts, comments, or follows
        you&apos;ve made, or request full account deletion by contacting us below.
      </p>

      <h2 className="mt-6 text-sm font-medium">Contact</h2>
      <p className="text-sm text-ink/80">
        Questions about this policy, your data, or deletion requests can be sent to{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
