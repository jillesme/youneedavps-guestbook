import { z } from "zod";

const LOCAL_DEVELOPMENT_AUTH_SECRET = "local-development-secret";

const serverSchema = z.object({
  DATABASE_URL: z.string().trim().min(1, "DATABASE_URL must be configured."),
  BETTER_AUTH_SECRET: z.string().trim().min(1),
  BETTER_AUTH_URL: z
    .url()
    .optional()
    .default("http://localhost:3000"),
  TURNSTILE_SITE_KEY: z.string().trim().optional().default(""),
  TURNSTILE_SECRET_KEY: z.string().trim().optional().default(""),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

type ServerEnv = z.infer<typeof serverSchema>;

let _cache: ServerEnv | null = null;

export function env(): ServerEnv {
  if (!_cache) {
    const result = serverSchema.safeParse(process.env);

    if (!result.success) {
      const details = result.error.issues
        .map((i) => `  ${i.path.join(".")}: ${i.message}`)
        .join("\n");

      throw new Error(`Invalid environment variables:\n${details}`);
    }

    _cache = result.data;
  }

  return _cache;
}

/** Reset the cached env — only for tests. */
export function _resetEnvCache() {
  _cache = null;
}

function stripFileProtocol(value: string) {
  return value.startsWith("file:") ? value.slice("file:".length) : value;
}

export function getDatabasePath() {
  return stripFileProtocol(env().DATABASE_URL);
}

export function getAuthBaseUrl() {
  return env().BETTER_AUTH_URL;
}

export function getAuthSecret() {
  const secret = env().BETTER_AUTH_SECRET;

  if (secret) {
    return secret;
  }

  return LOCAL_DEVELOPMENT_AUTH_SECRET;
}

export function getTurnstileSiteKey() {
  return env().TURNSTILE_SITE_KEY;
}

export function getTurnstileSecretKey() {
  return env().TURNSTILE_SECRET_KEY;
}

export function isProduction() {
  return env().NODE_ENV === "production";
}

export function isTurnstileConfigured() {
  return getTurnstileSiteKey().length > 0 && getTurnstileSecretKey().length > 0;
}
