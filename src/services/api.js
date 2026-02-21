// src/services/api.js
import axios from "axios";

export default axios.create({
  baseURL: "https://backendd-2-4miq.onrender.com" // ← your Render backend URL
});