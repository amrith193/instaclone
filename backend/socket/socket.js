import { Server } from "socket.io";
import express from "express";
import http from "http";
import mongoose from "mongoose"; 
import { Message } from "../models/message.model.js"; 

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
  const userId = socket.handshake.query?.userId;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    console.error("❌ Invalid userId received:", userId);
    return;
  }

  // ✅ Store userId with socketId
  userSocketMap[userId] = socket.id;
  console.log(`✅ User ${userId} connected`);

  // Notify all users about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Handle sending messages (Fix broadcast issue)
  socket.on("sendMessage", async (message) => {
    try {
      console.log(`📩 Message from ${message.senderId} to ${message.receiverId}:`, message);

      // ✅ Save message to MongoDB
      const newMessage = new Message(message);
      await newMessage.save();

      const receiverSocketId = userSocketMap[message.receiverId]; 

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message); // ✅ Send ONLY to receiver
      }

      // ✅ Also send message back to sender for instant UI update
      io.to(socket.id).emit("newMessage", message);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  });

  // ✅ Mark messages as read (Fix filtering issue)
  socket.on("markMessagesAsRead", async ({ senderId }) => {
    if (!senderId || typeof senderId !== "string") {
      console.error("❌ Invalid senderId:", senderId);
      return;
    }

    try {
      console.log(`✅ Marking messages as read for user ${userId} (from sender ${senderId})`);

      await Message.updateMany(
        { senderId, receiverId: userId, isRead: false }, 
        { $set: { isRead: true } }
      );

      const receiverSocketId = userSocketMap[userId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("resetUnreadCount"); 
      } else {
        console.warn(`⚠️ No active socket found for user ${userId}`);
      }
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  });

  // ✅ Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User ${userId} disconnected`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
