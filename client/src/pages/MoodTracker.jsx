import { useState, useEffect } from "react";
import axios from "axios";
import "./MoodTracker.css";

function MoodTracker() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

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
      alert("Error saving mood");
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
    <div className="mood-container">
      <h1 className="mood-title">Mood Tracker</h1>

      <select
        className="mood-select"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        <option value="">Select Mood</option>
        <option value="Happy">Happy 😊</option>
        <option value="Sad">Sad 😢</option>
        <option value="Calm">Calm 😌</option>
        <option value="Stressed">Stressed 😣</option>
        <option value="Anxious">Anxious 😰</option>
      </select>

      <br /><br />

      <textarea
        className="mood-notes"
        rows="5"
        cols="40"
        placeholder="Write your note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <br /><br />

      <button onClick={saveMood}>Save Mood</button>

      <hr />

      <h2>Saved Moods</h2>

      {moods.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{item.mood}</h3>
          <p>{item.note}</p>
          <button onClick={() => deleteMood(item._id)}>
  Delete
</button>
        </div>
      ))}
    </div>
  );
}

export default MoodTracker;