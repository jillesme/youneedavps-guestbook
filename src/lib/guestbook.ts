import { desc, eq } from "drizzle-orm";

import { guestbookMessage, user } from "@/db/schema";
import { getDb } from "@/lib/db";
import {
  getGuestbookDisplayName,
  normalizeGuestbookMessage,
} from "@/lib/validations/guestbook";

export async function listGuestbookMessages() {
  const rows = await getDb()
    .select({
      id: guestbookMessage.id,
      message: guestbookMessage.message,
      createdAt: guestbookMessage.createdAt,
      authorName: user.name,
    })
    .from(guestbookMessage)
    .innerJoin(user, eq(guestbookMessage.userId, user.id))
    .orderBy(desc(guestbookMessage.createdAt))
    .limit(25);

  return rows.map((row) => ({
    ...row,
    authorName: getGuestbookDisplayName(row.authorName),
  }));
}

export async function createGuestbookMessage(input: {
  message: string;
  userId: string | null | undefined;
}) {
  if (!input.userId) {
    throw new Error("You need to sign in before posting.");
  }

  await getDb().insert(guestbookMessage).values({
    id: crypto.randomUUID(),
    message: normalizeGuestbookMessage(input.message),
    userId: input.userId,
  });
}
