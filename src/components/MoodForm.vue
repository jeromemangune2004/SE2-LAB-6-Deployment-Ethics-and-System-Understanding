<template>
  <div class="app-wrapper">
    <div class="container">
      <header>
        <h1>🌱 Mood Tracker</h1>
        <p>How are you feeling today?</p>
      </header>

      <div class="card form-card">
        <div class="input-group">
          <label>Full Name</label>
          <input v-model="name" placeholder="Enter your name..." />
        </div>
        
        <div class="input-group">
          <label>Your Mood</label>
          <input v-model="mood" placeholder="e.g. Happy, Tired, Grateful..." />
        </div>
        
        <button @click="submitMood" class="submit-btn">Submit Entry</button>
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      </div>

      <div class="card history-card">
        <h3>📜 Recent History</h3>
        <div v-if="moods.length === 0" class="empty-state">No entries yet. Share your mood!</div>
        <ul v-else>
          <li v-for="m in moods" :key="m.id" class="mood-item">
            <div class="mood-content">
              <span class="user-name">{{ m.user_name }}</span>
              <span class="mood-tag">{{ m.mood_text }}</span>
            </div>
          </li>
        </ul>
      </div>
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
      moods: [],
      errorMessage: ""
    };
  },
  methods: {
    async submitMood() {
      if (!this.name || !this.mood) {
        this.errorMessage = "Please fill both fields";
        return;
      }
      try {
        await api.post("/moods", { 
          full_name: this.name, 
          mood_text: this.mood 
        });
        
        this.name = "";
        this.mood = "";
        this.errorMessage = "";
        this.loadMoods();
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error submitting mood. Check backend or network.";
      }
    },
    async loadMoods() {
      try {
        const res = await api.get("/moods");
        this.moods = res.data;
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error loading moods";
      }
    }
  },
  mounted() {
    this.loadMoods();
  }
};
</script>

<style scoped>
/* Main Background */
.app-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 500px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2d3436;
  font-size: 2.5rem;
  margin-bottom: 5px;
}

header p {
  color: #636e72;
}

/* Card Styling */
.card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  margin-bottom: 25px;
}

/* Form Styling */
.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover {
  background: #5b4cc4;
}

.error-msg {
  color: #d63031;
  font-size: 0.85rem;
  margin-top: 10px;
  text-align: center;
}

/* History List Styling */
h3 {
  margin-top: 0;
  color: #2d3436;
  border-bottom: 2px solid #f1f2f6;
  padding-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

.mood-item {
  background: #f9f9fb;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-left: 5px solid #6c5ce7;
  transition: transform 0.2s ease;
}

.mood-item:hover {
  transform: translateX(5px);
}

.user-name {
  font-weight: 700;
  color: #2d3436;
  margin-right: 10px;
}

.mood-tag {
  background: #a29bfe;
  color: white;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  color: #b2bec3;
  padding: 20px;
}
</style>