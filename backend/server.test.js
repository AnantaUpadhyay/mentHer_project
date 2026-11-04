import { test, before, after } from "node:test";
import assert from "node:assert/strict";
process.env.DB_PATH = ":memory:";
const { server } = await import("./server.js");
let base;
before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(() => new Promise((resolve) => server.close(resolve)));
async function request(path, method = "GET", body, cookie) {
  const response = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
const account = (email, role = "entrepreneur") => ({
  name: role === "mentor" ? "Test Mentor" : "Test Founder",
  email,
  password: "a-secure-password",
  role,
});
test("authenticated mentorship journey, privacy and access control", async () => {
  assert.equal((await request("/auth/me")).status, 401);
  const founder = await request(
    "/auth/signup",
    "POST",
    account("founder@example.com"),
  );
  assert.equal(founder.status, 200);
  assert.ok(founder.cookie);
  assert.equal(founder.data.user.password, undefined);
  const mentor = await request(
    "/auth/signup",
    "POST",
    account("mentor@example.com", "mentor"),
  );
  assert.equal(mentor.status, 200);
  const stranger = await request(
    "/auth/signup",
    "POST",
    account("stranger@example.com"),
  );
  assert.equal(
    (await request("/mentors", "GET", null, founder.cookie)).data.mentors
      .length,
    0,
  );
  const profile = {
    ...mentor.data.user,
    bio: "I help founders build sustainable businesses.",
    expertise: "Brand strategy, operations",
    industry: "Technology",
    location: "Delhi",
  };
  assert.equal(
    (await request("/profile", "PUT", profile, mentor.cookie)).status,
    200,
  );
  const directory = await request("/mentors", "GET", null, founder.cookie);
  assert.equal(directory.data.mentors.length, 1);
  assert.equal(directory.data.mentors[0].email, undefined);
  assert.equal(
    (
      await request(
        "/requests",
        "POST",
        {
          mentor_id: mentor.data.user.id,
          note: "I would love guidance on my launch.",
        },
        founder.cookie,
      )
    ).status,
    201,
  );
  const connections = await request("/requests", "GET", null, mentor.cookie);
  const id = connections.data.requests[0].id;
  assert.equal(
    (await request(`/requests/${id}/messages`, "GET", null, founder.cookie))
      .status,
    403,
  );
  assert.equal(
    (
      await request(
        `/requests/${id}`,
        "PATCH",
        { status: "accepted" },
        founder.cookie,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        `/requests/${id}`,
        "PATCH",
        { status: "accepted" },
        mentor.cookie,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/requests/${id}/messages`,
        "POST",
        { body: "Hello! Here is my first question." },
        founder.cookie,
      )
    ).status,
    201,
  );
  assert.equal(
    (await request(`/requests/${id}/messages`, "GET", null, mentor.cookie)).data
      .messages.length,
    1,
  );
  assert.equal(
    (await request(`/requests/${id}/messages`, "GET", null, stranger.cookie))
      .status,
    404,
  );
  assert.equal(
    (
      await request(
        `/requests/${id}/messages`,
        "POST",
        { body: "Intrusion" },
        stranger.cookie,
      )
    ).status,
    404,
  );
  assert.equal(
    (await request("/saved/seed", "PUT", {}, founder.cookie)).status,
    200,
  );
  assert.deepEqual(
    (await request("/resources", "GET", null, founder.cookie)).data.saved,
    ["seed"],
  );
  assert.deepEqual(
    (await request("/resources", "GET", null, stranger.cookie)).data.saved,
    [],
  );
  assert.equal(
    (await request("/saved/seed", "DELETE", null, founder.cookie)).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/requests",
        "POST",
        { mentor_id: mentor.data.user.id, note: "Again" },
        founder.cookie,
      )
    ).status,
    409,
  );
  assert.equal(
    (await request("/auth/logout", "POST", {}, founder.cookie)).status,
    200,
  );
  assert.equal(
    (await request("/auth/me", "GET", null, founder.cookie)).status,
    401,
  );
  const login = await request(
    "/auth/login",
    "POST",
    account("founder@example.com"),
  );
  assert.equal(login.status, 200);
  assert.equal(
    (await request("/requests", "GET", null, login.cookie)).data.requests
      .length,
    1,
  );
});
test("rejects invalid roles, duplicates, invalid credentials and cross-origin writes", async () => {
  assert.equal(
    (await request("/auth/signup", "POST", account("bad@example.com", "admin")))
      .status,
    400,
  );
  assert.equal(
    (await request("/auth/signup", "POST", account("founder@example.com")))
      .status,
    409,
  );
  assert.equal(
    (
      await request("/auth/login", "POST", {
        ...account("founder@example.com"),
        password: "wrong-password",
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await request("/auth/signup", "POST", {
        ...account("invalid"),
        password: "short",
      })
    ).status,
    400,
  );
  const response = await fetch(base + "/auth/login", {
    method: "POST",
    headers: {
      Origin: "https://other.example",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account("founder@example.com")),
  });
  assert.equal(response.status, 403);
});

test('public schemes provide official sources and eligibility without exposing accounts', async () => {
  const response = await request('/schemes');
  assert.equal(response.status,200);
  assert.equal(response.data.schemes.length,3);
  for (const scheme of response.data.schemes) {
    assert.ok(scheme.eligibility && scheme.application && scheme.audience);
    assert.ok(new URL(scheme.url).hostname.endsWith('.gov.in'));
    assert.equal(scheme.email,undefined);
  }
});
