import { getAIResponse } from "../services/aiService.js"; // Idagdag mo itong import sa taas

// Add a new mood
router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body; 

  if (!full_name || !mood_text) {
    return res.status(400).json({ error: "Name and mood are required" });
  }

  try {
    // 1. I-save muna ang mood sa mood_entries
    // Tandaan: Palitan ang 'mood_text' ng 'mood' sa query na ito kung na-rename mo na sa Railway!
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_name, mood_text) VALUES (?, ?)", 
      [full_name, mood_text]
    );

    // 2. Kunin ang ID ng bagong mood entry
    const newMoodId = result.insertId;

    // 3. Kunin ang text mula sa aiService.js ("Remember to pause...")
    const aiText = await getAIResponse(mood_text);

    // 4. I-save sa ai_responses table (Base sa screenshot mo)
    // Ginagamit natin ang 'mood_entry_id' at 'ai_message' columns mo
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