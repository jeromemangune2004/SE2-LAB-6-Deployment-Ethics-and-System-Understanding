import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all moods
router.get("/", (req, res) => {
  db.query("SELECT * FROM moods ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new mood
router.post("/", (req, res) => {
  const { name, mood } = req.body;
  if (!name || !mood) return res.status(400).json({ error: "Name and mood are required" });

  db.query("INSERT INTO moods (name, mood) VALUES (?, ?)", [name, mood], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Mood added successfully!" });
  });
});

export default router;
