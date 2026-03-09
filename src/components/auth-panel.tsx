"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

type AuthPanelProps = {
  currentUserName: string | null;
  captchaRequired: boolean;
  defaultMode?: AuthMode;
  turnstileSiteKey: string;
};

type AuthError =
  | {
      message?: string;
    }
  | null
  | undefined;

function getAuthErrorMessage(error: AuthError, fallback: string) {
  return error?.message ?? fallback;
}

export function AuthPanel({
  captchaRequired,
  currentUserName,
  defaultMode = "sign-in",
  turnstileSiteKey,
}: AuthPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const captchaEnabled = turnstileSiteKey.length > 0;

  const heading = useMemo(() => {
    if (currentUserName) {
      return `Signed in as ${currentUserName}`;
    }

    return mode === "sign-in" ? "Sign in" : "Create an account";
  }, [currentUserName, mode]);

  async function handleSignOut() {
    setPending(true);
    setError(null);

    const { error: signOutError } = await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });

    if (signOutError) {
      setError(getAuthErrorMessage(signOutError, "Unable to sign out."));
    }

    setPending(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    if ((captchaEnabled || captchaRequired) && !captchaToken) {
      setError("Complete the Turnstile check before continuing.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rawName = String(formData.get("name") ?? "").trim();

    setPending(true);
    setError(null);

    const fetchOptions = captchaToken
      ? {
          headers: {
            "x-captcha-response": captchaToken,
          },
        }
      : undefined;

    const result =
      mode === "sign-in"
        ? await authClient.signIn.email({
            email,
            password,
            fetchOptions,
          })
        : await authClient.signUp.email({
            email,
            password,
            name: rawName || "Guest",
            fetchOptions,
          });

    if (result.error) {
      setError(
        getAuthErrorMessage(
          result.error,
          mode === "sign-in"
            ? "Unable to sign in."
            : "Unable to create your account.",
        ),
      );
      setPending(false);
      setCaptchaToken(null);
      setCaptchaKey((value) => value + 1);
      return;
    }

    startTransition(() => {
      router.push("/");
      router.refresh();
    });

    setPending(false);
    setCaptchaToken(null);
    setCaptchaKey((value) => value + 1);
  }

  if (currentUserName) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Account</h2>
          <p className="mt-1 text-sm text-zinc-600">{heading}</p>
        </div>
        <p className="text-sm text-zinc-600">
          Your email stays private. Only your chosen name appears in the
          guestbook.
        </p>
        <div>
          <button
            className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            disabled={pending}
            onClick={handleSignOut}
            type="button"
          >
            {pending ? "Signing out..." : "Sign out"}
          </button>
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={
            mode === "sign-in"
              ? "inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
              : "inline-flex items-center border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
          }
          onClick={() => setMode("sign-in")}
          type="button"
        >
          Sign in
        </button>
        <button
          className={
            mode === "sign-up"
              ? "inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
              : "inline-flex items-center border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
          }
          onClick={() => setMode("sign-up")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-950">{heading}</h2>
        <p className="mt-1 text-sm text-zinc-600">
          {mode === "sign-in"
            ? "Use your email and password."
            : "Create an account for posting to the guestbook."}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {mode === "sign-up" ? (
          <div>
            <label
              className="mb-1 block text-sm font-medium text-zinc-900"
              htmlFor="public-name"
            >
              Public name
            </label>
            <input
              className="block w-full border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
              id="public-name"
              name="name"
              placeholder="Optional. Defaults to Guest."
              type="text"
            />
          </div>
        ) : null}

        <div>
          <label
            className="mb-1 block text-sm font-medium text-zinc-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="block w-full border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-zinc-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            className="block w-full border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
            id="password"
            minLength={8}
            name="password"
            placeholder="At least 8 characters"
            required
            type="password"
          />
        </div>

        {captchaEnabled ? (
          <div className="overflow-x-auto">
            <Turnstile
              key={captchaKey}
              onError={() => {
                setCaptchaToken(null);
                setError("Turnstile verification failed. Try again.");
              }}
              onExpire={() => {
                setCaptchaToken(null);
              }}
              onSuccess={(token) => {
                setCaptchaToken(token);
              }}
              options={{
                theme: "light",
              }}
              siteKey={turnstileSiteKey}
            />
          </div>
        ) : captchaRequired ? (
          <p className="text-sm text-red-700">
            Turnstile is required in production, but the site key is missing.
          </p>
        ) : (
          <p className="text-sm text-zinc-600">
            Turnstile is not configured yet. Add `TURNSTILE_SITE_KEY` and
            `TURNSTILE_SECRET_KEY` before production use.
          </p>
        )}

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div>
          <button
            className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending
              ? mode === "sign-in"
                ? "Signing in..."
                : "Creating account..."
              : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
}
