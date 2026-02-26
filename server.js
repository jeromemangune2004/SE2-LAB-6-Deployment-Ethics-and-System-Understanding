import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db.js";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();

// Middlewares
// Mas maigi na naka-specify ang origin para hindi harangin ng browser
app.use(cors({
  origin: "https://lab-6-front-end.onrender.com",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Routes
// Ito ang kailangang mag-match sa api.js at MoodForm.vue
app.use("/moods", moodRoutes);  

// Test DB route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ status: "DB Connected", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root Route - Ito ang magpapatunay kung "Live" na ang backend
app.get("/", (req, res) => {
  res.send("Backend is running and connected!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});