import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// send message via REST (usually socket will be used, but fallback)
export const sendMessageRest = async (req, res) => {
  try {
    const { chatId } = req.params;
    const me = req.user.id;
    const { content, type = "text", fileUrl = "" } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const other = chat.participants.find((p) => String(p) !== String(me));
    if (!other) return res.status(400).json({ message: "Invalid chat participants" });

    const msg = await Message.create({
      chat: chatId,
      sender: me,
      receiver: other,
      content,
      type,
      fileUrl,
      status: "sent",
    });

    // update chat lastMessage and increase unread for receiver
    chat.lastMessage = {
      text: content,
      sender: me,
      createdAt: msg.createdAt,
      type,
      fileUrl,
    };
    const prev = chat.unreadCounts.get(String(other)) || 0;
    chat.unreadCounts.set(String(other), prev + 1);
    await chat.save();

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// upload file endpoint (multer middleware used on route)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });
    const filePath = "/uploads/" + req.file.filename;
    res.json({ fileUrl: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};
