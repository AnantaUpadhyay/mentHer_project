import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Icon, Notice } from "./UI";
export function SchemeFacts({ resource }) {
  if (!resource.eligibility) return null;
  return (
    <div className="scheme-facts">
      <span className="pill green">{resource.audience}</span>
      <dl>
        <dt>Who can explore it</dt>
        <dd>{resource.eligibility}</dd>
        {resource.availability && (
          <>
            <dt>Availability & cost</dt>
            <dd>{resource.availability}</dd>
          </>
        )}
        <dt>How to get started</dt>
        <dd>{resource.application}</dd>
      </dl>
      <p className="scheme-review">
        Source reviewed {resource.reviewed || "2 November 2026"} · Confirm
        current availability with the provider.
      </p>
    </div>
  );
}
const sections = {
  schemes: {
    endpoint: "/schemes",
    key: "schemes",
    eyebrow: "SUPPORT FOR YOUR BUSINESS",
    title: "Explore the support",
    emphasis: "you could qualify for.",
    description:
      "Government programmes for women entrepreneurs in India, with official sources to help you take the next step.",
    disclaimer:
      "These summaries are a starting point, not an eligibility decision. Loans require repayment and lender approval. Application windows, training places and terms depend on the provider.",
    saveLabel: "schemes",
  },
  opportunities: {
    endpoint: "/opportunities",
    key: "opportunities",
    eyebrow: "POSSIBILITIES BEYOND BORDERS",
    title: "Your next step,",
    emphasis: "a wider world.",
    description:
      "Learning, mentoring, trade networks and awards for women building businesses around the world. Check each programme’s country rules and application status.",
    disclaimer:
      "An international directory, not a list of guaranteed places or open calls. Availability is shown as last reviewed; confirm eligibility, costs and deadlines with each provider.",
    saveLabel: "opportunities",
  },
  "women-in-tech": {
    endpoint: "/tech-initiatives",
    key: "initiatives",
    eyebrow: "A PLACE FOR YOU IN TECH",
    title: "Build your skills.",
    emphasis: "Find your people.",
    description:
      "Communities, coding programmes, mentoring and open-source internships for women taking their next step in technology.",
    disclaimer:
      "Each initiative has its own age, location and participation rules. Check current availability and costs with the provider; membership does not guarantee an internship, job or mentoring match.",
    saveLabel: "tech initiatives",
  },
};
export default function Schemes({ section = "schemes" }) {
  const content = sections[section];
  const [schemes, setSchemes] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .get(content.endpoint)
      .then(({ data }) => setSchemes(data[content.key]))
      .catch(() => setError("Resources could not be loaded. Please try again."))
      .finally(() => setLoading(false));
  }, [content]);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <section className="section schemes-section" id={section}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2>
            {content.title}
            <br />
            <em>{content.emphasis}</em>
          </h2>
        </div>
        <p>{content.description}</p>
      </div>
      <Notice error>{error}</Notice>
      {error && (
        <button className="btn secondary" onClick={load}>
          Try again
        </button>
      )}
      {loading ? (
        <p role="status">Loading official resources…</p>
      ) : (
        <div className="resource-grid">
          {schemes.map((r) => (
            <article className="panel resource-card" key={r.id}>
              <span className="resource-org">{r.org}</span>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <SchemeFacts resource={r} />
              <a href={r.url} target="_blank" rel="noreferrer">
                Read official details <Icon name="diagonal" size={17} />
              </a>
            </article>
          ))}
        </div>
      )}
      <p className="resource-disclaimer">{content.disclaimer}</p>
      <Link className="quiet-link" to="/signup">
        Create an account to save useful {content.saveLabel} <Icon size={17} />
      </Link>
    </section>
  );
}
