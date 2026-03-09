import { describe, expect, it } from "vitest";

describe("guestbook posting", () => {
  it("rejects unauthenticated posting", async () => {
    process.env.DATABASE_URL = "file:./tmp/guestbook-test.sqlite";

    const { createGuestbookMessage } = await import("@/lib/guestbook");

    await expect(
      createGuestbookMessage({
        message: "Hello world",
        userId: null,
      }),
    ).rejects.toThrow("You need to sign in before posting.");
  });
});
