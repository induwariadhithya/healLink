const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/journals", journalRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});