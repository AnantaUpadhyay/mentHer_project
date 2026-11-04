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
export default function Schemes({ international = false }) {
  const endpoint = international ? "/opportunities" : "/schemes";
  const [schemes, setSchemes] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .get(endpoint)
      .then(({ data }) =>
        setSchemes(data[international ? "opportunities" : "schemes"]),
      )
      .catch(() => setError("Resources could not be loaded. Please try again."))
      .finally(() => setLoading(false));
  }, [endpoint, international]);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <section
      className="section schemes-section"
      id={international ? "opportunities" : "schemes"}
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {international
              ? "POSSIBILITIES BEYOND BORDERS"
              : "SUPPORT FOR YOUR BUSINESS"}
          </span>
          <h2>
            {international ? "Your next step," : "Explore the support"}
            <br />
            <em>
              {international ? "a wider world." : "you could qualify for."}
            </em>
          </h2>
        </div>
        <p>
          {international
            ? "Learning, mentoring, trade networks and awards for women building businesses around the world. Check each programme’s country rules and application status."
            : "Government programmes for women entrepreneurs in India, with official sources to help you take the next step."}
        </p>
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
      <p className="resource-disclaimer">
        {international
          ? "An international directory, not a list of guaranteed places or open calls. Availability is shown as last reviewed; confirm eligibility, costs and deadlines with each provider."
          : "These summaries are a starting point, not an eligibility decision. Loans require repayment and lender approval. Application windows, training places and terms depend on the provider."}
      </p>
      <Link className="quiet-link" to="/signup">
        Create an account to save useful{" "}
        {international ? "opportunities" : "schemes"} <Icon size={17} />
      </Link>
    </section>
  );
}
