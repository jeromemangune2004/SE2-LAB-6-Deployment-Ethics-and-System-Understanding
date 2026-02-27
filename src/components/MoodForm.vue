<template>
  <div class="fb-wrapper">
    <nav class="fb-nav">
      <div class="nav-content">
        <div class="logo">MoodHub</div>
        <div class="nav-search">
          <input type="text" placeholder="Search Moods..." disabled />
        </div>
        <div class="nav-icons">🔔 Me 👤</div>
      </div>
    </nav>

    <div class="fb-main-layout">
      <aside class="side-panel left">
        <div class="side-item">👤 <strong>{{ name || 'Jerome' }}</strong></div>
        <div class="side-item">👥 Friends</div>
        <div class="side-item">📺 Watch</div>
        <div class="side-item">📅 Events</div>
      </aside>

      <main class="fb-feed-container">
        <div class="fb-card post-box">
          <div class="post-header">
            <div class="avatar">JM</div>
            <div class="input-trigger">What's on your mind, {{ name || 'Jerome' }}?</div>
          </div>
          <div class="post-inputs">
            <input v-model="name" class="fb-input-name" placeholder="Full Name" />
            <textarea v-model="mood" class="fb-textarea" placeholder="How are you feeling today?"></textarea>
          </div>
          <div class="post-footer-actions">
            <div class="action-btn">📷 Photo/Video</div>
            <div class="action-btn">😊 Feeling</div>
          </div>
          <button @click="submitMood" class="fb-post-btn">Post Mood</button>
          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        </div>

        <div class="fb-feed">
          <h3 class="feed-title">Recent Updates</h3>
          <div v-if="moods.length === 0" class="fb-card empty-state">No stories yet. Be the first to post!</div>
          
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
            <div class="feed-footer">
              <div class="footer-btn">👍 Like</div>
              <div class="footer-btn">💬 Comment</div>
              <div class="footer-btn">➡️ Share</div>
            </div>
          </div>
        </div>
      </main>

      <aside class="side-panel right">
        <h4 class="side-title">Contacts</h4>
        <div class="contact-item"><span class="online-dot"></span> AI Assistant</div>
        <div class="contact-item"><span class="online-dot"></span> System Logs</div>
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
        this.errorMessage = "Error submitting mood. Check backend.";
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

/* Nav Bar */
.fb-nav {
  background: white;
  height: 56px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 16px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo { color: #1877f2; font-size: 24px; font-weight: bold; }

.nav-search input {
  background: #f0f2f5;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  width: 200px;
}

/* Three Column Layout */
.fb-main-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  max-width: 1200px;
  margin: 16px auto;
  gap: 32px;
  width: 100%;
}

/* Side Panels */
.side-panel { padding: 10px; }
.side-item, .contact-item {
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
}
.side-item:hover { background: #e4e6eb; }
.online-dot {
  height: 8px; width: 8px; background: #31a24c;
  border-radius: 50%; display: inline-block; margin-right: 8px;
}

/* Feed Cards */
.fb-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  padding: 12px 16px;
}

.post-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
.avatar {
  width: 40px; height: 40px; background: #1877f2;
  color: white; border-radius: 50%; display: flex;
  align-items: center; justify-content: center; font-weight: bold;
}
.input-trigger { color: #65676b; font-size: 17px; }

.fb-input-name, .fb-textarea {
  width: 100%; border: 1px solid #dddfe2;
  border-radius: 8px; padding: 10px; margin-bottom: 8px;
  background: #f0f2f5; box-sizing: border-box;
}

.fb-post-btn {
  width: 100%; background: #1877f2; color: white;
  border: none; border-radius: 6px; padding: 10px;
  font-weight: bold; cursor: pointer; margin-top: 10px;
}

/* Feed Items */
.user-name { font-weight: bold; color: #050505; }
.post-date { font-size: 12px; color: #65676b; }
.mood-highlight { color: #1877f2; font-weight: bold; }

.feed-footer {
  border-top: 1px solid #ebedf0;
  margin-top: 10px; padding-top: 10px;
  display: flex; justify-content: space-around;
}

.footer-btn { color: #65676b; font-weight: 600; cursor: pointer; }

/* Responsive */
@media (max-width: 1000px) {
  .fb-main-layout { grid-template-columns: 1fr; }
  .side-panel { display: none; }
}

.fade-in { animation: fadeIn 0.4s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; } }
</style>