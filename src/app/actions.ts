"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "@/lib/auth";
import { createGuestbookMessage } from "@/lib/guestbook";
import { guestbookMessageSchema } from "@/lib/validations/guestbook";

export type GuestbookActionState = {
  error: string | null;
  success: boolean;
  timestamp: number;
};

export async function submitGuestbookMessage(
  _previousState: GuestbookActionState,
  formData: FormData,
): Promise<GuestbookActionState> {
  const session = await getServerSession();
  const raw = formData.get("message");
  const parsed = guestbookMessageSchema.safeParse({
    message: typeof raw === "string" ? raw : "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid message.",
      success: false,
      timestamp: Date.now(),
    };
  }

  try {
    await createGuestbookMessage({
      message: parsed.data.message,
      userId: session?.user.id,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save message.",
      success: false,
      timestamp: Date.now(),
    };
  }

  revalidatePath("/");

  return {
    error: null,
    success: true,
    timestamp: Date.now(),
  };
}
