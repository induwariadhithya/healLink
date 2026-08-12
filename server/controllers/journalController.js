const Journal = require("../models/journal");

const getJournals = async (req, res) => {
  try {
    console.log("GET /api/journals called");
    const entries = await Journal.find().sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJournal = async (req, res) => {
  try {
    console.log("POST /api/journals body:", req.body);
    console.log("POST /api/journals file:", req.file && req.file.filename);

    const { title, content, mood, userId } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const entry = new Journal({
      title,
      content,
      mood,
      userId,
      image: imagePath,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (mood !== undefined) updateData.mood = mood;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const entry = await Journal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Journal.findByIdAndDelete(id);

    if (!entry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.status(200).json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
};
