import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // Validate the userId
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    console.error("Invalid userId received:", userId);
    return;
  }

  // Add the userId to the userSocketMap
  userSocketMap[userId] = socket.id;
  console.log(`User ${userId} connected`);

  // Notify all clients about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

// import { Server } from "socket.io";
// import express from "express";
// import http from "http";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true, // Allow credentials
//   },
// });

// const userSocketMap = {}; // Map userId -> socketId

// export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//     console.log(`User ${userId} connected`);
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     if (userId) {
//       delete userSocketMap[userId];
//     }
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { app, server, io };
