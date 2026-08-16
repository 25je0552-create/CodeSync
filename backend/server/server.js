import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import session from "express-session";
import passport from "./config/passport.js";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import executeRoute from "../execute.js";
import authRoutes from "./routes/authRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import battleSocket from "../socket/battleSocket.js";

dotenv.config();
// console.log("SERVER CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("SERVER SECRET:", process.env.GOOGLE_CLIENT_SECRET);

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/execute", executeRoute);
app.use("/api/auth", authRoutes);
app.use(
  "/api/battle",
  battleRoutes
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
battleSocket(io);

/*
rooms = {
  abc123: {
    code: "",
    language: "javascript",
    ownerId: "mongo-user-id",

    members: [
      {
        userId: "mongo-user-id",
        username: "Akshat",
        socketId: "socket-id",
        joinedAt: Date
      }
    ]
  }
}
*/

const rooms = {};

// ==========================================
// REMOVE USER FROM ROOM
// ==========================================

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

  console.log(`${socket.username} removed from room ${roomId}`);

  if (rooms[roomId].members.length === 0) {
    delete rooms[roomId];
    console.log(`Room ${roomId} deleted`);
  }

  socket.roomId = null;
  socket.userId = null;
  socket.username = null;
};

// ==========================================
// SOCKET CONNECTION
// ==========================================

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

socket.onAny((event, ...args) => {
    console.log("EVENT:", event);
    console.log(args);
});
  console.log("User Connected:", socket.id);

  // ========================================
  // JOIN ROOM
  // ========================================

  socket.on("join-room", ({ roomId, userId, username }) => {
    console.log("JOIN REQUEST");
console.log({ roomId, userId, username });
    if (!roomId || !userId || !username) {
      console.log("Invalid join-room data");
      return;
    }

    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: "",
        language: "javascript",
        ownerId: userId,
        members: [],
      };

      console.log(`Room ${roomId} created`);
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

      console.log(`${username} reconnected to room ${roomId}`);
    } else {
      rooms[roomId].members.push({
        userId,
        username,
        socketId: socket.id,
        joinedAt: new Date(),
      });

      console.log(`${username} joined room ${roomId}`);
    }

    // Send room state to newly joined user
    socket.emit("room-state", {
      code: rooms[roomId].code,
      language: rooms[roomId].language,
      ownerId: rooms[roomId].ownerId,
    });

    // Send member list to everyone
    io.to(roomId).emit("room-members", rooms[roomId].members);
  });

  // ========================================
  // CODE CHANGE
  // ========================================

  socket.on("code-change", ({ roomId, code }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].code = code;

    socket.to(roomId).emit("receive-code", code);
  });

  // ========================================
  // LANGUAGE CHANGE
  // ========================================

  socket.on("language-change", ({ roomId, language }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].language = language;

    // Send to everyone except sender
    socket.to(roomId).emit("receive-language", language);

    console.log(
      `Language changed to ${language} in room ${roomId}`
    );
  });

  // ========================================
  // LEAVE ROOM
  // ========================================

  socket.on("leave-room", () => {
    const roomId = socket.roomId;

    if (!roomId) return;

    removeUserFromRoom(socket);

    socket.leave(roomId);
  });

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    removeUserFromRoom(socket);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});