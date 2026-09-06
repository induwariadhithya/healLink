import { Link } from "react-router-dom";
import { Smile, BookOpen, HeartPulse, Flame, NotebookText, Sparkles, Compass } from "lucide-react";
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
import wellnessHubActionImg from "../assets/images/wellness-hub-action.jpg";
import "./Dashboard.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getFormattedTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
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
  { title: "Visit Wellness Hub", to: "/wellness-hub", desc: "Explore tips and resources.", icon: Compass, image: wellnessHubActionImg },
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

  // Live clock — updates every second
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

    useEffect(() => {
    // Helper: build a timezone-safe date key (YYYY-MM-DD) using local date parts
    function toLocalDateKey(dateInput) {
      const d = new Date(dateInput);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Fetch mood entries
    fetch("http://localhost:5000/api/moods")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLastMood(data[0].mood);
          setMoodStreak(data.length);

          const moodColorMap = {
            Happy: "#6E9A82",
            Calm: "#6E9A82",
            Anxious: "#D9A45B",
            Sad: "#8C8AA8",
            Angry: "#8C8AA8",
          };

          const today = new Date();
          const last7Days = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(toLocalDateKey(d));
          }

          const moodByDate = {};
          data.forEach((entry) => {
            const entryDate = toLocalDateKey(entry.date || entry.createdAt);
            if (!moodByDate[entryDate]) {
              moodByDate[entryDate] = entry.mood;
            }
          });

          const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const updatedWeek = last7Days.map((dateKey) => {
            const [y, m, d] = dateKey.split("-").map(Number);
            const localDate = new Date(y, m - 1, d);
            const label = dayLabels[localDate.getDay()];
            const mood = moodByDate[dateKey];
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
  { label: "Mood entries", value: moodStreak, accent: "sage", icon: Flame, image: cardStreakImg },
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
  <span className="mb-dash__time">{currentTime}</span>
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