import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// global middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(morgan("dev"));

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { dirname } from "path";

app.get("/api/v1/test", (req, res) => {
  return res.send("hello server");
});

// user routes
app.use("/api/v1/users", userRoutes);

// admin routes
app.use("/api/v1/admin", adminRoutes);

// custom error handler middleware
app.use(errorHandler);

export { httpServer };
