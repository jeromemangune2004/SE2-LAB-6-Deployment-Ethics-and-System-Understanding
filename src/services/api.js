import axios from "axios";

export default axios.create({
  // Dinagdagan natin ng /api sa dulo para mag-match sa server.js routes
  baseURL: "https://lab-5-vue-frontend-ai-ui-integration.onrender.com/api" 
});