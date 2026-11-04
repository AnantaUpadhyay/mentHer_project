import { handler } from "../backend/server.js";
export default async function api(req, res) {
  const url = new URL(req.url, "https://ment-her.vercel.app");
  if (url.searchParams.has("route"))
    req.url = "/api/" + url.searchParams.get("route");
  return handler(req, res);
}
