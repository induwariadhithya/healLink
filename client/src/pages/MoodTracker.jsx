import { useState, useEffect } from "react";
import axios from "axios";
import "./MoodTracker.css";

const MOOD_STORAGE_KEY = "heallink-moods";

const getStoredMoods = () => {
  try {
    return JSON.parse(localStorage.getItem(MOOD_STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Unable to read saved moods", error);
    return [];
  }
};

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState(getStoredMoods);

  const moodOptions = [
    { value: "Happy", emoji: "😄", label: "Happy" },
    { value: "Anxious", emoji: "😰", label: "Anxious" },
    { value: "Sad", emoji: "😢", label: "Sad" },
    { value: "Calm", emoji: "😌", label: "Calm" },
    { value: "Angry", emoji: "😡", label: "Angry" },
  ];

  // Get all moods
  const fetchMoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/moods");
      setMoods(res.data);
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(res.data));
    } catch (error) {
      setMoods(getStoredMoods());
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  // Save mood
  const saveMood = async () => {
    if (!mood) {
      return;
    }

    const localMood = {
      _id: `local-${Date.now()}`,
      mood,
      note,
      date: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/moods", {
        mood,
        note,
      });
      const nextMoods = [response.data, ...moods];
      setMoods(nextMoods);
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(nextMoods));

      setMood("");
      setNote("");
    } catch (error) {
      const nextMoods = [localMood, ...moods];
      setMoods(nextMoods);
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(nextMoods));
      setMood("");
      setNote("");
    }
  };

  //delete mood
  const deleteMood = async (id) => {
    try {
      if (!String(id).startsWith("local-")) {
        await axios.delete(`http://localhost:5000/api/moods/${id}`);
      }
    } catch (error) {
      console.error("Unable to delete mood online", error);
    }

    const nextMoods = moods.filter((item) => item._id !== id);
    setMoods(nextMoods);
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(nextMoods));
  }

  return (
    <main className="mood-container">
      <div className="mood-card">
        <h1 className="mood-title">Mood Tracker</h1>

        <div className="mood-options" aria-label="Choose your mood">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`mood-option ${mood === option.value ? "selected" : ""}`}
              onClick={() => setMood(option.value)}
              aria-pressed={mood === option.value}
            >
              <span className="mood-emoji">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <textarea
          className="mood-notes"
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="save-mood-btn" onClick={saveMood} disabled={!mood}>
          Save Mood
        </button>

        <section className="saved-moods">
          <h2>Saved Moods</h2>

          {moods.length === 0 ? (
            <p className="empty-moods">Your saved moods will appear here.</p>
          ) : (
            <div className="saved-mood-list">
              {moods.map((item) => {
                const option = moodOptions.find((moodOption) => moodOption.value === item.mood);

                return (
                  <article className="saved-mood-card" key={item._id}>
                    <div className="saved-mood-icon">{option?.emoji || "🙂"}</div>
                    <div className="saved-mood-content">
                      <div className="saved-mood-header">
                        <h3>{item.mood}</h3>
                        <time>{new Date(item.createdAt || item.date).toLocaleDateString()}</time>
                      </div>
                      <p>{item.note || "No note added."}</p>
                    </div>
                    <button className="delete-mood" onClick={() => deleteMood(item._id)}>
                      Delete
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MoodTracker;