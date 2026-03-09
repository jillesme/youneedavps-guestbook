import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured.");
}

const databasePath = resolve(
  process.cwd(),
  databaseUrl.startsWith("file:") ? databaseUrl.slice("file:".length) : databaseUrl,
);

mkdirSync(dirname(databasePath), { recursive: true });

const sqlite = new Database(databasePath);
const db = drizzle(sqlite);

try {
  migrate(db, { migrationsFolder: resolve(process.cwd(), "drizzle") });
  console.log(`Applied database migrations to ${databasePath}`);
} finally {
  sqlite.close();
}
