import { Link } from "react-router-dom";
import { Smile, BookOpen, HeartPulse, Flame, NotebookText, Sparkles } from "lucide-react";
import heroImg from "../assets/images/dashboard-hero.jpg";
import moodActionImg from "../assets/images/mood-action.jpg";
import journalActionImg from "../assets/images/journal-action.jpg";
import stressActionImg from "../assets/images/stress-action.jpg";
import heroBgImg from "../assets/images/dashboard-hero-bg.jpg";
import cardStreakImg from "../assets/images/card-streak.jpg";
import cardJournalImg from "../assets/images/card-journal.jpg";
import cardMoodImg from "../assets/images/card-mood.jpg";
import weekBgImg from "../assets/images/week-bg.jpg";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import "./Dashboard.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const MOOD_LEGEND = [
  { label: "Calm", color: "#6E9A82" },
  { label: "Okay", color: "#D9A45B" },
  { label: "Low", color: "#8C8AA8" },
];

const QUICK_LINKS = [
  { title: "Log today's mood", to: "/mood-tracker", desc: "Takes less than a minute.", icon: Smile, image: moodActionImg },
  { title: "Write a journal entry", to: "/journal", desc: "Let your thoughts out.", icon: BookOpen, image: journalActionImg },
  { title: "Take a stress check", to: "/stress", desc: "See how you're really doing.", icon: HeartPulse, image: stressActionImg },
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.name || "Friend";

  const [moodStreak, setMoodStreak] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [lastMood, setLastMood] = useState("—");
  const [checkedInDays, setCheckedInDays] = useState(0);
  const [weeklyMood, setWeeklyMood] = useState([
    { day: "Mon", color: "#E5E5E5" },
    { day: "Tue", color: "#E5E5E5" },
    { day: "Wed", color: "#E5E5E5" },
    { day: "Thu", color: "#E5E5E5" },
    { day: "Fri", color: "#E5E5E5" },
    { day: "Sat", color: "#E5E5E5" },
    { day: "Sun", color: "#E5E5E5" },
  ]);

  useEffect(() => {
    // Fetch mood entries
    fetch("http://localhost:5000/api/moods")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLastMood(data[0].mood);
          setMoodStreak(data.length);

          const moodColorMap = {
  Happy: "#6E9A82",   // green - Calm category
  Calm: "#6E9A82",    // green
  Anxious: "#D9A45B", // gold - Okay category
  Sad: "#8C8AA8",     // purple - Low category
  Angry: "#8C8AA8",   // purple - Low category
};

          const today = new Date();
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(d.toDateString());
          }

          const moodByDate = {};
          data.forEach((entry) => {
            const entryDate = new Date(entry.date || entry.createdAt).toDateString();
            if (!moodByDate[entryDate]) {
              moodByDate[entryDate] = entry.mood;
            }
          });

          const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const updatedWeek = last7Days.map((dateStr) => {
            const date = new Date(dateStr);
            const label = dayLabels[date.getDay()];
            const mood = moodByDate[dateStr];
            return {
              day: label,
              color: mood ? (moodColorMap[mood] || "#8C8AA8") : "#E5E5E5",
            };
          });

          setWeeklyMood(updatedWeek);
          setCheckedInDays(
            Object.keys(moodByDate).filter((d) => last7Days.includes(d)).length
          );
        }
      })
      .catch((err) => console.error("Failed to fetch moods:", err));

    // Fetch journal entries
    fetch("http://localhost:5000/api/journals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJournalCount(data.length);
        }
      })
      .catch((err) => console.error("Failed to fetch journal entries:", err));
  }, []);

  const SUMMARY_CARDS = [
    { label: "Mood streak", value: `${moodStreak} days`, accent: "sage", icon: Flame, image: cardStreakImg },
    { label: "Journal entries", value: journalCount, accent: "gold", icon: NotebookText, image: cardJournalImg },
    { label: "Last logged mood", value: lastMood, accent: "sage", icon: Sparkles, image: cardMoodImg },
  ];

  return (
    <main className="mb-dash">

      {/* --- Hero header + stats --- */}
      <section className="mb-dash__hero">
        <img src={heroBgImg} alt="" className="mb-dash__hero-bg" />
        <div className="mb-dash__hero-overlay" aria-hidden="true" />
        <div className="mb-dash__hero-glow" aria-hidden="true" />
        <div className="mb-dash__hero-glow-2" aria-hidden="true" />
        <img src={heroImg} alt="" className="mb-dash__hero-img" />

        <header className="mb-dash__header">
          <div className="mb-dash__header-row">
            <div>
              <span className="mb-dash__eyebrow">Dashboard</span>
              <h1>{getGreeting()}, {displayName}</h1>
              <p>Here's a quick look at how you've been doing.</p>
            </div>
            <div className="mb-dash__header-right">
              <span className="mb-dash__date">{getFormattedDate()}</span>
              <div className="mb-dash__avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <section className="mb-dash__stats">
          {SUMMARY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div className={`mb-stat-card mb-stat-card--${card.accent}`} key={card.label}>
                <img src={card.image} alt="" className="mb-stat-card__bg" />
                <div className="mb-stat-card__icon">
                  <Icon size={18} />
                </div>
                <span className="mb-stat-card__value">{card.value}</span>
                <span className="mb-stat-card__label">{card.label}</span>
              </div>
            );
          })}
        </section>

        <div className="mb-dash__progress">
          <div className="mb-dash__progress-labels">
            <span>Weekly check-ins</span>
            <span>{checkedInDays}/7 days</span>
          </div>
          <div className="mb-dash__progress-bar">
            <div
              className="mb-dash__progress-fill"
              style={{ width: `${(checkedInDays / 7) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* --- Weekly mood overview --- */}
      <section className="mb-dash__week">
        <img src={weekBgImg} alt="" className="mb-dash__week-bg" />
        <div className="mb-dash__week-content">
          <h2>This week</h2>
          <p className="mb-dash__week-caption">
            A quick look at your mood pattern over the past 7 days.
          </p>
          <div className="mb-dash__week-legend">
            {MOOD_LEGEND.map((m) => (
              <span key={m.label} className="mb-dash__legend-item">
                <span className="mb-dash__legend-dot" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
          <div className="mb-dash__week-grid">
            {weeklyMood.map((d, index) => (
              <div className="mb-dash__week-day" key={`${d.day}-${index}`}>
                <div className="mb-dash__week-dot" style={{ background: d.color }} />
                <span>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Quick actions --- */}
      <section className="mb-dash__quick">
        <h2>Quick actions</h2>
        <div className="mb-dash__quick-grid">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link to={item.to} className="mb-quick-card" key={item.title}>
                <img src={item.image} alt="" className="mb-quick-card__img" />
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