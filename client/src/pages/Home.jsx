import { Link } from "react-router-dom";
import "./Home.css";

const FEATURES = [
  {
    title: "Mood Tracker",
    desc: "Log how you feel each day and spot patterns over time.",
    to: "/mood-tracker",
  },
  {
    title: "Private Journal",
    desc: "A quiet space to write freely — only you can read it.",
    to: "/journal",
  },
  {
    title: "Stress Support",
    desc: "Quick quizzes, calming quotes, and articles when you need them.",
    to: "/stress",
  },
];

export default function Home() {
  return (
    <main>
      {/* --- Hero --- */}
      <section className="mb-hero">
        <div className="mb-hero__text">
          <span className="mb-hero__eyebrow">MindBridge</span>
          <h1>
            A calmer place to<br />check in with yourself.
          </h1>
          <p>
            Track your mood, write freely, and find support — all in one
            gentle space built for students.
          </p>
          <div className="mb-hero__ctas">
            <Link to="/register" className="mb-btn mb-btn--primary">
              Get started
            </Link>
            <Link to="/dashboard" className="mb-btn mb-btn--ghost">
              View dashboard
            </Link>
          </div>
        </div>

        {/* Signature element: a slow "breathing" circle — echoes guided breathing exercises */}
        <div className="mb-hero__visual" aria-hidden="true">
          <div className="mb-breathe mb-breathe--outer" />
          <div className="mb-breathe mb-breathe--mid" />
          <div className="mb-breathe mb-breathe--inner" />
        </div>
      </section>

      {/* --- Features --- */}
      <section className="mb-features">
        {FEATURES.map((f) => (
          <Link to={f.to} className="mb-feature-card" key={f.title}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className="mb-feature-card__arrow">→</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
