import { resolve } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "@/db/schema";
import { getDatabasePath } from "@/lib/env";

function resolveDatabaseFile() {
  return resolve(process.cwd(), getDatabasePath());
}

export function getDatabaseFilePath() {
  return resolveDatabaseFile();
}

function openSqlite() {
  const databaseFile = resolveDatabaseFile();

  try {
    const sqlite = new Database(databaseFile);
    // WAL mode allows concurrent reads during writes, which matters once auth
    // and guestbook writes happen alongside page reads.
    sqlite.pragma("journal_mode = WAL");

    return sqlite;
  } catch (error) {
    throw new Error(
      `Database is not ready at ${databaseFile}. Run migrations before starting the app.`,
      { cause: error },
    );
  }
}

function createDatabase(sqlite: ReturnType<typeof openSqlite>) {
  return drizzle(sqlite, { schema });
}

let sqlite: ReturnType<typeof openSqlite> | null = null;
let db: ReturnType<typeof createDatabase> | null = null;

export function getSqlite() {
  if (!sqlite) {
    sqlite = openSqlite();
  }

  return sqlite;
}

export function getDb() {
  if (!db) {
    db = createDatabase(getSqlite());
  }

  return db;
}
