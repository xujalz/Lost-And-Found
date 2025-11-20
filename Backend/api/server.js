import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import serverless from "serverless-http";

import connectDB from "../config/db.js";

import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// ROUTES
import chatRoutes from "../routes/chatRoutes.js";
import lostRoutes from "../routes/lostRoutes.js";
import foundRoutes from "../routes/foundRoutes.js";
import userRoutes from "../routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ONLINE USERS
const onlineMap = new Map();

// SOCKET.IO LOGIC
io.on("connection", (socket) => {
  console.log("⚡ User connected", socket.id);

  // AUTH
  socket.on("authenticate", ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      socket.userId = userId;

      let sockets = onlineMap.get(userId) || new Set();
      sockets.add(socket.id);
      onlineMap.set(userId, sockets);

      io.emit("user-online", { userId });
      socket.join(userId);

      console.log("Authenticated:", userId);
    } catch (err) {
      console.log("Socket Auth Error:", err.message);
    }
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (payload, ack) => {
    try {
      const { chatId, to, content, type = "text", fileUrl = "" } = payload;
      const from = socket.userId;

      if (!from) return ack({ error: "Unauthenticated" });

      const msg = await Message.create({
        chat: chatId,
        sender: from,
        receiver: to,
        content,
        type,
        fileUrl,
        status: "sent",
      });

      // update chat
      const chat = await Chat.findById(chatId);
      const prev = chat.unreadCounts.get(to) || 0;
      chat.unreadCounts.set(to, prev + 1);
      chat.lastMessage = {
        text: content,
        sender: from,
        createdAt: msg.createdAt,
        type,
        fileUrl,
      };
      await chat.save();

      ack({ ok: true, message: msg });

      io.to(String(to)).emit("newMessage", { ...msg.toObject(), chatId });

      // delivered
      if (onlineMap.has(String(to))) {
        msg.status = "delivered";
        await msg.save();

        io.to(socket.id).emit("messageStatus", {
          messageId: msg._id,
          status: "delivered",
        });
      }
    } catch (err) {
      console.log("sendMessage error", err);
      ack({ error: "Server error" });
    }
  });

  // RECEIVED
  socket.on("messageReceived", async ({ messageId }) => {
    const msg = await Message.findById(messageId);
    if (!msg) return;

    msg.status = "delivered";
    await msg.save();

    const senderSockets = onlineMap.get(String(msg.sender));
    senderSockets?.forEach((sid) =>
      io.to(sid).emit("messageStatus", { messageId, status: "delivered" })
    );
  });

  // MARK READ
  socket.on("markRead", async ({ chatId }) => {
    const me = socket.userId;

    await Message.updateMany(
      { chat: chatId, receiver: me, status: { $ne: "read" } },
      { status: "read" }
    );

    const chat = await Chat.findById(chatId);
    chat.unreadCounts.set(me, 0);
    await chat.save();

    chat.participants.forEach((p) => {
      if (String(p) !== String(me)) {
        io.to(String(p)).emit("messagesRead", { chatId, by: me });
      }
    });
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const userId = socket.userId;
    if (!userId) return;

    const set = onlineMap.get(userId);
    set?.delete(socket.id);

    if (set?.size === 0) {
      onlineMap.delete(userId);
      io.emit("user-offline", { userId });
    } else {
      onlineMap.set(userId, set);
    }

    console.log("❌ Disconnected:", socket.id);
  });
});

// ROUTES
app.use("/api/lost", lostRoutes);
app.use("/api/found", foundRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// START SERVER
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );

module.exports = app;
module.exports.handler = serverless(app);