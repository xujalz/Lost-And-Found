import express from "express";
import { openChat, getChats, getMessages, markRead } from "../controllers/chatController.js";
import { sendMessageRest, uploadFile } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/open", protect, openChat);
router.get("/", protect, getChats);
router.get("/:chatId/messages", protect, getMessages);
router.put("/:chatId/read", protect, markRead);

// messages (REST fallback)
router.post("/:chatId/messages", protect, sendMessageRest);
router.post("/upload", protect, upload.single("file"), uploadFile);

export default router;
