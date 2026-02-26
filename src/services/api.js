import axios from "axios";

export default axios.create({
  // Dapat itong tumuro sa iyong BACKEND service, hindi sa frontend:
  baseURL: "https://se2-lab-6-deployment-ethics-and-system.onrender.com/api" 
});