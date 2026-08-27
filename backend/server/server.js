import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import executeRoute from "../execute.js";
import authRoutes from "./routes/authRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import battleSocket from "../socket/battleSocket.js";
import { seedProblems } from "./utils/seedProblems.js";

dotenv.config();

// Connect DB and seed sample problems if empty
connectDB().then(() => {
  seedProblems();
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/execute", executeRoute);
app.use("/api/auth", authRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/problem", problemRoutes);
app.use("/api/submission", submissionRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

battleSocket(io);

const rooms = {};

const removeUserFromRoom = (socket) => {
  const roomId = socket.roomId;
  const userId = socket.userId;

  if (!roomId || !rooms[roomId]) {
    return;
  }

  rooms[roomId].members = rooms[roomId].members.filter(
    (member) => member.userId !== userId
  );

  io.to(roomId).emit("room-members", rooms[roomId].members);

  if (rooms[roomId].members.length === 0) {
    delete rooms[roomId];
  }

  socket.roomId = null;
  socket.userId = null;
  socket.username = null;
};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userId, username }) => {
    if (!roomId || !userId || !username) return;

    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: "",
        language: "javascript",
        ownerId: userId,
        members: [],
      };
    }

    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.username = username;

    const existingMemberIndex = rooms[roomId].members.findIndex(
      (member) => member.userId === userId
    );

    if (existingMemberIndex !== -1) {
      rooms[roomId].members[existingMemberIndex].socketId = socket.id;
    } else {
      rooms[roomId].members.push({
        userId,
        username,
        socketId: socket.id,
        joinedAt: new Date(),
      });
    }

    socket.emit("room-state", {
      code: rooms[roomId].code,
      language: rooms[roomId].language,
      ownerId: rooms[roomId].ownerId,
    });

    io.to(roomId).emit("room-members", rooms[roomId].members);
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].code = code;
    socket.to(roomId).emit("receive-code", code);
  });

  socket.on("language-change", ({ roomId, language }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].language = language;
    socket.to(roomId).emit("receive-language", language);
  });

  socket.on("leave-room", () => {
    const roomId = socket.roomId;
    if (!roomId) return;
    removeUserFromRoom(socket);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    removeUserFromRoom(socket);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});