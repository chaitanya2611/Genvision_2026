import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build




import eventRoutes from "./routes/events.js";
import participantRoutes from "./routes/participants.js";
import guestRoutes from "./routes/guests.js";
import coordinatorRoutes from "./routes/coordinators.js";
import adminRoutes from "./routes/admin.js";
import aboutRouter from "./routes/about.js";

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "../Frontend/build")));
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/coordinators", coordinatorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/about", aboutRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

  const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/build", "index.html"));
});