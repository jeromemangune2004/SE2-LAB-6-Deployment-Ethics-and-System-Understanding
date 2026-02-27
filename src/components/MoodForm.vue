<template>
  <div class="fb-wrapper">
    <nav class="fb-navbar">
      <div class="nav-content">
        <div class="logo">MoodHub</div>
        <div class="nav-search"><input type="text" placeholder="Search Moods..." disabled /></div>
        <div class="nav-user">🔔 Jerome 👤</div>
      </div>
    </nav>

    <div class="fb-main-grid">
      <aside class="sidebar left">
        <div class="side-item active">🏠 Home</div>
        <div class="side-item">👤 {{ name || 'Jerome' }}</div>
        <div class="side-item">🕒 Memories</div>
        <div class="side-item">🚩 Pages</div>
      </aside>

      <main class="fb-feed-center">
        <div class="fb-card post-box">
          <div class="post-header">
            <div class="avatar">JM</div>
            <div class="fake-input">What's on your mind, {{ name || 'Jerome' }}?</div>
          </div>
          <div class="post-inputs">
            <input v-model="name" class="fb-input-name" placeholder="Full Name" />
            <textarea v-model="mood" class="fb-textarea" placeholder="Describe how you feel today..."></textarea>
          </div>
          <div class="post-footer">
            <div class="footer-action">🎥 Live Video</div>
            <div class="footer-action">📸 Photo/Video</div>
            <div class="footer-action">😊 Feeling</div>
          </div>
          <button @click="submitMood" class="fb-post-btn">Post Mood</button>
          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        </div>

        <div class="fb-feed-list">
          <h3 class="feed-title">Recent Updates</h3>
          <div v-if="moods.length === 0" class="fb-card empty-state">No stories yet.</div>
          
          <div v-for="m in moods" :key="m.id" class="fb-card feed-item fade-in">
            <div class="feed-header">
              <div class="avatar small">{{ m.user_name ? m.user_name.charAt(0).toUpperCase() : '?' }}</div>
              <div class="user-info">
                <span class="user-name">{{ m.user_name }}</span>
                <span class="post-date">{{ m.created_at || 'Just now' }} · 🌎</span>
              </div>
            </div>
            <div class="feed-content">
              <p>Feeling <span class="mood-highlight">{{ m.mood_text }}</span></p>
            </div>
            <div class="feed-footer-btns">
              <div class="footer-btn">👍 Like</div>
              <div class="footer-btn">💬 Comment</div>
              <div class="footer-btn">➡️ Share</div>
            </div>
          </div>
        </div>
      </main>

      <aside class="sidebar right">
        <h4>Contacts</h4>
        <div class="contact-item"><span class="dot"></span> AI Assistant</div>
        <div class="contact-item"><span class="dot"></span> Database Logs</div>
      </aside>
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
        this.errorMessage = "Error submitting mood.";
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
/* Full Screen Layout */
.fb-wrapper {
  background-color: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
}

/* Navbar Styling */
.fb-navbar {
  background: white;
  height: 56px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0; z-index: 1000;
  padding: 0 16px;
}
.nav-content {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.logo { color: #1877f2; font-size: 24px; font-weight: bold; }
.nav-search input { background: #f0f2f5; border: none; border-radius: 20px; padding: 8px 15px; width: 200px; }

/* Grid System */
.fb-main-grid {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  max-width: 1300px;
  margin: 0 auto;
  gap: 32px;
  width: 100%;
  padding: 20px;
}

/* Sidebar Styling */
.sidebar { position: sticky; top: 76px; height: fit-content; }
.side-item { padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.side-item:hover { background: #e4e6eb; }
.side-item.active { color: #1877f2; font-weight: bold; }
.contact-item { display: flex; align-items: center; padding: 8px; cursor: pointer; }
.dot { height: 8px; width: 8px; background: #31a24c; border-radius: 50%; margin-right: 10px; }

/* Main Feed & Cards */
.fb-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  padding: 16px;
}
.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.avatar {
  width: 40px; height: 40px; background: #1877f2;
  color: white; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-weight: bold;
}
.fake-input { color: #65676b; font-size: 17px; }

.fb-input-name, .fb-textarea {
  width: 100%; border: 1px solid #dddfe2; border-radius: 8px;
  padding: 12px; margin-bottom: 8px; background: #f0f2f5; font-size: 15px;
}
.fb-textarea { min-height: 100px; resize: none; }

.fb-post-btn {
  width: 100%; background-color: #1877f2; color: white;
  border: none; border-radius: 6px; padding: 10px;
  font-weight: bold; font-size: 16px; cursor: pointer;
}

/* Feed Item Style */
.user-name { font-weight: bold; color: #050505; }
.post-date { font-size: 12px; color: #65676b; }
.feed-content { margin: 15px 0; font-size: 18px; }
.mood-highlight { font-weight: bold; color: #1877f2; border-bottom: 2px solid #1877f2; }

.feed-footer-btns {
  border-top: 1px solid #ebedf0;
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
}
.footer-btn { color: #65676b; font-weight: 600; cursor: pointer; padding: 8px; flex: 1; text-align: center; }
.footer-btn:hover { background: #f2f2f2; border-radius: 4px; }

/* Responsiveness */
@media (max-width: 1100px) {
  .fb-main-grid { grid-template-columns: 1fr; }
  .sidebar { display: none; }
}

.fade-in { animation: fadeIn 0.5s ease-in; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>