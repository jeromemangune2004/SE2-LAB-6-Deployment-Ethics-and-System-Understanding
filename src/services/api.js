import axios from "axios";

export default axios.create({
  // Option A: Ito ang pinaka-safe dahil tinanggal natin ang /api na nagko-cause ng 404
  baseURL: "https://lab-5-vue-frontend-ai-ui-integration.onrender.com" 
});