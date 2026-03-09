import Image from "next/image";
import Link from "next/link";

import { GuestbookForm } from "@/components/guestbook-form";
import { getServerSession } from "@/lib/auth";
import { listGuestbookMessages } from "@/lib/guestbook";
import { getGuestbookDisplayName } from "@/lib/validations/guestbook";

export const dynamic = "force-dynamic";

function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function Home() {
  const [session, messages] = await Promise.all([
    getServerSession(),
    listGuestbookMessages(),
  ]);

  const currentUserName = getGuestbookDisplayName(session?.user.name);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border border-zinc-200 bg-white p-6 sm:p-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              youneedavps.com guestbook
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-zinc-700">
              Sign in, leave a comment, and keep the page simple enough to demo
              on youneedavps.com.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-zinc-600">
              Emails stay private. Public posts use your chosen name or{" "}
              <strong>Guest</strong>.
            </p>
            <p>
              <Link
                className="inline-flex items-center border border-zinc-900 px-3 py-2 text-sm font-medium text-zinc-900 no-underline transition hover:bg-zinc-900 hover:text-white"
                href="/sign-in"
              >
                {session?.user ? "Account" : "Sign in or sign up"}
              </Link>
            </p>
          </div>
        </header>

        <section className="mt-6 border-b border-zinc-200 pb-6">
          {session?.user ? (
            <>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-950">
                    Write a comment
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Signed in as <strong>{currentUserName}</strong>.
                  </p>
                </div>
              </div>
              <GuestbookForm />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-zinc-950">
                Write a comment
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Sign in on the separate auth page before posting to the
                guestbook.
              </p>
              <p className="mt-3">
                <Link className="text-sm font-medium text-blue-600" href="/sign-in">
                  Go to sign in
                </Link>
              </p>
            </>
          )}
        </section>

        <section className="mt-6 border-b border-zinc-200 pb-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-semibold text-zinc-950">Guestbook</h2>
            <p className="text-sm text-zinc-600">{messages.length} messages</p>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-zinc-600">No messages yet.</p>
          ) : (
            <ul className="space-y-4">
              {messages.map((message) => (
                <li className="border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0" key={message.id}>
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <strong className="text-zinc-950">{message.authorName}</strong>
                    <time className="text-sm text-zinc-500">
                      {formatTimestamp(message.createdAt)}
                    </time>
                  </div>
                  <p className="whitespace-pre-wrap text-zinc-800">
                    {message.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold text-zinc-950">Videos</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              className="flex gap-3 border border-zinc-200 p-2 no-underline transition hover:border-zinc-300"
              href="https://www.youtube.com/watch?v=E0tUio6ZgH8"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt="Thumbnail for the existing youneedavps.com VPS video"
                className="h-[68px] w-[120px] shrink-0 border border-zinc-200 object-cover"
                height="360"
                src="https://i.ytimg.com/vi/E0tUio6ZgH8/hqdefault.jpg"
                width="480"
              />
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <strong className="text-sm leading-5 text-zinc-950">
                  You Need a VPS - The Foundational Setup Guide using Hetzner
                  and Cloudflare DNS (Less Than $5/Month)
                </strong>
                <p className="text-sm text-zinc-600">
                  Watch the existing YouTube video on youneedavps.com.
                </p>
              </div>
            </a>

            <div className="flex gap-3 border border-zinc-200 p-2">
              <Image
                alt="Placeholder thumbnail for the current guestbook VPS video"
                className="h-[68px] w-[120px] shrink-0 border border-zinc-200 object-cover"
                height="360"
                src="/video-placeholder.svg"
                width="480"
              />
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <strong className="text-sm leading-5 text-zinc-950">
                  You Need a VPS - ?
                </strong>
                <p className="text-sm text-zinc-600">
                  Replace this card with the new video link when it is live.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
