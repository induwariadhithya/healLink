import { useEffect, useMemo, useState } from "react";
import "./Journal.css";

const MOODS = [
  { value: "Happy", label: "Happy", emoji: "😊" },
  { value: "Good", label: "Good", emoji: "🙂" },
  { value: "Neutral", label: "Neutral", emoji: "😐" },
  { value: "Sad", label: "Sad", emoji: "😔" },
  { value: "Stressed", label: "Stressed", emoji: "😣" },
];

const PROMPTS = [
  "What is something you're grateful for today?",
  "What made you smile today?",
  "What was challenging today?",
  "What is something you learned?",
  "What are you looking forward to?",
  "What would you like to improve tomorrow?",
];

const EDUCATION_CARDS = [
  {
    icon: "✍️",
    title: "How to Journal",
    description: "Write freely. Don't worry about grammar or making everything perfect.",
  },
  {
    icon: "💭",
    title: "What Can I Write?",
    description: "Thoughts, feelings, experiences, goals, gratitude and reflections.",
  },
  {
    icon: "🌿",
    title: "Why Journal?",
    description: "Journaling can encourage reflection, self-awareness and emotional awareness.",
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildImageUrl = (imagePath) =>
  imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${window.location.protocol}//${window.location.hostname}:5000${imagePath}`
    : "";

export default function Journal() {
  const [selectedMood, setSelectedMood] = useState("Happy");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterMood, setFilterMood] = useState("All");
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/journals");
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your journal entries right now.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedMood("Happy");
    setSelectedFile(null);
    setPreviewUrl("");
    setEditingEntry(null);
    setError("");
  };

  const handleSaveEntry = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setError("Please add a few words about your day.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const entryTitle = title.trim() || "My day";
      const isEditing = Boolean(editingEntry);
      const endpoint = isEditing ? `/api/journals/${editingEntry._id}` : "/api/journals";
      const method = isEditing ? "PUT" : "POST";
      let response;

      if (selectedFile) {
        const form = new FormData();
        form.append("title", entryTitle);
        form.append("content", content.trim());
        form.append("mood", selectedMood);
        form.append("image", selectedFile);

        response = await fetch(endpoint, {
          method,
          body: form,
        });
      } else {
        response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: entryTitle,
            content: content.trim(),
            mood: selectedMood,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const entry = await response.json();
      setEntries((currentEntries) => {
        if (isEditing) {
          return currentEntries.map((item) => (item._id === entry._id ? entry : item));
        }
        return [entry, ...currentEntries];
      });

      resetForm();
    } catch (err) {
      console.error(err);
      setError("Could not save your entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title === "My day" ? "" : entry.title);
    setContent(entry.content);
    setSelectedMood(entry.mood);
    setSelectedFile(null);
    setPreviewUrl(buildImageUrl(entry.image));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteEntry = async (id) => {
    const confirmDelete = window.confirm("Delete this entry permanently?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/journals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setEntries((currentEntries) => currentEntries.filter((entry) => entry._id !== id));
      if (expandedId === id) {
        setExpandedId(null);
      }
      if (editingEntry?._id === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete the entry. Please try again.");
    }
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        const searchMatch = [entry.title, entry.content]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const moodMatch = filterMood === "All" || entry.mood === filterMood;
        return searchMatch && moodMatch;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);

        if (sortOrder === "newest") {
          return bDate - aDate;
        }
        return aDate - bDate;
      });
  }, [entries, searchTerm, sortOrder, filterMood]);

  const entriesThisWeek = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return entryDate >= weekAgo && entryDate <= now;
  }).length;

  const moodsUsed = new Set(entries.map((entry) => entry.mood)).size;
  const recentMoods = entries.slice(0, 8).map((entry) => MOODS.find((m) => m.value === entry.mood)?.emoji || "");
  const hasWrittenToday = entries.some((entry) => isSameDay(new Date(entry.date), new Date()));
  const currentPrompt = PROMPTS[promptIndex];

  const handleAnotherPrompt = () => {
    setPromptIndex((current) => (current + 1) % PROMPTS.length);
  };

  const charCount = content.length;
  const isSaveDisabled = !content.trim() || saving;

  return (
    <main className="mb-journal">
      <section className="mb-journal__hero">
        <div className="mb-journal__hero-inner">
          <div>
            <span className="mb-journal__eyebrow">Journal</span>
            <h1 className="mb-journal__hero-title">Today's reflection</h1>
            <p className="mb-journal__hero-sub">A calm space for your thoughts, progress, and daily gratitude.</p>
          </div>

          <div className={`mb-status-card ${hasWrittenToday ? "mb-status-card--done" : ""}`}>
            <p className="mb-status-card__pre">{hasWrittenToday ? "You've reflected today ✨" : "You haven't written today yet 🌱"}</p>
            <p className="mb-status-card__text">{hasWrittenToday ? "Come back tomorrow to continue your journey." : "Take a few minutes for yourself."}</p>
          </div>
        </div>
      </section>

      <section className="mb-journal__hero-grid">
        <article className="mb-prompt-card">
          <div className="mb-prompt-card__header">
            <span className="mb-journal__eyebrow">Today's prompt 💭</span>
            <button type="button" className="mb-btn mb-btn--ghost" onClick={handleAnotherPrompt}>
              ↻ Another prompt
            </button>
          </div>
          <blockquote className="mb-prompt-card__quote">{currentPrompt}</blockquote>
          <p className="mb-prompt-card__note">Prompt is optional. Write what feels best for you.</p>
        </article>

        <article className="mb-dashboard-card">
          <h2>Your journal journey</h2>
          <div className="mb-dashboard-card__stats">
            <div>
              <span>{entries.length}</span>
              <p>Entries</p>
            </div>
            <div>
              <span>{entriesThisWeek}</span>
              <p>This week</p>
            </div>
            <div>
              <span>{moodsUsed}</span>
              <p>Moods used</p>
            </div>
          </div>
          <div className="mb-recent-moods">
            {recentMoods.length > 0 ? (
              recentMoods.map((emoji, index) => (
                <span key={index} className="mb-mood-chip">
                  {emoji}
                </span>
              ))
            ) : (
              <span className="mb-mood-chip mb-mood-chip--empty">No moods yet</span>
            )}
          </div>
        </article>
      </section>

      <section className="mb-journal__grid">
        <div className="mb-journal__panel">
          <div className="mb-journal__panel-header">
            <span className="mb-journal__panel-eyebrow">{editingEntry ? "Edit entry" : "New Journal Entry"}</span>
            <h2>{editingEntry ? "Update your reflection" : "Write something for today"}</h2>
          </div>

          <form className="mb-journal__form" onSubmit={handleSaveEntry}>
            {error && <p className="mb-journal__error">{error}</p>}

            <label className="mb-journal__label" htmlFor="journal-title">
              Title (optional)
            </label>
            <input
              id="journal-title"
              className="mb-journal__input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="My day"
              maxLength={80}
            />

            <label className="mb-journal__label" htmlFor="journal-content">
              What's on your mind?
            </label>
            <textarea
              id="journal-content"
              className="mb-journal__textarea"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write about something that made you feel calm, uncertain, grateful, or hopeful today..."
              maxLength={1200}
            />

            <div className="mb-journal__mood-card mb-journal__mood-card--compact">
              <p className="mb-journal__mood-label">Mood</p>
              <div className="mb-mood-row">
                {MOODS.map((mood) => (
                  <button
                    type="button"
                    key={mood.value}
                    className={`mb-mood-pill ${selectedMood === mood.value ? "is-active" : ""}`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="mb-mood-pill__emoji">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="mb-journal__label" htmlFor="journal-image">Attach an image (optional)</label>
            <input id="journal-image" type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <div className="mb-image-preview">
                <img src={previewUrl} alt="preview" />
              </div>
            )}

            <div className="mb-journal__footer">
              <span className="mb-journal__counter">{charCount} / 1200 characters</span>
              <div className="mb-journal__footer-actions">
                {editingEntry && (
                  <button type="button" className="mb-btn mb-btn--ghost" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="mb-btn mb-btn--primary" disabled={isSaveDisabled}>
                  {saving ? "Saving..." : editingEntry ? "Save changes" : "Save Entry ✨"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mb-journal__panel">
          <div className="mb-journal__panel-header mb-entry-header">
            <div>
              <span className="mb-journal__panel-eyebrow">Your Journal</span>
              <h2>Recent reflections</h2>
            </div>
            <div className="mb-entry-controls">
              <input
                className="mb-entry-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search entries..."
              />
              <div className="mb-entry-filters">
                <label className="mb-entry-sort">
                  <span>Sort</span>
                  <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </label>
                <div className="mb-filter-chips">
                  <button
                    type="button"
                    className={`mb-filter-chip ${filterMood === "All" ? "is-active" : ""}`}
                    onClick={() => setFilterMood("All")}
                  >
                    All dates
                  </button>
                  {MOODS.map((mood) => (
                    <button
                      type="button"
                      key={mood.value}
                      className={`mb-filter-chip ${filterMood === mood.value ? "is-active" : ""}`}
                      onClick={() => setFilterMood(mood.value)}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mb-empty-state">Loading your entries…</div>
          ) : filteredEntries.length === 0 ? (
            <div className="mb-empty-state">
              <p>No journal entries match this filter.</p>
              <p>Try a different search term or mood.</p>
            </div>
          ) : (
            <div className="mb-entry-list">
              {filteredEntries.map((entry) => {
                const preview = entry.content.length > 180
                  ? `${entry.content.slice(0, 180).trim()}...`
                  : entry.content;

                const isExpanded = expandedId === entry._id;
                const imageUrl = buildImageUrl(entry.image);
                return (
                  <article className="mb-entry-card" key={entry._id}>
                    <div className="mb-entry-card__header">
                      <div>
                        <p className="mb-entry-card__mood">{MOODS.find((m) => m.value === entry.mood)?.emoji} {entry.mood}</p>
                        <h3 className="mb-entry-card__title">{entry.title || "My day"}</h3>
                      </div>
                      <span className="mb-entry-card__date">{formatDate(entry.date)}</span>
                    </div>

                    {imageUrl && (
                      <div className="mb-entry-card__image-wrap">
                        <img src={imageUrl} alt="journal" />
                      </div>
                    )}

                    <p className="mb-entry-card__preview">{isExpanded ? entry.content : preview}</p>

                    <div className="mb-entry-card__actions">
                      {entry.content.length > 180 && (
                        <button
                          type="button"
                          className="mb-entry-card__button"
                          onClick={() => setExpandedId(isExpanded ? null : entry._id)}
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="mb-entry-card__button"
                        onClick={() => handleEditEntry(entry)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="mb-entry-card__button mb-entry-card__button--danger"
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mb-learn-section">
        <div className="mb-learn-header">
          <span className="mb-journal__eyebrow">🌱 Your Guide to Journaling</span>
          <h2>Small ideas to help you keep going.</h2>
        </div>

        <div className="mb-learn-grid">
          {EDUCATION_CARDS.map((card) => (
            <article className="mb-learn-card" key={card.title}>
              <span className="mb-learn-card__icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}

          <article className="mb-learn-card mb-learn-card--feature">
            <span className="mb-learn-card__icon">✨</span>
            <h3>Try this today</h3>
            <p>Write about one thing that made your day feel brighter and why it mattered.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
