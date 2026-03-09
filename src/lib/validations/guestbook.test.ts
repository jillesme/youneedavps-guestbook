import { describe, expect, it } from "vitest";

import {
  getGuestbookDisplayName,
  normalizeGuestbookMessage,
} from "@/lib/validations/guestbook";

describe("guestbook validation", () => {
  it("trims and accepts a valid message", () => {
    expect(normalizeGuestbookMessage("  Hello from the VPS.  ")).toBe(
      "Hello from the VPS.",
    );
  });

  it("rejects an empty message", () => {
    expect(() => normalizeGuestbookMessage("   ")).toThrow(
      "Write a message before posting.",
    );
  });

  it("falls back to Guest when no public name is set", () => {
    expect(getGuestbookDisplayName("")).toBe("Guest");
    expect(getGuestbookDisplayName("  ")).toBe("Guest");
    expect(getGuestbookDisplayName(null)).toBe("Guest");
  });
});
