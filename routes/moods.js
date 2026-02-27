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
  
  // Gagawa tayo ng readable date string
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }); 

  try {
    await db.query("INSERT INTO users (id, full_name) VALUES (?, ?)", [manualId, full_name]);

    // Isama ang 'now' sa created_at column (kahit VARCHAR pa iyan sa Railway)
    await db.query(
      "INSERT INTO mood_entries (id, user_name, mood_text, created_at) VALUES (?, ?, ?, ?)", 
      [manualId, full_name, mood_text, now]
    );

    const aiMessage = `Keep your head up, ${full_name}!`;
    await db.query(
      "INSERT INTO ai_responses (id, mood_entry_id, ai_message) VALUES (?, ?, ?)", 
      [manualId, manualId, aiMessage]
    );

    res.status(201).json({ message: "Success!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;      