const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getMoods,
  createMood,
  updateMood,
  deleteMood,
} = require("../controllers/moodController");

router.use(protect);

router.get("/", getMoods);

router.post("/", createMood);

router.put("/:id", updateMood);

router.delete("/:id", deleteMood);

module.exports = router;