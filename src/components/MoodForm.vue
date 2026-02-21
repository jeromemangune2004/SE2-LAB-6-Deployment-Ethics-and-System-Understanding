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
          {{ m.name }} - {{ m.mood }}
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
        await api.post("/api/moods", { name: this.name, mood: this.mood });
        this.name = "";
        this.mood = "";
        this.loadMoods();
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error submitting mood. Check backend or network.";
      }
    },
    async loadMoods() {
      try {
        const res = await api.get("/api/moods");
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

<style>
.container { max-width: 600px; margin: auto; font-family: Arial; }
.card { padding: 15px; border: 1px solid #ddd; margin-bottom: 10px; }
.error { color: red; }
</style>