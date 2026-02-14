<template>
  <div class="container">
    <h1>Mood Check-in</h1>

    <!-- Form Card -->
    <div class="card">
      <h2>How are you feeling today?</h2>

      <input v-model="name" type="text" placeholder="Your Name" />
      <textarea v-model="mood" placeholder="How are you feeling today?"></textarea>
      
      <button @click="submitMood" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Submit</span>
      </button>

      <p v-if="aiMessage" class="ai-message">AI Advisor: {{ aiMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <!-- Mood History Card -->
    <div class="card">
      <h3>Mood History</h3>
      <p v-if="records.length === 0">No moods submitted yet.</p>
      <ul v-else>
        <li v-for="r in records" :key="r.id">
          <strong>{{ r.name }}</strong> - <span :class="moodClass(r.mood)">{{ r.mood }}</span>
          <em>({{ r.created_at }})</em>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      name: "",
      mood: "",
      aiMessage: "",
      records: [],
      loading: false,
      errorMessage: ""
    };
  },
  methods: {
    async submitMood() {
      if (!this.name || !this.mood) {
        alert("Please fill both fields");
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      try {
        await api.post("/api/records", {
          name: this.name,
          mood: this.mood
        });

        const res = await api.post("/api/ai-advice", { mood: this.mood });
        this.aiMessage = res.data.advice || "No advice returned";

        this.name = "";
        this.mood = "";

        this.loadRecords();
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error submitting mood. Check backend or network.";
      } finally {
        this.loading = false;
      }
    },
    async loadRecords() {
      this.errorMessage = "";
      try {
        const res = await api.get("/api/records");
        this.records = res.data;
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error loading records.";
      }
    },
    moodClass(mood) {
      if (!mood) return "";
      const m = mood.toLowerCase();
      if (m.includes("happy") || m.includes("joy") || m.includes("excited")) return "mood-happy";
      if (m.includes("sad") || m.includes("depressed") || m.includes("lonely")) return "mood-sad";
      if (m.includes("angry") || m.includes("frustrated") || m.includes("annoyed")) return "mood-angry";
      if (m.includes("anxious") || m.includes("worried") || m.includes("nervous")) return "mood-anxious";
      if (m.includes("tired") || m.includes("sleepy") || m.includes("exhausted")) return "mood-tired";
      if (m.includes("calm") || m.includes("relaxed") || m.includes("peaceful")) return "mood-calm";
      if (m.includes("stressed") || m.includes("overwhelmed")) return "mood-stressed";
      return "mood-neutral"; // fallback for any other mood
    }
  },
  mounted() {
    this.loadRecords();
  }
};
</script>

<style>
.container {
  max-width: 600px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}

.card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h1 { text-align: center; margin-bottom: 30px; color: #333; }
h2, h3 { margin-bottom: 15px; color: #555; }

input, textarea {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
}

button {
  width: 100%;
  background-color: #4f46e5;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

button:hover { background-color: #4338ca; }
button:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.ai-message { margin-top: 15px; font-weight: bold; color: #2563eb; }
.error-message { margin-top: 10px; color: #dc2626; font-weight: bold; }

/* Mood colors */
.mood-happy { color: green; font-weight: bold; }
.mood-sad { color: red; font-weight: bold; }
.mood-angry { color: darkred; font-weight: bold; }
.mood-anxious { color: orange; font-weight: bold; }
.mood-tired { color: gray; font-weight: bold; }
.mood-calm { color: teal; font-weight: bold; }
.mood-stressed { color: purple; font-weight: bold; }
.mood-neutral { color: black; font-weight: bold; }

ul { list-style: none; padding: 0; }
li {
  background: #fff;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  font-size: 14px;
}
</style>
