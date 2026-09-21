import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "node:process";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(
    new URL("../.env", import.meta.url)
  )
});

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing environment variable: ${envVar}`
    );
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;