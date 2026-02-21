import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Root route (for Part 2)
app.get("/", (req, res) => {
  res.send("Backend is running! Go to /test-db to test DB connection.");
=======
app.use("/api/moods", moodRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running! Use /api/moods to GET/POST moods.");
});

// Test DB connection
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "DB Connected", rows });
  });
>>>>>>> a70a313 (Activity)
});

// Moods routes
app.use("/api/moods", moodRoutes);

// Test DB connection
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "DB Connected", rows });
  });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
