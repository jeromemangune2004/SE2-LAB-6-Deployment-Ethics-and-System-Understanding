import axios from "axios";

export default axios.create({
  // Siguraduhin na may /api sa dulo
  baseURL: "https://lab-5-vue-frontend-ai-ui-integration.onrender.com/api" 
});