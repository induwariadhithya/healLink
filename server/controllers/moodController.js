const Mood = require("../models/Mood");

const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMood = async (req, res) => {
  try {
    const mood = new Mood({ ...req.body, userId: req.user.id });
    const savedMood = await mood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMood = async (req, res) => {
  try {
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    res.status(200).json(updatedMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMood = async (req, res) => {
  try {
    await Mood.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: "Mood deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
};