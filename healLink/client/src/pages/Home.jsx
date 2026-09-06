import { Link } from "react-router-dom";import moodImg from "../assets/images/mood-tracker.jpg";
import journalImg from "../assets/images/journal.jpg";
import stressImg from "../assets/images/stress-support.jpg";
import aboutImg from "../assets/images/about-section1.jpg";
import "./Home.css";

const FEATURES = [
  {
    title: "Mood Tracker",
    desc: "Log how you feel each day and spot patterns over time.",
    to: "/mood-tracker",
    image: moodImg,
  },
  {
    title: "Private Journal",
    desc: "A quiet space to write freely — only you can read it.",
    to: "/journal",
    image: journalImg,
  },
  {
    title: "Stress Support",
    desc: "Quick quizzes, calming quotes, and articles when you need them.",
    to: "/stress",
    image: stressImg,
  },
];

export default function Home() {
  return (
    <main>
      {/* --- Hero --- */}
      <section className="mb-hero">
        <div className="mb-hero__text">
          <span className="mb-hero__eyebrow">HealLink</span>
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
    <img src={f.image} alt={f.title} className="mb-feature-card__img" />
    <h3>{f.title}</h3>
    <p>{f.desc}</p>
    <span className="mb-feature-card__arrow">→</span>
  </Link>
))}
      </section>
      {/* --- Why HealLink --- */}
<section className="mb-about">
  <div className="mb-about__image">
    <img src={aboutImg} alt="Student relaxing peacefully" />
  </div>
  <div className="mb-about__text">
    <span className="mb-hero__eyebrow">Why HealLink</span>
    <h2>Because your mind deserves the same care as your grades.</h2>
    <p>
      We built HealLink because student life is demanding, and mental
      wellness often gets pushed aside. Between deadlines, exams, and
      everyday pressure, it's easy to lose track of how you're really
      feeling. HealLink gives you a simple, private space to pause,
      reflect, and understand yourself better — one day at a time.
    </p>
  </div>
</section>
{/* --- Final CTA --- */}
<section className="mb-cta">
  <div className="mb-cta__circle" aria-hidden="true" />
  <h2>Ready to check in with yourself?</h2>
  <p>Join HealLink today — it only takes a minute to get started.</p>
  <Link to="/register" className="mb-btn mb-btn--primary mb-btn--light">
    Get started for free
  </Link>
</section>
    </main>
  );
}
