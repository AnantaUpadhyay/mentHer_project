import http from "node:http";
import { DatabaseSync } from "node:sqlite";
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const scrypt = promisify(scryptCallback);
const dataDir = fileURLToPath(new URL("./data/", import.meta.url));
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(process.env.DB_PATH || `${dataDir}menther.sqlite`);
db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('entrepreneur','mentor')), bio TEXT DEFAULT '', company TEXT DEFAULT '', industry TEXT DEFAULT '', stage TEXT DEFAULT 'Idea', location TEXT DEFAULT '', expertise TEXT DEFAULT '', goal TEXT DEFAULT '');
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER REFERENCES users(id),expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS requests(id INTEGER PRIMARY KEY,entrepreneur_id INTEGER REFERENCES users(id),mentor_id INTEGER REFERENCES users(id),note TEXT NOT NULL,status TEXT DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined')),created_at TEXT DEFAULT CURRENT_TIMESTAMP,UNIQUE(entrepreneur_id,mentor_id));
CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY,request_id INTEGER REFERENCES requests(id),sender_id INTEGER REFERENCES users(id),body TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS saved(user_id INTEGER REFERENCES users(id),resource_id TEXT,PRIMARY KEY(user_id,resource_id));`);
const publicUser = (row) => {
  if (!row) return null;
  const { password, ...user } = row;
  return user;
};
const hashToken = (token) => createHash("sha256").update(token).digest("hex");
import { resources } from "./resources.js";
const attempts = new Map();
const origin = process.env.APP_ORIGIN || "http://localhost:3001";
function fail(status, message) {
  throw Object.assign(new Error(message), { status });
}
function field(body, key, max = 200, required = false) {
  const value = body[key];
  if (value === undefined && !required) return "";
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  )
    fail(400, `Please provide a valid ${key}.`);
  return value.trim();
}
async function bodyOf(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (Buffer.byteLength(data) > 16000) fail(413, "Request is too large.");
  }
  try {
    const body = JSON.parse(data || "{}");
    if (!body || typeof body !== "object" || Array.isArray(body))
      fail(400, "Invalid JSON object.");
    return body;
  } catch {
    fail(400, "Invalid JSON object.");
  }
}
const safeId = (value) => {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) fail(400, "Invalid ID.");
  return id;
};
export const server = http.createServer(async (req, res) => {
  const send = (status, value) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify(value));
  };
  try {
    const path = new URL(req.url, "http://localhost").pathname.replace(
      /^\/api/,
      "",
    );
    const method = req.method;
    const sameDevelopmentOrigin =
      process.env.NODE_ENV !== "production" &&
      req.headers.origin === `http://${req.headers.host}`;
    if (
      method !== "GET" &&
      req.headers.origin &&
      req.headers.origin !== origin &&
      !sameDevelopmentOrigin
    )
      fail(403, "This request origin is not allowed.");
    if (path === "/schemes" && method === "GET")
      return send(200, { schemes: resources.filter((r) => r.eligibility) });
    if (path === "/health") return send(200, { ok: true });
    if (
      (path === "/auth/signup" || path === "/auth/login") &&
      method === "POST"
    ) {
      const ip = req.socket.remoteAddress;
      const now = Date.now();
      if (attempts.size > 1000)
        for (const [key, value] of attempts)
          if (now - value.start > 900000) attempts.delete(key);
      let limit = attempts.get(ip);
      if (!limit || now - limit.start > 900000) {
        limit = { start: now, count: 0 };
        attempts.set(ip, limit);
      }
      if (++limit.count > 40)
        fail(429, "Too many attempts. Try again in 15 minutes.");
      const body = await bodyOf(req);
      const email = field(body, "email", 254, true).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        fail(400, "Please enter a valid email address.");
      const password = body.password;
      if (
        typeof password !== "string" ||
        password.length > 128 ||
        password.length < 8
      )
        fail(400, "Use a password between 8 and 128 characters.");
      let user;
      if (path === "/auth/signup") {
        const name = field(body, "name", 80, true),
          role = body.role;
        if (!["entrepreneur", "mentor"].includes(role))
          fail(400, "Choose entrepreneur or mentor.");
        const salt = randomBytes(16).toString("hex");
        const key = await scrypt(password, salt, 64);
        try {
          const result = db
            .prepare(
              "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
            )
            .run(name, email, `${salt}:${key.toString("hex")}`, role);
          user = db
            .prepare("SELECT * FROM users WHERE id=?")
            .get(result.lastInsertRowid);
        } catch (error) {
          if (error.errcode === 2067)
            fail(409, "An account with this email already exists.");
          throw error;
        }
      } else {
        user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
        const [salt, expected] = (
          user?.password || "dummy:".concat("0".repeat(128))
        ).split(":");
        const actual = await scrypt(password, salt, 64);
        if (!user || !timingSafeEqual(Buffer.from(expected, "hex"), actual))
          fail(401, "Email or password is incorrect.");
      }
      db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
      const token = randomBytes(32).toString("hex");
      db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
        hashToken(token),
        user.id,
        Date.now() + 7 * 86400000,
      );
      res.setHeader(
        "Set-Cookie",
        `menther_session=${token}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
      );
      return send(200, { user: publicUser(user) });
    }
    const token = (req.headers.cookie || "")
      .split("; ")
      .find((c) => c.startsWith("menther_session="))
      ?.slice(16);
    const user = token
      ? db
          .prepare(
            "SELECT users.* FROM users JOIN sessions ON sessions.user_id=users.id WHERE token=? AND expires>?",
          )
          .get(hashToken(token), Date.now())
      : null;
    if (!user) fail(401, "Please sign in to continue.");
    if (path === "/auth/me" && method === "GET")
      return send(200, { user: publicUser(user) });
    if (path === "/auth/logout" && method === "POST") {
      db.prepare("DELETE FROM sessions WHERE token=?").run(hashToken(token));
      res.setHeader(
        "Set-Cookie",
        "menther_session=; HttpOnly; SameSite=Lax; Path=/api; Max-Age=0",
      );
      return send(200, { ok: true });
    }
    if (path === "/profile" && method === "PUT") {
      const body = await bodyOf(req);
      const values = [
        "name",
        "bio",
        "company",
        "industry",
        "stage",
        "location",
        "expertise",
        "goal",
      ].map((key) =>
        field(
          body,
          key,
          key === "bio" || key === "goal" ? 1200 : 200,
          key === "name",
        ),
      );
      db.prepare(
        "UPDATE users SET name=?,bio=?,company=?,industry=?,stage=?,location=?,expertise=?,goal=? WHERE id=?",
      ).run(...values, user.id);
      return send(200, {
        user: publicUser(
          db.prepare("SELECT * FROM users WHERE id=?").get(user.id),
        ),
      });
    }
    if (path === "/mentors" && method === "GET")
      return send(200, {
        mentors: db
          .prepare(
            "SELECT id,name,bio,industry,location,expertise FROM users WHERE role='mentor' AND bio<>'' AND expertise<>'' ORDER BY id DESC",
          )
          .all(),
      });
    if (path === "/resources" && method === "GET")
      return send(200, {
        resources,
        saved: db
          .prepare("SELECT resource_id FROM saved WHERE user_id=?")
          .all(user.id)
          .map((r) => r.resource_id),
      });
    if (path.startsWith("/saved/") && ["PUT", "DELETE"].includes(method)) {
      const id = path.split("/")[2];
      if (!resources.some((r) => r.id === id)) fail(404, "Resource not found.");
      if (method === "PUT")
        db.prepare("INSERT OR IGNORE INTO saved VALUES(?,?)").run(user.id, id);
      else
        db.prepare("DELETE FROM saved WHERE user_id=? AND resource_id=?").run(
          user.id,
          id,
        );
      return send(200, { ok: true });
    }
    if (path === "/requests" && method === "GET")
      return send(200, {
        requests: db
          .prepare(
            `SELECT r.*,e.name AS entrepreneur_name,m.name AS mentor_name,e.company,e.goal FROM requests r JOIN users e ON e.id=r.entrepreneur_id JOIN users m ON m.id=r.mentor_id WHERE r.entrepreneur_id=? OR r.mentor_id=? ORDER BY r.id DESC`,
          )
          .all(user.id, user.id),
      });
    if (path === "/requests" && method === "POST") {
      if (user.role !== "entrepreneur")
        fail(403, "Only entrepreneurs can request mentorship.");
      const body = await bodyOf(req),
        id = safeId(body.mentor_id),
        note = field(body, "note", 1200, true);
      if (
        !db
          .prepare(
            "SELECT id FROM users WHERE id=? AND role='mentor' AND bio<>'' AND expertise<>''",
          )
          .get(id)
      )
        fail(404, "Mentor not found.");
      try {
        db.prepare(
          "INSERT INTO requests(entrepreneur_id,mentor_id,note) VALUES(?,?,?)",
        ).run(user.id, id, note);
      } catch (error) {
        if (error.errcode === 2067)
          fail(409, "You have already sent this mentor a request.");
        throw error;
      }
      return send(201, { ok: true });
    }
    const match = path.match(/^\/requests\/(\d+)(\/messages)?$/);
    if (match) {
      const id = safeId(match[1]),
        request = db.prepare("SELECT * FROM requests WHERE id=?").get(id);
      if (
        !request ||
        ![request.mentor_id, request.entrepreneur_id].includes(user.id)
      )
        fail(404, "Conversation not found.");
      if (!match[2] && method === "PATCH") {
        if (request.mentor_id !== user.id)
          fail(403, "Only the mentor can respond.");
        const body = await bodyOf(req);
        if (
          !["accepted", "declined"].includes(body.status) ||
          request.status !== "pending"
        )
          fail(400, "This request cannot be updated.");
        db.prepare("UPDATE requests SET status=? WHERE id=?").run(
          body.status,
          id,
        );
        return send(200, { ok: true });
      }
      if (match[2]) {
        if (request.status !== "accepted")
          fail(403, "Messaging opens after the mentor accepts your request.");
        if (method === "GET")
          return send(200, {
            messages: db
              .prepare(
                "SELECT messages.*,users.name FROM messages JOIN users ON users.id=messages.sender_id WHERE request_id=? ORDER BY messages.id",
              )
              .all(id),
          });
        if (method === "POST") {
          const body = await bodyOf(req);
          db.prepare(
            "INSERT INTO messages(request_id,sender_id,body) VALUES(?,?,?)",
          ).run(id, user.id, field(body, "body", 3000, true));
          return send(201, { ok: true });
        }
      }
    }
    fail(404, "Endpoint not found.");
  } catch (error) {
    if (!error.status) console.error(error);
    send(error.status || 500, {
      message: error.status
        ? error.message
        : "Something went wrong. Please try again.",
    });
  }
});
if (process.argv[1] === fileURLToPath(import.meta.url))
  server.listen(Number(process.env.PORT || 5000), "127.0.0.1", () =>
    console.log("mentHer API ready on http://localhost:5000"),
  );
