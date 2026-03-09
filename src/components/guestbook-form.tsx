"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitGuestbookMessage } from "@/app/actions";

const initialGuestbookActionState = {
  error: null,
  success: false,
  timestamp: 0,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex items-center border border-zinc-900 bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Posting..." : "Post message"}
    </button>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useActionState(
    submitGuestbookMessage,
    initialGuestbookActionState,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4"
      key={state.timestamp}
    >
      <p className="text-sm text-zinc-600">Short messages only.</p>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-zinc-900"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          className="block min-h-28 w-full resize-y border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
          id="message"
          maxLength={280}
          name="message"
          placeholder="Leave a comment..."
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">280 characters max.</p>
        <SubmitButton />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
