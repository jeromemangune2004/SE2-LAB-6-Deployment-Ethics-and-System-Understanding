<template>
  <div class="container">
    <h1>Mood Check-in</h1>

    <div class="card">
      <input v-model="name" placeholder="Your Name..." />
      <input v-model="mood" placeholder="Type your mood..." />
      <button @click="submitMood">Submit</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div class="card">
      <h3>Mood History</h3>
      <ul>
        <li v-for="m in moods" :key="m.id">
          <strong>{{ m.user_name }}</strong>: {{ m.mood_text }}
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
        // Inadjust ang payload para mag-match sa Backend (full_name, mood_text)
        // At tinanggal ang /api dahil nasa api.js na iyon
        await api.post("/moods", { 
          full_name: this.name, 
          mood_text: this.mood 
        });
        
        this.name = "";
        this.mood = "";
        this.errorMessage = ""; // Linisin ang error message kapag success
        this.loadMoods();
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error submitting mood. Check backend or network.";
      }
    },
    async loadMoods() {
      try {
        // Tinanggal ang /api dahil nasa api.js na iyon
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