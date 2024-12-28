import type { DB } from "./database";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

const dialect = new SqliteDialect({
  database: new SQLite("./database.sqlite"),
});

export const db = new Kysely<DB>({ dialect });
