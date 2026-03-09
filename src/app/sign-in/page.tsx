import type { Metadata } from "next";
import Link from "next/link";

import { AuthPanel } from "@/components/auth-panel";
import { getServerSession } from "@/lib/auth";
import { getTurnstileSiteKey, isProduction } from "@/lib/env";
import { getGuestbookDisplayName } from "@/lib/validations/guestbook";

export const metadata: Metadata = {
  title: "Sign in — youneedavps.com guestbook",
  description: "Sign in or create an account to post to the guestbook.",
};

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await getServerSession();
  const currentUserName = getGuestbookDisplayName(session?.user.name);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border border-zinc-200 bg-white p-6 sm:p-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Sign in
            </h1>
            <p className="mt-3 text-lg text-zinc-700">
              Access the guestbook with email and password.
            </p>
          </div>
          <p>
            <Link className="text-sm font-medium text-blue-600" href="/">
              Back to guestbook
            </Link>
          </p>
        </header>

        <section className="mt-6">
          <AuthPanel
            captchaRequired={isProduction()}
            currentUserName={session?.user ? currentUserName : null}
            defaultMode="sign-up"
            turnstileSiteKey={getTurnstileSiteKey()}
          />
        </section>
      </div>
    </main>
  );
}
