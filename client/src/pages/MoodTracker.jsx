import { useState, useEffect } from "react";
import API from "../utils/api";
import { getUserStorageKey } from "../utils/userStorage";
import "./MoodTracker.css";
import moodImage from "../assets/images/mood.jpg";
import moodImageOne from "../assets/images/m1.jpeg";
import moodImageTwo from "../assets/images/m2.jpeg";
import moodImageThree from "../assets/images/m3.jpeg";

const MOOD_STORAGE_KEY = "heallink-moods";

const getStoredMoods = () => {
  try {
    return JSON.parse(localStorage.getItem(getUserStorageKey(MOOD_STORAGE_KEY)) || "[]");
  } catch (error) {
    console.error("Unable to read saved moods", error);
    return [];
  }
};

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState(getStoredMoods);
  const [imageIndex, setImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);

  const moodImages = [moodImageOne, moodImageTwo, moodImageThree, moodImage];

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
      const res = await API.get("/moods");
      setMoods(res.data);
      localStorage.setItem(getUserStorageKey(MOOD_STORAGE_KEY), JSON.stringify(res.data));
    } catch {
      setMoods(getStoredMoods());
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    const imageTimer = window.setInterval(() => {
      setImageIndex((currentIndex) => {
        setPreviousImageIndex(currentIndex);
        return (currentIndex + 1) % moodImages.length;
      });
    }, 5000);

    return () => window.clearInterval(imageTimer);
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
      const response = await API.post("/moods", {
        mood,
        note,
      });
      const nextMoods = [response.data, ...moods];
      setMoods(nextMoods);
      localStorage.setItem(getUserStorageKey(MOOD_STORAGE_KEY), JSON.stringify(nextMoods));

      setMood("");
      setNote("");
    } catch {
      const nextMoods = [localMood, ...moods];
      setMoods(nextMoods);
      localStorage.setItem(getUserStorageKey(MOOD_STORAGE_KEY), JSON.stringify(nextMoods));
      setMood("");
      setNote("");
    }
  };

  //delete mood
  const deleteMood = async (id) => {
    try {
      if (!String(id).startsWith("local-")) {
        await API.delete(`/moods/${id}`);
      }
    } catch (error) {
      console.error("Unable to delete mood online", error);
    }

    const nextMoods = moods.filter((item) => item._id !== id);
    setMoods(nextMoods);
    localStorage.setItem(getUserStorageKey(MOOD_STORAGE_KEY), JSON.stringify(nextMoods));
  }

  return (
    <main className="mood-container">
      <div className="mood-shell">
        <section className="mood-story" aria-label="Mood reflection">
          <img
            className="mood-story__image mood-story__image--previous"
            src={moodImages[previousImageIndex]}
            alt=""
            aria-hidden="true"
          />
          <img
            key={moodImages[imageIndex]}
            className="mood-story__image mood-story__image--current"
            src={moodImages[imageIndex]}
            alt="Colourful mood cards representing different feelings"
          />
          <div className="mood-story__shade" />
          <div className="mood-story__content">
            <span className="mood-eyebrow">A softer way to check in</span>
            <h1>Give your feelings a little space.</h1>
            <p>Pause, notice what is present, and keep a gentle record of your day.</p>
          </div>
        </section>

        <section className="mood-panel">
          <div className="mood-heading">
            <p className="mood-kicker">Your private check-in</p>
            <h2 className="mood-title">Mood Tracker</h2>
            <p className="mood-intro-text">How are you feeling right now?</p>
          </div>

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
            Save Mood <span aria-hidden="true">&#8594;</span>
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
        </section>
      </div>
    </main>
  );
}

export default MoodTracker;