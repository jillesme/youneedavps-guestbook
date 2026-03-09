import { z } from "zod";

export const guestbookMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Write a message before posting.")
    .max(280, "Keep your message under 280 characters."),
});

export function normalizeGuestbookMessage(input: string) {
  return guestbookMessageSchema.parse({ message: input }).message;
}

export function getGuestbookDisplayName(name: string | null | undefined) {
  const normalizedName = name?.trim();

  return normalizedName && normalizedName.length > 0 ? normalizedName : "Guest";
}
