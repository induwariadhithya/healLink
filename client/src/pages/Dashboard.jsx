import { Link } from "react-router-dom";
import { Smile, BookOpen, HeartPulse, Flame, NotebookText, Sparkles } from "lucide-react";
import "./Dashboard.css";


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// TODO: replace with real data once Member 2 (mood) & Member 3 (journal)
// APIs are ready. Example:
//   useEffect(() => { fetch("/api/moods").then(...) }, []);
const placeholderStats = {
  userName: "Friend",
  moodStreakDays: 4,
  journalEntries: 7,
  lastMood: "Calm",
};

// TODO: replace with real data from Mood API
const weeklyMood = [
  { day: "Mon", color: "#6E9A82" },
  { day: "Tue", color: "#D9A45B" },
  { day: "Wed", color: "#6E9A82" },
  { day: "Thu", color: "#8C8AA8" },
  { day: "Fri", color: "#6E9A82" },
  { day: "Sat", color: "#D9A45B" },
  { day: "Sun", color: "#6E9A82" },
];
const MOOD_LEGEND = [
  { label: "Calm", color: "#6E9A82" },
  { label: "Okay", color: "#D9A45B" },
  { label: "Low", color: "#8C8AA8" },
];

const SUMMARY_CARDS = [
  { label: "Mood streak", value: `${placeholderStats.moodStreakDays} days`, accent: "sage", icon: Flame },
  { label: "Journal entries", value: placeholderStats.journalEntries, accent: "gold", icon: NotebookText },
  { label: "Last logged mood", value: placeholderStats.lastMood, accent: "sage", icon: Sparkles },
];

const QUICK_LINKS = [
  { title: "Log today's mood", to: "/mood-tracker", desc: "Takes less than a minute.", icon: Smile },
  { title: "Write a journal entry", to: "/journal", desc: "Let your thoughts out.", icon: BookOpen },
  { title: "Take a stress check", to: "/stress", desc: "See how you're really doing.", icon: HeartPulse },
];

export default function Dashboard() {
  return (
    <main className="mb-dash">
      <header className="mb-dash__header">
  <div className="mb-dash__header-row">
    <div>
      <span className="mb-dash__eyebrow">Dashboard</span>
      <h1>{getGreeting()}, {placeholderStats.userName}</h1>
      <p>Here's a quick look at how you've been doing.</p>
    </div>
    <div className="mb-dash__avatar">
      {placeholderStats.userName.charAt(0)}
    </div>
  </div>
</header>

      <section className="mb-dash__stats">
       {SUMMARY_CARDS.map((card) => {
  const Icon = card.icon;
  return (
    <div className={`mb-stat-card mb-stat-card--${card.accent}`} key={card.label}>
      <div className="mb-stat-card__icon">
        <Icon size={18} />
      </div>
      <span className="mb-stat-card__value">{card.value}</span>
      <span className="mb-stat-card__label">{card.label}</span>
    </div>
  );
})}
      </section>
      
     <section className="mb-dash__week">
  <h2>This week</h2>
  <div className="mb-dash__week-legend">
    {MOOD_LEGEND.map((m) => (
      <span key={m.label} className="mb-dash__legend-item">
        <span className="mb-dash__legend-dot" style={{ background: m.color }} />
        {m.label}
      </span>
    ))}
  </div>
  <div className="mb-dash__week-grid">
    {weeklyMood.map((d) => (
      <div className="mb-dash__week-day" key={d.day}>
        <div className="mb-dash__week-dot" style={{ background: d.color }} />
        <span>{d.day}</span>
      </div>
    ))}
  </div>
</section>

      <section className="mb-dash__quick">
        <h2>Quick actions</h2>
        <div className="mb-dash__quick-grid">
          {QUICK_LINKS.map((item) => {
  const Icon = item.icon;
  return (
    <Link to={item.to} className="mb-quick-card" key={item.title}>
      <div className="mb-quick-card__icon">
        <Icon size={22} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </Link>
  );
})}
        </div>
      </section>
    </main>
  );
}
