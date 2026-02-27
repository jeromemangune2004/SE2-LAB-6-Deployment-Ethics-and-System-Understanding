import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM mood_entries ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body;
  
  const manualId = Math.floor(Math.random() * 1000000); 

  // FIX: SQL-safe format (YYYY-MM-DD HH:MM:SS) para hindi mag-error ang database
  const now = new Date(new Date().getTime() + (8 * 60 * 60 * 1000))
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ');

  try {
    // 1. I-save sa 'users' table
    await db.query("INSERT INTO users (id, full_name) VALUES (?, ?)", [manualId, full_name]);

    // 2. I-save sa 'mood_entries' table kasama ang created_at
    await db.query(
      "INSERT INTO mood_entries (id, user_name, mood_text, created_at) VALUES (?, ?, ?, ?)", 
      [manualId, full_name, mood_text, now]
    );

    // 3. I-save sa 'ai_responses' table
    const aiMessage = `Keep your head up, ${full_name}! You're doing great.`;
    await db.query(
      "INSERT INTO ai_responses (id, mood_entry_id, ai_message) VALUES (?, ?, ?)", 
      [manualId, manualId, aiMessage]
    );

    res.status(201).json({ message: "Success! Data saved manually with timestamp." });
  } catch (err) {
    console.error("SQL Error:", err.message); // Makikita mo ito sa Render logs
    res.status(500).json({ error: err.message });
  }
});

export default router;