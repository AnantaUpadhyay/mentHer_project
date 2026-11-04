import { spawn } from "node:child_process";
const grouped = process.platform !== "win32";
const children = [
  spawn(process.execPath, ["backend/server.js"], {
    stdio: "inherit",
    detached: grouped,
  }),
  spawn("npm", ["start", "--prefix", "frontend"], {
    stdio: "inherit",
    detached: grouped,
    env: {
      ...process.env,
      PORT: process.env.FRONTEND_PORT || "3001",
      BROWSER: "none",
    },
  }),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.pid) continue;
    try {
      if (grouped) process.kill(-child.pid, "SIGTERM");
      else child.kill("SIGTERM");
    } catch (error) {
      if (error.code !== "ESRCH") console.error(error.message);
    }
  }
  process.exitCode = code;
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop());
for (const child of children) {
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code || 0);
  });
}
