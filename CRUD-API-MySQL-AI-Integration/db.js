import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306 
});

// Ito ang importante! Siguraduhing nandoon ito:
<<<<<<< HEAD
export default db;
=======
export default db;
>>>>>>> a70a313 (Activity)
