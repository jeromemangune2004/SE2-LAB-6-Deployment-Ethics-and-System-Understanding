import axios from "axios";

export default axios.create({
  // Siguraduhin na ito ang Render URL mo (yung backend)
  baseURL: "https://se2-lab-6-deployment-ethics-and-system-understanding.onrender.com"
});