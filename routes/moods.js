import express from "express";
import { db } from "../db.js";
// 1. IMPORT: Siguraduhin na naka-import ang AI service sa taas
import { getAIResponse } from "../services/aiService.js"; 

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

  const now = new Date(new Date().getTime() + (8 * 60 * 60 * 1000))
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ');

  try {
    // 2. DYNAMIC MESSAGE: Tawagin ang AI service base sa mood_text ng user
    const aiMessage = await getAIResponse(mood_text);

    // 3. DATABASE SAVING: Isama ang lahat sa tamang tables
    await db.query("INSERT INTO users (id, full_name) VALUES (?, ?)", [manualId, full_name]);

    await db.query(
      "INSERT INTO mood_entries (id, user_name, mood_text, created_at) VALUES (?, ?, ?, ?)", 
      [manualId, full_name, mood_text, now]
    );

    // Dito na papasok ang iba-ibang messages sa Railway table mo
    await db.query(
      "INSERT INTO ai_responses (id, mood_entry_id, ai_message) VALUES (?, ?, ?)", 
      [manualId, manualId, aiMessage]
    );

    res.status(201).json({ 
      message: "Success!", 
      ai_response: aiMessage 
    });
  } catch (err) {
    console.error("SQL Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;