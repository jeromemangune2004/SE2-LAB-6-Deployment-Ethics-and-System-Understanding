import axios from "axios";

export default axios.create({
  // Dinagdagan natin ng folder name bago ang /api
  baseURL: "https://lab-5-vue-frontend-ai-ui-integration.onrender.com/CRUD-API-MySQL-AI-Integration/api" 
});