<template>
  <div class="fb-body">
    <div class="fb-container">
      <div class="fb-card post-box">
        <div class="post-header">
          <div class="avatar">JM</div>
          <span class="placeholder-text">What's your mood, {{ name || 'Jerome' }}?</span>
        </div>
        
        <div class="post-inputs">
          <input v-model="name" class="fb-input-name" placeholder="Full Name" />
          <textarea v-model="mood" class="fb-textarea" placeholder="Describe how you feel..."></textarea>
        </div>
        
        <div class="post-actions">
          <button @click="submitMood" class="fb-post-btn">Post Mood</button>
        </div>
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
      </div>

      <div class="fb-feed">
        <h3 class="feed-title">Recent Updates</h3>
        <div v-if="moods.length === 0" class="fb-card empty-state">No posts yet. Share your mood!</div>
        
        <div v-for="m in moods" :key="m.id" class="fb-card feed-item">
          <div class="feed-header">
            <div class="avatar small">{{ m.user_name.charAt(0).toUpperCase() }}</div>
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
.fb-body {
  background-color: #f0f2f5;
  min-height: 100vh;
  padding: 20px;
  font-family: Helvetica, Arial, sans-serif;
}

.fb-container {
  max-width: 500px;
  margin: 0 auto;
}

.fb-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  padding: 12px 16px;
}

/* Post Box */
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #1877f2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar.small {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

.placeholder-text {
  color: #65676b;
  font-size: 17px;
}

.fb-input-name {
  width: 100%;
  border: 1px solid #dddfe2;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.fb-textarea {
  width: 100%;
  border: 1px solid #dddfe2;
  border-radius: 6px;
  padding: 12px;
  font-size: 15px;
  min-height: 80px;
  resize: none;
  box-sizing: border-box;
}

.fb-post-btn {
  width: 100%;
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
}

.fb-post-btn:hover {
  background-color: #166fe5;
}

/* Feed Items */
.feed-title {
  font-size: 18px;
  color: #65676b;
  margin: 20px 0 10px 5px;
}

.feed-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: bold;
  color: #050505;
}

.post-date {
  font-size: 12px;
  color: #65676b;
}

.feed-content {
  margin: 15px 0;
  font-size: 16px;
  color: #050505;
}

.mood-highlight {
  font-weight: bold;
  color: #1877f2;
}

.feed-footer {
  border-top: 1px solid #ebedf0;
  padding-top: 8px;
  display: flex;
  justify-content: space-around;
}

.footer-btn {
  color: #65676b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
}

.footer-btn:hover {
  background-color: #f2f2f2;
}

.error-msg {
  color: #f02849;
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
}
</style>