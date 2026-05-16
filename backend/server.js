import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import newsRoutes from "./routes/news.js";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import { startCronJobs } from "./config/cronJobs.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://logic-loop-ashy.vercel.app",
      /\.vercel\.app$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());

const connectToMongo = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MongoDB skipped: MONGO_URI is missing in backend/.env");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
    startCronJobs();
  } catch (error) {
    console.error(
      "MongoDB connection failed. Check Atlas Network Access, database user/password, and MONGO_URI.",
    );
  }
};

connectToMongo();

app.use("/api/news", newsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("LogicLoop API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
