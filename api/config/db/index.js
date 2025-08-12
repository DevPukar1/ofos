import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_DB_PORT,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connetionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    // creating a connection with the pool
    const db = await pool.getConnection();
    return db;
  } catch (error) {
    console.log("Error connecting to database:", error.message);
    throw error;
  }
};

export default connectDB;
