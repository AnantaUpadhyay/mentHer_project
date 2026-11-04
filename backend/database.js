import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
let database;
async function connect() {
  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL)
      throw new Error("DATABASE_URL is required on Vercel");
    const { DatabaseSync } = await import("node:sqlite");
    const { mkdirSync } = await import("node:fs");
    const dir = new URL("./data/", import.meta.url);
    mkdirSync(dir, { recursive: true });
    const db = new DatabaseSync(
      process.env.DB_PATH || new URL("menther.sqlite", dir).pathname,
    );
    db.exec(
      await readFile(new URL("./sqlite-schema.sql", import.meta.url), "utf8"),
    );
    return db;
  }
  const sql = neon(process.env.DATABASE_URL);
  const prefix =
    process.env.NODE_ENV === "test" ? process.env.DB_TABLE_PREFIX || "" : "";
  if (!/^[a-z0-9_]*$/.test(prefix)) throw new Error("Invalid test prefix");
  const tables = (query) =>
    query.replace(
      /\b(users|sessions|requests|messages|saved)\b/g,
      (name) => prefix + name,
    );
  if (process.env.NODE_ENV === "test") {
    const schema = await readFile(
      new URL("./schema.sql", import.meta.url),
      "utf8",
    );
    for (const statement of schema.split(";").filter((s) => s.trim()))
      await sql.query(tables(statement), []);
  }
  return {
    prepare(query) {
      let index = 0;
      let statement = tables(query).replace(/\?/g, () => `$${++index}`);
      if (statement.startsWith("INSERT OR IGNORE"))
        statement =
          statement.replace("INSERT OR IGNORE", "INSERT") +
          " ON CONFLICT DO NOTHING";
      const insertUser = query.startsWith("INSERT INTO users(");
      if (insertUser) statement += " RETURNING id";
      return {
        async all(...values) {
          return sql.query(statement, values);
        },
        async get(...values) {
          return (await sql.query(statement, values))[0];
        },
        async run(...values) {
          const rows = await sql.query(statement, values);
          return { lastInsertRowid: insertUser ? rows[0].id : undefined };
        },
      };
    },
  };
}
export async function getDatabase() {
  if (!database)
    database = connect().catch((error) => {
      database = undefined;
      throw error;
    });
  return database;
}
