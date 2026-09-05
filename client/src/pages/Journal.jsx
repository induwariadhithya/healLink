import { useEffect, useState } from "react";
import axios from "axios";
import "./Journal.css";
import journalImage1 from "../assets/images/j1.jpeg";
import journalImage2 from "../assets/images/j2.jpeg";
import journalImage3 from "../assets/images/j3.jpeg";

const JOURNAL_STORAGE_KEY = "heallink-journal-entries";

const getStoredEntries = () => {
  try {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to read saved journal entries", error);
    return [];
  }
};

const mergeEntries = (...entryGroups) => {
  const entriesById = new Map();

  entryGroups.flat().forEach((entry) => {
    entriesById.set(entry.id, entry);
  });

  return Array.from(entriesById.values());
};

const moodOptions = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🧘", label: "Peaceful" },
];

const entryHistory = [
  {
    id: 1,
    date: "Aug 31",
    mood: "😌",
    title: "New Entry",
    image: journalImage1,
    quote: "Every new day brings a fresh reason to be grateful.",
  },
  {
    id: 2,
    date: "Aug 28",
    mood: "😊",
    title: "Morning Reset",
    image: journalImage2,
    quote: "Slow moments can be the ones that restore us most.",
  },
  {
    id: 3,
    date: "Aug 25",
    mood: "😌",
    title: "Sunset Walk",
    image: journalImage3,
    quote: "Breathe deeply and let the calm find you.",
  },
  {
    id: 4,
    date: "Oct 10, 2023",
    mood: "😌",
    title: "Daily Thoughts",
    text: "Happy thoughts. I'd work. I can finally stop and rest.",
  },
];

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState("2026-08-31");
  const [mood, setMood] = useState("😌");
  const [thoughts, setThoughts] = useState("");
  const [goals, setGoals] = useState(["", "", ""]);
  const [grateful, setGrateful] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveMessageType, setSaveMessageType] = useState("success");
  const [pastEntries, setPastEntries] = useState(() => {
    const storedEntries = getStoredEntries();
    return mergeEntries(storedEntries, entryHistory);
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/journals");
        const savedEntries = response.data.map((entry) => ({
          ...entry,
          id: entry._id,
          date: new Date(entry.date || entry.createdAt).toLocaleDateString(),
          title: entry.title || "Daily Reflection",
          text: entry.content,
          mood: entry.mood,
        }));

        const mergedEntries = mergeEntries(savedEntries, getStoredEntries(), entryHistory);
        setPastEntries(mergedEntries);
        localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(mergedEntries));
      } catch (error) {
        console.error("Unable to load journal entries", error);
        setPastEntries(mergeEntries(getStoredEntries(), entryHistory));
      }
    };

    loadEntries();
  }, []);

  useEffect(() => {
    if (!saveMessage) return;

    const timeoutId = setTimeout(() => setSaveMessage(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [saveMessage]);

  const handleGoalChange = (index, value) => {
    const nextGoals = [...goals];
    nextGoals[index] = value;
    setGoals(nextGoals);
  };

  const saveEntry = async () => {
    const content = [
      thoughts.trim(),
      grateful.trim() ? `Grateful for: ${grateful.trim()}` : "",
      goals.filter((goal) => goal.trim()).length
        ? `Goals for tomorrow: ${goals.filter((goal) => goal.trim()).join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    if (!content) {
      setSaveMessageType("error");
      setSaveMessage("Please write a thought or gratitude before saving.");
      return;
    }

    const moodValues = {
      "😄": "Happy",
      "😌": "Good",
      "😢": "Sad",
      "😰": "Stressed",
      "🧘": "Good",
    };

    const localEntry = {
      id: `local-${Date.now()}`,
      title: "Daily Reflection",
      text: content,
      mood: moodValues[mood] || "Good",
      date: new Date().toLocaleDateString(),
    };

    const previousEntries = getStoredEntries();
    const nextEntries = [localEntry, ...previousEntries.filter((entry) => !entry.id?.startsWith("local-"))];

    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(nextEntries));
      setPastEntries(nextEntries);
      setThoughts("");
      setGrateful("");
      setSaveMessageType("success");
      setSaveMessage("Saved locally. Connect the server to sync online.");

      setIsSaving(true);
      const response = await axios.post("http://localhost:5000/api/journals", {
        title: "Daily Reflection",
        content,
        mood: moodValues[mood] || "Good",
      });

      const savedEntry = response.data;
      const apiEntry = {
        ...savedEntry,
        id: savedEntry._id,
        date: new Date(savedEntry.date || savedEntry.createdAt).toLocaleDateString(),
        title: savedEntry.title,
        text: savedEntry.content,
        mood: savedEntry.mood,
      };

      const refreshedEntries = [apiEntry, ...nextEntries.filter((entry) => entry.id !== localEntry.id)];
      setPastEntries(refreshedEntries);
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(refreshedEntries));
      setSaveMessageType("success");
      setSaveMessage("Journal entry saved successfully.");
    } catch (error) {
      setSaveMessageType("warning");
      setSaveMessage(error.response?.data?.message || "Saved locally. Connect the server to sync online.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEntry = async (entry) => {
    const isLocalEntry = String(entry.id).startsWith("local-");

    try {
      if (!isLocalEntry) {
        await axios.delete(`http://localhost:5000/api/journals/${entry.id}`);
      }
    } catch (error) {
      console.error("Unable to delete journal entry online", error);
    }

    const remainingEntries = pastEntries.filter((pastEntry) => pastEntry.id !== entry.id);
    setPastEntries(remainingEntries);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(remainingEntries));
    setSaveMessageType("success");
    setSaveMessage("Journal entry deleted.");
  };

  return (
    <div className="journal-container">
      <div className="journal-page">
        {saveMessage && (
          <div className={`journal-toast ${saveMessageType}`} role="status" aria-live="polite">
            <span className="journal-toast-text">{saveMessage}</span>
            <button
              type="button"
              className="journal-toast-close"
              onClick={() => setSaveMessage("")}
              aria-label="Close notification"
            >
              OK
            </button>
          </div>
        )}
        <section className="journal-form-panel">
          <h1>Your Daily Reflection</h1>

          <div className="field-block">
            <label>Date Picker</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="field-block">
            <label>How Are You Feeling?</label>
            <div className="mood-selector">
              {moodOptions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`mood-btn ${mood === item.emoji ? "active" : ""}`}
                  onClick={() => setMood(item.emoji)}
                  title={item.label}
                >
                  <span className="mood-emoji">{item.emoji}</span>
                  <span className="mood-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-block">
            <label>Today's Thoughts:</label>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Write your thoughts here..."
              className="journal-textarea"
            />
          </div>

          <div className="field-block">
            <label>Goals for Tomorrow:</label>
            <div className="goal-list">
              {goals.map((goal, index) => (
                <div key={index} className="goal-row">
                  <input type="checkbox" className="goal-checkbox" defaultChecked readOnly />
                  <input
                    type="text"
                    value={goal}
                    placeholder={`Goal ${index + 1}`}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    className="goal-input"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="field-block">
            <label>Grateful For:</label>
            <textarea
              value={grateful}
              onChange={(e) => setGrateful(e.target.value)}
              placeholder="What are you grateful for today?"
              className="journal-textarea small"
            />
          </div>

          <button type="button" className="save-entry-btn" onClick={saveEntry} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Entry"}
          </button>
        </section>

        <aside className="journal-entries-panel">
          <h2>Past Entries</h2>

          <div className="entry-list">
            <div className="image-entry-grid">
              {entryHistory
                .filter((entry) => entry.image)
                .map((entry) => (
                  <div className="entry-card image-entry-card" key={entry.id}>
                    <div className="entry-image-wrap" title="Move your mouse over the image to see the quote">
                      <img src={entry.image} alt={entry.title} className="entry-image" />
                      <div className="entry-hover-quote">{entry.quote}</div>
                    </div>
                  </div>
                ))}
            </div>

            {pastEntries
              .filter((entry) => entry.text)
              .map((entry) => (
                <div className="entry-card text-entry-card" key={entry.id}>
                  <div className="entry-header-row">
                    <span className="entry-date">{entry.date}</span>
                    <span className="entry-mood">{entry.mood}</span>
                  </div>

                  <div className="entry-title-row">
                    <span className="entry-title">{entry.title}</span>
                  </div>

                  <div className="entry-text-row">
                    <p>{entry.text}</p>
                  </div>

                  {typeof entry.id === "string" && (
                    <button
                      type="button"
                      className="delete-entry-btn"
                      onClick={() => deleteEntry(entry)}
                    >
                      Delete Entry
                    </button>
                  )}
                </div>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
