import { resources } from "../backend/resources.js";
export default function handler(req, res) {
  const url = new URL(req.url, "https://ment-her.vercel.app");
  const path = url.searchParams.has("route") ? "/api/" + url.searchParams.get("route") : url.pathname;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method === "GET" && path === "/api/schemes")
    return res
      .status(200)
      .json({ schemes: resources.filter((r) => r.eligibility) });
  if (req.method === "GET" && path === "/api/health")
    return res.status(200).json({ ok: true, mode: "public-preview" });
  if (req.method === "GET" && path === "/api/auth/me")
    return res
      .status(401)
      .json({
        message: "Member access is not available in this public preview.",
      });
  return res
    .status(503)
    .json({
      message:
        "Member access is coming soon. You can explore the public website and government schemes now.",
    });
}
