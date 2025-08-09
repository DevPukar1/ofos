import { httpServer } from "./app.js";
import connectDB from "./config/db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const startServer = () => {
  httpServer.listen(process.env.PORT, () => {
    console.log("Server is running on port: ", process.env.PORT);
  });
};

// connect to the database then starting the server
connectDB()
  .then((db) => {
    console.log("Database connected successfully");
    db.release();
  })
  .then(() => {
    startServer();
  })
  .catch((err) => console.log("Error connecting to database:", err.message));
