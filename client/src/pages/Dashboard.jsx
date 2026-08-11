import { Link } from "react-router-dom";
import "./Dashboard.css";

// TODO: replace with real data once Member 2 (mood) & Member 3 (journal)
// APIs are ready. Example:
//   useEffect(() => { fetch("/api/moods").then(...) }, []);
const placeholderStats = {
  userName: "Friend",
  moodStreakDays: 4,
  journalEntries: 7,
  lastMood: "Calm",
};

const SUMMARY_CARDS = [
  { label: "Mood streak", value: `${placeholderStats.moodStreakDays} days`, accent: "sage" },
  { label: "Journal entries", value: placeholderStats.journalEntries, accent: "gold" },
  { label: "Last logged mood", value: placeholderStats.lastMood, accent: "sage" },
];

const QUICK_LINKS = [
  { title: "Log today's mood", to: "/mood-tracker", desc: "Takes less than a minute." },
  { title: "Write a journal entry", to: "/journal", desc: "Let your thoughts out." },
  { title: "Take a stress check", to: "/stress", desc: "See how you're really doing." },
];

export default function Dashboard() {
  return (
    <main className="mb-dash">
      <header className="mb-dash__header">
        <div>
          <span className="mb-dash__eyebrow">Dashboard</span>
          <h1>Welcome back, {placeholderStats.userName}</h1>
          <p>Here's a quick look at how you've been doing.</p>
        </div>
      </header>

      <section className="mb-dash__stats">
        {SUMMARY_CARDS.map((card) => (
          <div className={`mb-stat-card mb-stat-card--${card.accent}`} key={card.label}>
            <span className="mb-stat-card__value">{card.value}</span>
            <span className="mb-stat-card__label">{card.label}</span>
          </div>
        ))}
      </section>

      <section className="mb-dash__quick">
        <h2>Quick actions</h2>
        <div className="mb-dash__quick-grid">
          {QUICK_LINKS.map((item) => (
            <Link to={item.to} className="mb-quick-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
