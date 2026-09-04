import * as SQLite from 'expo-sqlite';

import { MIGRATIONS } from '@/db/schema';
import { seedIfEmpty } from '@/db/seed';

let db: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('gym-bae.db');
  }
  return db;
}

export function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!initPromise) {
    initPromise = (async () => {
      const database = getDb();
      await database.execAsync('PRAGMA journal_mode = WAL;');
      await database.execAsync('PRAGMA foreign_keys = ON;');

      const versionRow = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
      let version = versionRow?.user_version ?? 0;
      for (; version < MIGRATIONS.length; version += 1) {
        await database.execAsync(MIGRATIONS[version]);
        await database.execAsync(`PRAGMA user_version = ${version + 1};`);
      }

      await seedIfEmpty(database);
      return database;
    })();
  }
  return initPromise;
}
