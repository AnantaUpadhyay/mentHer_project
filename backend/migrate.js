import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL("./schema.sql", import.meta.url), "utf8");
await sql.transaction([
  sql.query("SELECT pg_advisory_xact_lock(716035421)", []),
  ...schema
    .split(";")
    .filter((s) => s.trim())
    .map((s) => sql.query(s, [])),
]);
console.log("Neon schema migration completed.");
