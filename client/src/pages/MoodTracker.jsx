import { useState, useEffect } from "react";
import axios from "axios";
import "./MoodTracker.css";

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  // Save mood
  const saveMood = async () => {
    if (!mood) {
      alert("Please select a mood before saving.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/moods", {
        mood,
        note,
      });

      alert("Mood Saved Successfully!");

      setMood("");
      setNote("");

      fetchMoods();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error saving mood");
    }
  };

  //delete mood
  const deleteMood = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/moods/${id}`);
    fetchMoods();
  } catch (error) {
    console.log(error);
  }
};

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