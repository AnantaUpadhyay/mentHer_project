import { spawnSync } from "node:child_process";
import { neon } from "@neondatabase/serverless";
if (!process.env.DATABASE_URL)
  throw new Error("Load DATABASE_URL before running this integration test");
const prefix = `test_${Date.now()}_`;
try {
  const result = spawnSync(
    process.execPath,
    ["--test", "backend/server.test.js"],
    {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "test", DB_TABLE_PREFIX: prefix },
    },
  );
  process.exitCode = result.status ?? 1;
} finally {
  const sql = neon(process.env.DATABASE_URL);
  for (const name of ["saved", "messages", "requests", "sessions", "users"])
    await sql.query(`DROP TABLE IF EXISTS ${prefix}${name} CASCADE`, []);
  console.log("Removed isolated Neon test tables.");
}
