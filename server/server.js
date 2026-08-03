require("dotenv").config();
const mongoose = require("mongoose"); const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const roomRoutes = require("./routes/roomRoutes");
const registerSocketHandlers = require("./sockets");

const questionRoutes = require("./routes/questionRoutes");
const executionRoutes = require("./routes/executionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/execute", executionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interviews", interviewRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  registerSocketHandlers(io, socket);
});

const PORT = 4000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
server.listen(PORT, () => console.log(`InterviewForge server on :${PORT}`));