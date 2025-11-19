import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Open or fetch existing chat between two users
export const openChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const me = req.user.id;

    if (me === otherUserId) return res.status(400).json({ message: "Cannot chat with yourself." });

    // find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [me, otherUserId] },
    }).populate("participants", "name email");

    if (!chat) {
      chat = await Chat.create({
        participants: [me, otherUserId],
        lastMessage: {},
        unreadCounts: { [me]: 0, [otherUserId]: 0 },
      });
      chat = await Chat.findById(chat._id).populate("participants", "name email");
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all chats for logged user with last message and participant info
export const getChats = async (req, res) => {
  try {
    const me = req.user.id;
    const chats = await Chat.find({ participants: me })
      .sort({ updatedAt: -1 })
      .populate("participants", "name email")
      .lean();

    const result = chats.map((c) => {
      const other = c.participants.find(
        (p) => String(p._id) !== String(me)
      );

      // FIXED unreadCounts handling
      let unread = 0;

      if (c.unreadCounts instanceof Map) {
        unread = c.unreadCounts.get(me) || 0;
      } else if (typeof c.unreadCounts === "object") {
        unread = c.unreadCounts[me] || 0;
      }

      return {
        ...c,
        other,
        unread,
        lastMessage: c.lastMessage || null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// get messages for a chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const me = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!chat.participants.map(String).includes(String(me))) return res.status(403).json({ message: "Not a participant" });

    const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 }).lean();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// mark messages in a chat as read by the requester
export const markRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const me = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!chat.participants.map(String).includes(String(me))) return res.status(403).json({ message: "Not a participant" });

    // update messages where receiver is me and status != read
    await Message.updateMany({ chat: chatId, receiver: me, status: { $ne: "read" } }, { status: "read" });

    // set unread count for me -> 0
    chat.unreadCounts.set(me, 0);
    await chat.save();

    res.json({ message: "Marked read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
