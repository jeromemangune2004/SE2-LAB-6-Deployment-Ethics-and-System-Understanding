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
  
  // Gagawa tayo ng random ID para hindi mag-duplicate sa Primary Key
  const manualId = Math.floor(Math.random() * 1000000); 

  try {
    // 1. I-save sa 'users' table
    await db.query("INSERT INTO users (id, full_name) VALUES (?, ?)", [manualId, full_name]);

    // 2. I-save sa 'mood_entries' table gamit ang parehong ID
    await db.query(
      "INSERT INTO mood_entries (id, user_name, mood_text) VALUES (?, ?, ?)", 
      [manualId, full_name, mood_text]
    );

    // 3. I-save sa 'ai_responses' table
    const aiMessage = `Keep your head up, ${full_name}! You're doing great.`;
    await db.query(
      "INSERT INTO ai_responses (id, mood_entry_id, ai_message) VALUES (?, ?, ?)", 
      [manualId, manualId, aiMessage]
    );

    res.status(201).json({ message: "Success! Data saved manually." });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;