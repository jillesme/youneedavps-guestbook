import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { captcha } from "better-auth/plugins";
import { headers } from "next/headers";

import * as schema from "@/db/schema";
import { getDb } from "@/lib/db";
import {
  getAuthBaseUrl,
  getAuthSecret,
  getTurnstileSecretKey,
} from "@/lib/env";

function createAuth() {
  const turnstileSecretKey = getTurnstileSecretKey();
  const plugins = turnstileSecretKey
    ? [
        captcha({
          provider: "cloudflare-turnstile",
          secretKey: turnstileSecretKey,
        }),
        nextCookies(),
      ]
    : [nextCookies()];

  return betterAuth({
    baseURL: getAuthBaseUrl(),
    secret: getAuthSecret(),
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins,
  });
}

let authInstance: ReturnType<typeof createAuth> | null = null;

export function getAuth(): ReturnType<typeof createAuth> {
  if (!authInstance) {
    authInstance = createAuth();
  }

  return authInstance;
}

export async function getServerSession() {
  return getAuth().api.getSession({
    headers: await headers(),
  });
}
