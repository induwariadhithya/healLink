const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
} = require("../controllers/journalController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getJournals);
router.post("/", upload.single("image"), createJournal);
router.put("/:id", upload.single("image"), updateJournal);
router.delete("/:id", deleteJournal);

module.exports = router;
