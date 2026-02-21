// src/services/api.js
import axios from "axios";

export default axios.create({
  // Eto dapat ang gamitin mong URL dahil ito ang "Connected" sa database
  baseURL: "https://lab-5-vue-frontend-ai-ui-integration.onrender.com" 
});