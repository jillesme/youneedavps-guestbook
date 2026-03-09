import { afterEach, describe, expect, it } from "vitest";

import { _resetEnvCache, getAuthSecret, getDatabasePath } from "@/lib/env";

const originalEnvironment = { ...process.env };

function restoreEnvironment() {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnvironment)) {
      delete process.env[key];
    }
  }

  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }
}

afterEach(() => {
  _resetEnvCache();
  restoreEnvironment();
});

describe("environment configuration", () => {
  it("uses the configured auth secret", () => {
    process.env.DATABASE_URL = "file:./data/test.sqlite";
    process.env.NODE_ENV = "development";
    process.env.BETTER_AUTH_SECRET = "configured-secret";

    expect(getAuthSecret()).toBe("configured-secret");
  });

  it("falls back to a local secret outside production", () => {
    process.env.DATABASE_URL = "file:./data/test.sqlite";
    delete process.env.BETTER_AUTH_SECRET;
    process.env.NODE_ENV = "development";

    expect(getAuthSecret()).toBe("local-development-secret");
  });

  it("throws when the auth secret is missing in production", () => {
    process.env.DATABASE_URL = "file:./data/test.sqlite";
    delete process.env.BETTER_AUTH_SECRET;
    process.env.NODE_ENV = "production";

    expect(() => getAuthSecret()).toThrow(
      "BETTER_AUTH_SECRET must be configured in production.",
    );
  });

  it("uses the configured database path", () => {
    process.env.DATABASE_URL = "file:./data/guestbook.sqlite";

    expect(getDatabasePath()).toBe("./data/guestbook.sqlite");
  });

  it("throws when the database url is missing", () => {
    delete process.env.DATABASE_URL;

    expect(() => getDatabasePath()).toThrow("Invalid environment variables");
  });
});
