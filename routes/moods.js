import express from "express";
import { db } from "../db.js";
const router = express.Router();

// 1. GET Route - Para mawala ang 404 error sa Mood History
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM mood_entries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST Route - Para magkalaman ang tables mo
router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body;

  try {
    // I-save sa 'users' table
    await db.query("INSERT INTO users (full_name) VALUES (?)", [full_name]);

    // I-save sa 'mood_entries' table
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_name, mood_text) VALUES (?, ?)", 
      [full_name, mood_text]
    );

    const moodId = result.insertId;

    // Mag-generate ng simpleng AI message (dahil empty pa ang ai_responses)
    const aiMessage = `Keep your head up, ${full_name}! Everything will be fine.`;
    
    // I-save sa 'ai_responses' table
    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)", 
      [moodId, aiMessage]
    );

    res.status(201).json({ message: "Success! Data saved to all tables." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;