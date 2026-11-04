import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Brand, Icon, Notice } from "../components/UI";
import api from "../services/api";
export default function AuthPage({ signup = false }) {
  const { user, login } = useContext(AuthContext),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      role: params.get("role") === "mentor" ? "mentor" : "entrepreneur",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post(
        `/auth/${signup ? "signup" : "login"}`,
        form,
      );
      login(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn’t reach the server. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const publicPreview = process.env.REACT_APP_PUBLIC_PREVIEW === "true";
  return (
    <main className="auth-layout">
      <section className="auth-story">
        <Brand />
        <div>
          <span className="eyebrow">A SPACE FOR YOUR NEXT CHAPTER</span>
          <h1>
            Good things
            <br />
            grow with
            <br />
            <em>good company.</em>
          </h1>
          <p>
            Guidance for your business.
            <br />
            Space for your ambition.
          </p>
          <span className="auth-flower sculptural-ring" aria-hidden="true" />
        </div>
        <Link className="quiet-link" to="/">
          Back to mentHer <Icon name="diagonal" size={16} />
        </Link>
      </section>
      <section className="auth-form-section">
        <div className="auth-form">
          <span className="eyebrow">
            {signup ? "LET’S MAKE A BEGINNING" : "YOUR NEXT CHAPTER CONTINUES"}
          </span>
          <h2>{signup ? "A place to grow." : "Welcome back."}</h2>
          <p>
            {signup
              ? "Create your account and find your people."
              : "A little closer to what comes next."}
          </p>
          <Notice error>{error}</Notice>
          {publicPreview && (
            <Notice>
              Member access is coming soon. Explore our government schemes while
              we prepare the full workspace.
            </Notice>
          )}
          {!publicPreview && (
            <form onSubmit={submit}>
              {signup && (
                <>
                  <fieldset className="role-picker">
                    <legend>I’m here to…</legend>
                    {[
                      [
                        "entrepreneur",
                        "Build my business",
                        "Find guidance & support",
                      ],
                      [
                        "mentor",
                        "Share my experience",
                        "Guide someone’s journey",
                      ],
                    ].map(([role, title, desc]) => (
                      <label
                        key={role}
                        className={form.role === role ? "selected" : ""}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={form.role === role}
                          onChange={change}
                        />
                        <strong>{title}</strong>
                        <small>{desc}</small>
                      </label>
                    ))}
                  </fieldset>
                  <label className="field">
                    Your name
                    <input
                      name="name"
                      autoComplete="name"
                      maxLength={80}
                      required
                      value={form.name}
                      onChange={change}
                      placeholder="Your full name"
                    />
                  </label>
                </>
              )}
              <label className="field">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                />
              </label>
              <label className="field">
                Password
                <span className="password-field">
                  <input
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    minLength={8}
                    maxLength={128}
                    required
                    value={form.password}
                    onChange={change}
                    placeholder={
                      signup ? "At least 8 characters" : "Your password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
              <button className="btn full" disabled={busy}>
                {busy
                  ? "One moment…"
                  : signup
                    ? "Create your account"
                    : "Come on in"}
                <Icon />
              </button>
            </form>
          )}
          <p className="auth-switch">
            {signup ? "Already part of mentHer?" : "New around here?"}{" "}
            <Link to={signup ? "/login" : "/signup"}>
              {signup ? "Log in" : "Create an account"}
            </Link>
          </p>
          <p className="fine-print">
            Your profile is shared with members to make meaningful connections.
            Your email stays private.
          </p>
        </div>
      </section>
    </main>
  );
}
