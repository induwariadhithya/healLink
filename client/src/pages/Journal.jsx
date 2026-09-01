import { useState, useRef } from "react";
import "./Journal.css";

export default function Journal() {
  const entriesListRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [mood, setMood] = useState(null);
  const [thoughts, setThoughts] = useState("");
  const [goals, setGoals] = useState(["", "", ""]);
  const [grateful, setGrateful] = useState("");
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "Oct 26",
      title: "Sunrise Walk",
      mood: "😄",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      thoughts: "",
      tags: ["#gratitude", "#work"],
    },
    {
      id: 2,
      date: "Oct 24",
      title: "Book & Tea",
      mood: "😄",
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
      thoughts: "",
      tags: ["#gratitude", "#work"],
    },
    {
      id: 3,
      date: "Oct 11",
      title: "Seascape",
      mood: "😌",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      thoughts: "",
      tags: ["#gratitude", "#family"],
    },
    {
      id: 4,
      date: "Oct 10, 2023",
      title: "Daily Thoughts",
      mood: "😌",
      image: null,
      thoughts: "Happy thoughts. I'd wor. I can meanly nothing and peace...",
      tags: ["#gratitude", "#work"],
    },
  ]);
  const [newestEntryId, setNewestEntryId] = useState(null);

  const moods = [
    { emoji: "😄", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "🧘", label: "Peaceful" },
  ];

  const handleSaveEntry = () => {
    // Create a title from the first few words of thoughts or a default
    const title = thoughts.slice(0, 30).trim() || "Daily Reflection";
    
    const newEntryId = entries.length + 1;
    const newEntry = {
      id: newEntryId,
      date: new Date(selectedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      title: title,
      mood: mood || "😌",
      image: null,
      thoughts: thoughts,
      tags: ["#gratitude"],
    };

    setEntries([newEntry, ...entries]);
    setNewestEntryId(newEntryId);
    resetForm();
    
    // Scroll to the top of entries list to show the new entry
    setTimeout(() => {
      if (entriesListRef.current) {
        entriesListRef.current.scrollTop = 0;
      }
    }, 0);
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setNewestEntryId(null);
    }, 3000);
  };

  const resetForm = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setMood(null);
    setThoughts("");
    setGoals(["", "", ""]);
    setGrateful("");
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  return (
    <div className="journal-container">
      <div className="journal-content">
        {/* Left Section - Daily Reflection Form */}
        <div className="reflection-section">
          <h2>Your Daily Reflection</h2>

          {/* Date Picker */}
          <div className="form-group">
            <label>Date picker</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          {/* Mood Selection */}
          <div className="form-group">
            <label>How are you feeling?</label>
            <div className="mood-selector">
              {moods.map((m) => (
                <button
                  key={m.label}
                  className={`mood-btn ${mood === m.emoji ? "active" : ""}`}
                  onClick={() => setMood(m.emoji)}
                  title={m.label}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Thoughts */}
          <div className="form-group">
            <label>Today's Thoughts:</label>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Write your thoughts here..."
              className="form-textarea"
            />
          </div>

          {/* Goals for Tomorrow */}
          <div className="form-group">
            <label>Goals for Tomorrow:</label>
            <div className="goals-list">
              {goals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <input
                    type="checkbox"
                    id={`goal-${index}`}
                    className="goal-checkbox"
                  />
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    placeholder={`Goal ${index + 1}`}
                    className="goal-input"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Grateful For */}
          <div className="form-group">
            <label>Grateful For:</label>
            <textarea
              value={grateful}
              onChange={(e) => setGrateful(e.target.value)}
              placeholder="What are you grateful for today?"
              className="form-textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-save" onClick={handleSaveEntry}>
              Save Entry
            </button>
            <button className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>

        {/* Right Section - Past Entries */}
        <div className="entries-section">
          <h2>Past Entries</h2>
          <div className="entries-list" ref={entriesListRef}>
            {entries.map((entry) => (
              <div key={entry.id} className={`entry-card ${newestEntryId === entry.id ? "new-entry" : ""}`}>
                {entry.image && (
                  <img src={entry.image} alt={entry.title} className="entry-image" />
                )}
                <div className="entry-content">
                  <div className="entry-header">
                    <span className="entry-date">{entry.date}</span>
                    {!entry.image && <span className="entry-mood">{entry.mood}</span>}
                  </div>
                  <h3 className="entry-title">{entry.title}</h3>
                  {entry.thoughts && (
                    <p className="entry-thoughts">{entry.thoughts}</p>
                  )}
                  <div className="entry-tags">
                    {entry.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="entry-actions">
                  <button className="btn-edit" title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    title="Delete"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
