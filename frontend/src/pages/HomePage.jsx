import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Brand, Icon, ThemeToggle } from "../components/UI";
import Schemes from "../components/Schemes";
export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(null);
  const faqs = [
    [
      "Who is mentHer for?",
      "Women building a business, from an early idea to a growing company, and mentors who want to share practical experience.",
    ],
    [
      "How does mentorship work?",
      "Create a profile, find a mentor whose expertise fits your goals, and send a personal request. Once accepted, you can message each other in your workspace.",
    ],
    [
      "Does mentHer provide funding?",
      "We help you discover official funding and support resources. Applications, eligibility decisions and funding are handled by the respective providers.",
    ],
  ];
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="public-header">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#approach">Our approach</a>
          <a href="#schemes">Government schemes</a>
          <a href="#opportunities">Global opportunities</a>
          <a href="#questions">Good to know</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {!user && (
            <Link className="text-link" to="/login">
              Log in
            </Link>
          )}
          <Link className="btn small" to={user ? "/dashboard" : "/signup"}>
            {user ? "My workspace" : "Find your people"}
            <Icon name="diagonal" size={16} />
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="live-dot" /> A little guidance. A world of
              possibility.
            </span>
            <h1>
              Your ambition.
              <br />
              Her experience.
              <br />
              <em>What’s next?</em>
            </h1>
            <p className="hero-description">
              You have the idea. You don’t have to have all the answers. Find
              the guidance, connections and confidence to build something of
              your own.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/signup?role=entrepreneur">
                Start your next chapter <Icon />
              </Link>
              <Link className="quiet-link" to="/signup?role=mentor">
                Become a mentor <Icon name="diagonal" size={16} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="tiny-spark" aria-hidden="true">
                <Icon name="leaf" size={14} />
              </span>{" "}
              Made for women who are making things happen.
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Illustration of the mentHer journey from an idea to a growing business"
          >
            <div className="art-grain" />
            <div className="art-top">
              <span>THE NEXT CHAPTER</span>
              <Icon name="leaf" />
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <svg
              className="botanical"
              viewBox="0 0 400 500"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M190 490C170 355 260 235 235 63"
                stroke="#567e72"
                strokeWidth="3"
              />
              <path
                d="M218 349C117 350 81 282 89 237C164 232 216 274 218 349Z"
                fill="#6e9584"
              />
              <path
                d="M224 278C323 274 352 205 332 168C265 169 222 218 224 278Z"
                fill="#406c5e"
              />
              <path
                d="M240 203C155 192 122 139 139 103C207 114 242 148 240 203Z"
                fill="#9cb6a1"
              />
              <path
                d="M239 139C295 119 306 71 284 42C242 62 229 97 239 139Z"
                fill="#648f7b"
              />
              <path
                d="M235 88C190 63 189 28 210 9C240 31 248 59 235 88Z"
                fill="#bccab0"
              />
              <path
                d="M187 430C266 432 310 386 306 348C244 338 197 373 187 430Z"
                fill="#86a690"
              />
              <path
                d="M219 347 109 258M224 278l91-92M239 202l-87-84M191 426l99-65"
                stroke="#c9d9c5"
                strokeWidth="1"
              />
            </svg>
            <div className="art-word">
              room
              <br />
              <em>to grow.</em>
            </div>
            <div className="glass art-label label-one">
              <span className="round-icon">
                <Icon name="people" />
              </span>
              <div>
                <strong>A conversation can change things.</strong>
                <span>Find someone who’s been there.</span>
              </div>
            </div>
            <div className="glass art-label label-two">
              <span className="live-dot" /> Your next chapter starts here{" "}
              <Icon name="diagonal" size={15} />
            </div>
            <span className="art-bottom">
              ROOTED IN SUPPORT. GROWING WITH PURPOSE.
            </span>
          </div>
        </section>
        <div className="principle-strip">
          <span>Big ideas need good company.</span>
          <div>
            <Icon name="people" /> Human connections
          </div>
          <div>
            <Icon name="leaf" /> Practical guidance
          </div>
          <div>
            <Icon name="sun" /> Shared possibility
          </div>
        </div>
        <section id="approach" className="section approach">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A STRONGER START</span>
              <h2>
                Build your business.
                <br />
                <em>Keep your own voice.</em>
              </h2>
            </div>
            <p>
              There’s no single way to build something meaningful. Just the
              right support, at the right time.
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature-card chalk">
              <span className="feature-number">01 / CONNECT</span>
              <Icon name="people" size={34} />
              <h3>
                Someone in
                <br />
                your corner.
              </h3>
              <p>
                Find mentors by expertise and industry. Ask the questions you
                can’t answer alone.
              </p>
              <Link to="/signup">
                Find your mentor <Icon name="diagonal" size={18} />
              </Link>
            </article>
            <article className="feature-card lichen">
              <span className="feature-number">02 / DISCOVER</span>
              <Icon name="book" size={34} />
              <h3>
                Open doors.
                <br />
                Find your way.
              </h3>
              <p>
                Explore official funding resources and government support. Make
                your next move an informed one.
              </p>
              <Link to="/signup">
                Explore possibilities <Icon name="diagonal" size={18} />
              </Link>
            </article>
            <article className="feature-card sand">
              <span className="feature-number">03 / GROW</span>
              <Icon name="leaf" size={34} />
              <h3>
                Small steps.
                <br />
                Real momentum.
              </h3>
              <p>
                Share your goals, start a conversation, and turn good advice
                into your next step.
              </p>
              <Link to="/signup">
                Make a start <Icon name="diagonal" size={18} />
              </Link>
            </article>
          </div>
        </section>
        <section id="possibilities" className="mentor-invitation">
          <div className="invitation-art">
            <span className="big-asterisk sculptural-ring" aria-hidden="true" />
            <span className="invitation-caption">
              EXPERIENCE IS BETTER
              <br />
              WHEN IT’S SHARED.
            </span>
          </div>
          <div>
            <span className="eyebrow">FOR THE WOMEN WHO’VE BEEN THERE</span>
            <h2>
              Your experience could be
              <br />
              someone’s <em>turning point.</em>
            </h2>
            <p>
              You don’t need to have every answer to make a difference. Share
              what you’ve learned with someone finding her way.
            </p>
            <Link className="btn" to="/signup?role=mentor">
              Become a mentor <Icon name="diagonal" size={18} />
            </Link>
          </div>
        </section>
        <Schemes />
        <Schemes international />
        <section className="section journey">
          <div>
            <span className="eyebrow">FROM “WHAT IF” TO “WHAT’S NEXT”</span>
            <h2>
              A beginning.
              <br />
              <em>Not a leap.</em>
            </h2>
          </div>
          <ol>
            {[
              [
                "Make it yours",
                "Tell us what you’re building, where you are, and what you need.",
              ],
              [
                "Find your people",
                "Explore mentors and send a thoughtful introduction.",
              ],
              [
                "Take the next step",
                "Connect, share ideas, and discover resources for your journey.",
              ],
            ].map(([title, desc], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section id="questions" className="section faq">
          <div>
            <span className="eyebrow">GOOD TO KNOW</span>
            <h2>
              A few things
              <br />
              <em>you might ask.</em>
            </h2>
          </div>
          <div>
            {faqs.map(([q, a], i) => (
              <article key={q}>
                <button
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {q}
                  <span aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
                <div
                  id={`faq-${i}`}
                  className={`faq-answer ${open === i ? "is-open" : ""}`}
                  inert={open !== i}
                  aria-hidden={open !== i}
                >
                  <div>
                    <p>{a}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="closing">
          <span className="eyebrow">YOUR IDEA DESERVES A CHANCE</span>
          <h2>
            Let’s see where
            <br />
            <em>you can take it.</em>
          </h2>
          <Link className="btn light" to="/signup">
            Find your beginning <Icon />
          </Link>
          <span className="closing-flower sculptural-ring" aria-hidden="true" />
        </section>
      </main>
      <footer>
        <Brand />
        <p>A little support. An extraordinary next chapter.</p>
        <span>© {new Date().getFullYear()} mentHer</span>
      </footer>
    </div>
  );
}
