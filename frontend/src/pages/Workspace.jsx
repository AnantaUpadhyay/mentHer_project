import { SchemeFacts } from "../components/Schemes";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Brand,
  ThemeToggle,
  Icon,
  Avatar,
  Empty,
  Notice,
} from "../components/UI";
import api from "../services/api";
const industries = [
  "Technology",
  "Retail & commerce",
  "Food & hospitality",
  "Health & wellbeing",
  "Education",
  "Creative & design",
  "Social enterprise",
  "Other",
];
const errorText = (e) =>
  e.response?.data?.message ||
  "We couldn’t reach the server. Please try again.";
function RequestDialog({ mentor, onClose, onSend }) {
  const ref = useRef(),
    [note, setNote] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    d.querySelector("textarea")?.focus();
    return () => d.close();
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/requests", { mentor_id: mentor.id, note });
      await onSend();
      onClose();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      className="request-dialog"
      aria-labelledby="request-title"
    >
      <button
        className="icon-button modal-close"
        aria-label="Close request"
        onClick={onClose}
      >
        <Icon name="close" />
      </button>
      <Avatar name={mentor.name} large />
      <span className="eyebrow">A GOOD CONVERSATION STARTS HERE</span>
      <h2 id="request-title">Say hello to {mentor.name.split(" ")[0]}.</h2>
      <p>Share what you’re building and one thing you’d love guidance on.</p>
      <Notice error>{error}</Notice>
      <form onSubmit={submit}>
        <label className="field">
          Your introduction
          <textarea
            autoFocus
            required
            maxLength={1200}
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="I’m building… and I’d love your perspective on…"
          />
        </label>
        <button className="btn full" disabled={busy}>
          {busy ? "Sending…" : "Send mentorship request"}
          <Icon />
        </button>
      </form>
    </dialog>
  );
}
function Profile({ user, onSave }) {
  const [form, setForm] = useState(user),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  const change = (e) => {
    setSaved(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.put("/profile", form);
      await onSave(data.user);
      setSaved(true);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="profile-layout">
      <form className="panel profile-form" onSubmit={submit}>
        <div className="panel-heading">
          <h3>A little about you</h3>
          <span className="pill">{user.role}</span>
        </div>
        <Notice error>{error}</Notice>
        <Notice>{saved ? "Your profile is saved. Looking good." : ""}</Notice>
        <div className="form-grid">
          <label className="field">
            Full name
            <input
              name="name"
              required
              maxLength={80}
              value={form.name}
              onChange={change}
            />
          </label>
          <label className="field">
            Location
            <input
              name="location"
              maxLength={200}
              value={form.location}
              onChange={change}
              placeholder="City, country"
            />
          </label>
          <label className="field">
            Industry
            <select name="industry" value={form.industry} onChange={change}>
              <option value="">Choose your industry</option>
              {industries.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </label>
          <label className="field">
            {user.role === "mentor"
              ? "Organisation / independent practice"
              : "Business name"}
            <input
              name="company"
              maxLength={200}
              value={form.company}
              onChange={change}
              placeholder="Your business or practice"
            />
          </label>
        </div>
        <label className="field">
          About you
          <textarea
            name="bio"
            rows={4}
            maxLength={1200}
            value={form.bio}
            onChange={change}
            placeholder="A little of your story, in your own words."
          />
        </label>
        {user.role === "mentor" ? (
          <label className="field">
            Your expertise
            <input
              name="expertise"
              maxLength={200}
              value={form.expertise}
              onChange={change}
              placeholder="e.g. Brand strategy, fundraising, product design"
            />
            <small>
              Complete your bio and expertise to appear in the mentor directory.
            </small>
          </label>
        ) : (
          <>
            <label className="field">
              Business stage
              <select name="stage" value={form.stage} onChange={change}>
                {["Idea", "Getting started", "Growing", "Scaling"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="field">
              What would you like help with?
              <textarea
                name="goal"
                rows={3}
                maxLength={1200}
                value={form.goal}
                onChange={change}
                placeholder="The next challenge you want to work through."
              />
            </label>
          </>
        )}
        <button className="btn" disabled={busy}>
          {busy ? "Saving…" : "Save my profile"}
          <Icon name="check" size={18} />
        </button>
      </form>
      <aside className="profile-aside">
        <Icon name="leaf" size={34} />
        <h3>
          A person.
          <br />
          Not a pitch.
        </h3>
        <p>
          A thoughtful profile helps the right people find you. Share where you
          are and where you’d like to go.
        </p>
        <hr />
        <p className="fine-print">
          Members can see your name and profile details. Your email and password
          are never listed.
        </p>
      </aside>
    </div>
  );
}
function Conversation({ request, user }) {
  const [messages, setMessages] = useState([]),
    [body, setBody] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  const end = useRef();
  useEffect(() => {
    let live = true;
    const load = () =>
      api
        .get(`/requests/${request.id}/messages`)
        .then(({ data }) => {
          if (live) {
            setMessages(data.messages);
            setError("");
          }
        })
        .catch((e) => {
          if (live) setError(errorText(e));
        })
        .finally(() => {
          if (live) setLoading(false);
        });
    load();
    const timer = setInterval(load, 8000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [request.id]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  async function send(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      await api.post(`/requests/${request.id}/messages`, { body });
      setBody("");
      const { data } = await api.get(`/requests/${request.id}/messages`);
      setMessages(data.messages);
      setError("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="conversation">
      <div className="conversation-heading">
        <Avatar
          name={
            user.role === "mentor"
              ? request.entrepreneur_name
              : request.mentor_name
          }
        />
        <div>
          <h3>
            {user.role === "mentor"
              ? request.entrepreneur_name
              : request.mentor_name}
          </h3>
          <small>Your mentorship conversation</small>
        </div>
      </div>
      <Notice error>{error}</Notice>
      <div className="message-scroll" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <p className="muted">Loading conversation…</p>
        ) : messages.length ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.sender_id === user.id ? "own" : ""}`}
            >
              <p>{m.body}</p>
              <time dateTime={m.created_at.replace(" ", "T") + "Z"}>
                {new Date(m.created_at.replace(" ", "T") + "Z").toLocaleString(
                  [],
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </time>
            </div>
          ))
        ) : (
          <Empty icon="chat" title="Start with a hello.">
            Share a question or introduce what you’re working on.
          </Empty>
        )}
        <div ref={end} />
      </div>
      <form className="message-compose" onSubmit={send}>
        <label className="sr-only" htmlFor="message">
          Your message
        </label>
        <textarea
          id="message"
          rows={2}
          required
          maxLength={3000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something thoughtful…"
        />
        <button
          className="btn"
          disabled={busy || !body.trim()}
          aria-label="Send message"
        >
          <Icon />
          {busy ? "Sending…" : "Send"}
        </button>
      </form>
      <small className="conversation-note">
        Conversations refresh every 8 seconds. Share sensitive information with
        care.
      </small>
    </div>
  );
}
export default function Workspace() {
  const { user, setUser, logout } = useContext(AuthContext),
    [params, setParams] = useSearchParams(),
    requestedTab = params.get("tab") || "overview",
    tab = [
      "overview",
      "connections",
      "messages",
      "resources",
      "profile",
      ...(user.role === "entrepreneur" ? ["mentors"] : []),
    ].includes(requestedTab)
      ? requestedTab
      : "overview";
  const [mentors, setMentors] = useState([]),
    [requests, setRequests] = useState([]),
    [resources, setResources] = useState([]),
    [saved, setSaved] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [search, setSearch] = useState(""),
    [industry, setIndustry] = useState(""),
    [resourceFilter, setResourceFilter] = useState("All"),
    [selected, setSelected] = useState(null),
    [chatId, setChatId] = useState(null),
    [busy, setBusy] = useState(false),
    [menu, setMenu] = useState(false);
  const menuButton = useRef(null);
  const pageHeading = useRef(null);
  useEffect(() => {
    pageHeading.current?.focus({ preventScroll: true });
  }, [tab]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 601px)");
    const resize = () => {
      if (desktop.matches) setMenu(false);
    };
    document.addEventListener("keydown", close);
    desktop.addEventListener("change", resize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", close);
      desktop.removeEventListener("change", resize);
    };
  }, [menu]);
  const isMentor = user.role === "mentor";
  const load = useCallback(async () => {
    try {
      const [m, r, s] = await Promise.all([
        api.get("/mentors"),
        api.get("/requests"),
        api.get("/resources"),
      ]);
      setMentors(m.data.mentors);
      setRequests(r.data.requests);
      setResources(s.data.resources);
      setSaved(s.data.saved);
      setError("");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const go = (key) => {
    setParams({ tab: key });
    setMenu(false);
    setNotice("");
    setError("");
  };
  const accepted = requests.filter((r) => r.status === "accepted"),
    pending = requests.filter((r) => r.status === "pending");
  const complete = !!(
    user.bio &&
    user.industry &&
    (isMentor ? user.expertise : user.goal)
  );
  const nav = [
    ["overview", "grid", "Overview"],
    ...(!isMentor ? [["mentors", "people", "Find a mentor"]] : []),
    [
      "connections",
      "leaf",
      isMentor ? "Mentorship requests" : "My connections",
    ],
    ["messages", "chat", "Messages"],
    ["resources", "book", "Resource library"],
    ["profile", "user", "My profile"],
  ];
  const titles = {
    overview: [
      `A little progress, ${user.name.split(" ")[0]}.`,
      "Every good next chapter starts with a small step.",
    ],
    mentors: [
      "Good company for big ideas.",
      "Find expertise that meets you where you are.",
    ],
    connections: [
      isMentor ? "Your experience, shared." : "Your circle of support.",
      isMentor
        ? "Meet the people who could use your perspective."
        : "Thoughtful introductions. Meaningful connections.",
    ],
    messages: [
      "Keep the conversation going.",
      "A space to ask, share, and work through what’s next.",
    ],
    resources: [
      "A few doors worth opening.",
      "Official resources to help you make an informed next move.",
    ],
    profile: [
      "Your story starts here.",
      "A little context makes a better connection.",
    ],
  };
  const current = titles[tab] || titles.overview;
  const filtered = mentors
    .filter(
      (m) =>
        (!industry || m.industry === industry) &&
        `${m.name} ${m.expertise} ${m.bio} ${m.industry}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        Number(b.industry === user.industry) -
        Number(a.industry === user.industry),
    );
  async function respond(id, status) {
    setBusy(true);
    try {
      await api.patch(`/requests/${id}`, { status });
      await load();
      setNotice(
        status === "accepted"
          ? "Connection accepted. You can now message each other."
          : "Request declined.",
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function bookmark(id) {
    setBusy(true);
    try {
      if (saved.includes(id)) {
        await api.delete(`/saved/${id}`);
        setSaved(saved.filter((s) => s !== id));
      } else {
        await api.put(`/saved/${id}`);
        setSaved([...saved, id]);
      }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    try {
      await logout();
    } catch (e) {
      setError(errorText(e));
    }
  }
  const activeChat = accepted.find((r) => r.id === chatId) || accepted[0];
  return (
    <div className="workspace">
      <a className="skip-link" href="#workspace-main">
        Skip to content
      </a>
      <aside
        id="workspace-sidebar"
        className={`sidebar ${menu ? "mobile-open" : ""}`}
      >
        <Brand />
        <span className="workspace-label">YOUR GROWING SPACE</span>
        <nav aria-label="Workspace navigation">
          {nav.map(([key, icon, label]) => (
            <button
              key={key}
              aria-current={tab === key ? "page" : undefined}
              className={tab === key ? "active" : ""}
              onClick={() => go(key)}
            >
              <Icon name={icon} />
              {label}
              {key === "connections" && pending.length > 0 && (
                <span className="nav-count">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <Icon name="leaf" />
          <p>
            You don’t have to figure
            <br />
            it all out alone.
          </p>
        </div>
        <div className="sidebar-user">
          <Avatar name={user.name} />
          <div>
            <strong>{user.name}</strong>
            <small>
              {isMentor ? "Sharing experience" : "Building something new"}
            </small>
          </div>
          <button
            className="icon-button"
            aria-label="Log out"
            onClick={signOut}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>
      <div className="workspace-content">
        <header className="workspace-top">
          <button
            className="icon-button mobile-menu"
            ref={menuButton}
            aria-label="Toggle navigation"
            aria-controls="workspace-sidebar"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "close" : "menu"} />
          </button>
          <span>
            My workspace{" "}
            <span className="breadcrumb">
              / {nav.find((n) => n[0] === tab)?.[2] || "Overview"}
            </span>
          </span>
          <ThemeToggle />
          <span className="top-date">
            {new Date().toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </header>
        <main id="workspace-main" key={tab} inert={menu}>
          <div className="workspace-heading">
            <span className="eyebrow">
              {isMentor
                ? "A LITTLE EXPERIENCE. A LASTING DIFFERENCE."
                : "YOUR AMBITION HAS A HOME HERE."}
            </span>
            <h1 ref={pageHeading} tabIndex={-1}>
              {current[0]}
            </h1>
            <p>{current[1]}</p>
          </div>
          <Notice error>{error}</Notice>
          {error && (
            <button className="quiet-link retry-button" onClick={load}>
              Try loading again <Icon size={16} />
            </button>
          )}
          <Notice>{notice}</Notice>
          {loading ? (
            <div className="panel page-loading" role="status">
              Gathering your workspace…
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <div className="overview-grid">
                    <section className="welcome-panel">
                      <div>
                        <span className="eyebrow">YOUR NEXT SMALL STEP</span>
                        <h2>
                          {!complete
                            ? "Make this space\nyour own."
                            : isMentor
                              ? "Someone needs\nyour perspective."
                              : "Find someone who\ngets your ambition."}
                        </h2>
                        <p>
                          {!complete
                            ? "Tell us a little about yourself. The best connections start with a little context."
                            : isMentor
                              ? "Your profile is ready. Review your requests and begin a conversation."
                              : "Explore the mentor directory and start with a thoughtful hello."}
                        </p>
                        <button
                          className="btn"
                          onClick={() =>
                            go(
                              !complete
                                ? "profile"
                                : isMentor
                                  ? "connections"
                                  : "mentors",
                            )
                          }
                        >
                          {!complete
                            ? "Complete your profile"
                            : isMentor
                              ? "View requests"
                              : "Explore mentors"}
                          <Icon size={18} />
                        </button>
                      </div>
                      <span
                        className="welcome-flower sculptural-ring"
                        aria-hidden="true"
                      />
                    </section>
                    <section className="panel next-steps">
                      <span className="eyebrow">A LITTLE ROADMAP</span>
                      <h3>Good things take a few steps.</h3>
                      {[
                        [complete, "Tell your story", "profile"],
                        [
                          requests.length > 0,
                          isMentor
                            ? "Review your first request"
                            : "Send an introduction",
                          isMentor ? "connections" : "mentors",
                        ],
                        [
                          accepted.length > 0,
                          "Start a conversation",
                          "messages",
                        ],
                      ].map(([done, label, dest], i) => (
                        <button key={label} onClick={() => go(dest)}>
                          <span className={`step-circle ${done ? "done" : ""}`}>
                            {done ? <Icon name="check" size={14} /> : i + 1}
                          </span>
                          {label}
                          <Icon name="diagonal" size={15} />
                        </button>
                      ))}
                    </section>
                  </div>
                  <div className="stats-row">
                    {[
                      [accepted.length, "Mentorship connections", "people"],
                      [pending.length, "Pending introductions", "chat"],
                      [saved.length, "Saved resources", "bookmark"],
                    ].map(([n, label, icon]) => (
                      <div className="panel stat" key={label}>
                        <Icon name={icon} />
                        <strong>{n.toString().padStart(2, "0")}</strong>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="panel-heading section-gap">
                    <div>
                      <span className="eyebrow">A LITTLE INSPIRATION</span>
                      <h3>Resources for your next move</h3>
                    </div>
                    <button
                      className="quiet-link"
                      onClick={() => go("resources")}
                    >
                      View library <Icon size={16} />
                    </button>
                  </div>
                  <div className="resource-grid">
                    {resources.slice(0, 2).map((r) => (
                      <article className="panel resource-card" key={r.id}>
                        <span className="pill">{r.type}</span>
                        <h3>{r.title}</h3>
                        <p>{r.description}</p>
                        <a href={r.url} target="_blank" rel="noreferrer">
                          Explore official resource{" "}
                          <Icon name="diagonal" size={16} />
                        </a>
                      </article>
                    ))}
                  </div>
                </>
              )}
              {tab === "profile" && (
                <Profile
                  user={user}
                  onSave={async (u) => {
                    setUser(u);
                    await load();
                  }}
                />
              )}
              {tab === "mentors" && !isMentor && (
                <>
                  <div className="filters">
                    <label className="search-field">
                      <Icon name="search" />
                      <input
                        aria-label="Search mentors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, expertise, or industry"
                      />
                    </label>
                    <select
                      aria-label="Filter mentors by industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="">All industries</option>
                      {industries.map((i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <p className="results-note">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "mentor" : "mentors"} · People in
                    your industry appear first
                  </p>
                  {filtered.length ? (
                    <div className="mentor-grid">
                      {filtered.map((m) => {
                        const request = requests.find(
                          (r) => r.mentor_id === m.id,
                        );
                        return (
                          <article className="panel mentor-card" key={m.id}>
                            <div className="mentor-top">
                              <Avatar name={m.name} large />
                              {m.industry === user.industry &&
                                user.industry && (
                                  <span className="pill green">
                                    Your industry
                                  </span>
                                )}
                            </div>
                            <h3>{m.name}</h3>
                            <span className="muted">
                              {m.location || "Location not shared"}
                            </span>
                            <p>{m.bio}</p>
                            <div className="expertise-tags">
                              {m.expertise.split(",").map((s) => (
                                <span key={s}>{s.trim()}</span>
                              ))}
                            </div>
                            <div className="mentor-bottom">
                              <span>{m.industry || "Independent mentor"}</span>
                              <button
                                className="btn secondary small"
                                disabled={!!request}
                                onClick={() => setSelected(m)}
                              >
                                {request
                                  ? `${request.status[0].toUpperCase() + request.status.slice(1)} request`
                                  : "Say hello"}
                                {!request && <Icon name="diagonal" size={16} />}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <Empty
                      icon="people"
                      title={
                        mentors.length
                          ? "No matches this time."
                          : "Your circle is just beginning."
                      }
                    >
                      {mentors.length
                        ? "Try another expertise or clear your industry filter."
                        : "Mentors will appear here when they join and complete their profiles. Invite someone whose experience you value."}
                    </Empty>
                  )}
                </>
              )}
              {tab === "connections" &&
                (requests.length ? (
                  <div className="connections-list">
                    {requests.map((r) => (
                      <article className="panel connection-card" key={r.id}>
                        <div className="connection-header">
                          <Avatar
                            name={
                              isMentor ? r.entrepreneur_name : r.mentor_name
                            }
                          />
                          <div>
                            <h3>
                              {isMentor ? r.entrepreneur_name : r.mentor_name}
                            </h3>
                            <small>
                              {isMentor
                                ? r.company || "Entrepreneur"
                                : "Mentor"}
                            </small>
                          </div>
                          <span
                            className={`pill ${r.status === "accepted" ? "green" : ""}`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="request-note">{r.note}</p>
                        {isMentor && r.goal && (
                          <p className="muted">
                            <strong>Working toward: </strong>
                            {r.goal}
                          </p>
                        )}
                        <div className="connection-actions">
                          {isMentor && r.status === "pending" ? (
                            <>
                              <button
                                className="btn small"
                                disabled={busy}
                                onClick={() => respond(r.id, "accepted")}
                              >
                                Accept introduction{" "}
                                <Icon name="check" size={16} />
                              </button>
                              <button
                                className="quiet-link"
                                disabled={busy}
                                onClick={() => respond(r.id, "declined")}
                              >
                                Decline
                              </button>
                            </>
                          ) : r.status === "accepted" ? (
                            <button
                              className="btn secondary small"
                              onClick={() => {
                                setChatId(r.id);
                                go("messages");
                              }}
                            >
                              Open conversation <Icon name="chat" size={16} />
                            </button>
                          ) : (
                            <small>
                              {r.status === "pending"
                                ? "A little patience. Your introduction is waiting for a response."
                                : "This request wasn’t accepted. There may be another connection ahead."}
                            </small>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty
                    icon="people"
                    title={
                      isMentor
                        ? "Your next mentee is out there."
                        : "Every connection starts with hello."
                    }
                  >
                    {isMentor
                      ? "Complete your profile so entrepreneurs can discover your expertise and send you a request."
                      : "Find someone whose experience speaks to your goals. Send a personal introduction to start."}
                  </Empty>
                ))}
              {tab === "messages" &&
                (accepted.length ? (
                  <div className="panel inbox">
                    <nav
                      className="conversation-list"
                      aria-label="Conversations"
                    >
                      {accepted.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setChatId(r.id)}
                          className={activeChat.id === r.id ? "active" : ""}
                        >
                          <Avatar
                            name={
                              isMentor ? r.entrepreneur_name : r.mentor_name
                            }
                          />
                          <div>
                            <strong>
                              {isMentor ? r.entrepreneur_name : r.mentor_name}
                            </strong>
                            <small>Mentorship connection</small>
                          </div>
                        </button>
                      ))}
                    </nav>
                    <Conversation
                      key={activeChat.id}
                      request={activeChat}
                      user={user}
                    />
                  </div>
                ) : (
                  <Empty
                    icon="chat"
                    title="A good conversation is worth the wait."
                  >
                    Your conversations appear here once a mentorship request is
                    accepted.
                  </Empty>
                ))}
              {tab === "resources" && (
                <>
                  <div className="resource-toolbar">
                    <div className="segmented" aria-label="Resource filters">
                      {[
                        "All",
                        "Funding",
                        "Government support",
                        "Women’s schemes",
                        "Global opportunities",
                        "Learning",
                        "Saved",
                      ].map((t) => (
                        <button
                          key={t}
                          aria-pressed={resourceFilter === t}
                          className={resourceFilter === t ? "active" : ""}
                          onClick={() => setResourceFilter(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="resource-grid">
                    {resources
                      .filter(
                        (r) =>
                          resourceFilter === "All" ||
                          resourceFilter === r.type ||
                          (resourceFilter === "Saved" && saved.includes(r.id)),
                      )
                      .map((r) => (
                        <article className="panel resource-card" key={r.id}>
                          <div className="panel-heading">
                            <span className="pill">{r.type}</span>
                            <button
                              className={`icon-button ${saved.includes(r.id) ? "is-saved" : ""}`}
                              aria-label={`${saved.includes(r.id) ? "Unsave" : "Save"} ${r.title}`}
                              aria-pressed={saved.includes(r.id)}
                              disabled={busy}
                              onClick={() => bookmark(r.id)}
                            >
                              <Icon name="bookmark" />
                            </button>
                          </div>
                          <span className="resource-org">{r.org}</span>
                          <h3>{r.title}</h3>
                          <p>{r.description}</p>
                          <SchemeFacts resource={r} />
                          <span className="resource-tag">{r.tag}</span>
                          <a href={r.url} target="_blank" rel="noreferrer">
                            Visit official website{" "}
                            <Icon name="diagonal" size={17} />
                          </a>
                        </article>
                      ))}
                  </div>
                  {resourceFilter === "Saved" && !saved.length && (
                    <Empty
                      icon="bookmark"
                      title="Keep a few possibilities close."
                    >
                      Save resources using the bookmark icon. They’ll be here
                      when you need them.
                    </Empty>
                  )}
                  <p className="resource-disclaimer">
                    A starting point for your research. Check eligibility,
                    application windows and terms directly with the provider.
                    mentHer does not award funding.
                  </p>
                </>
              )}
            </>
          )}
          <footer className="workspace-footer">
            <span>Small steps. Shared possibilities.</span>
            <span>
              Made for your next chapter. <Icon name="leaf" size={14} />
            </span>
          </footer>
        </main>
      </div>
      {selected && (
        <RequestDialog
          mentor={selected}
          onClose={() => setSelected(null)}
          onSend={async () => {
            await load();
            setNotice(
              "Your introduction is on its way. View it in My connections.",
            );
          }}
        />
      )}
    </div>
  );
}
