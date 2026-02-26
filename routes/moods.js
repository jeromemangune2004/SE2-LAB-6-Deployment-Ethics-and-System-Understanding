import express from "express";
import { db } from "../db.js"; // Siguraduhin na may { db }
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();


router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body; 

  if (!full_name || !mood_text) {
    return res.status(400).json({ error: "Name and mood are required" });
  }

  try {
    
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_name, mood_text) VALUES (?, ?)", 
      [full_name, mood_text]
    );

   
    const newMoodId = result.insertId;

 
    const aiText = await getAIResponse(mood_text);

    
    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)", 
      [newMoodId, aiText]
    );
      
    res.status(201).json({ message: "Mood and AI response added successfully!" });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router; 