import React, { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const API_BASE = "http://localhost:5000";

const ChatWindow = () => {
  const { user } = useAuth();
  const { socketRef, setUnreadTotal, onlineUsers, setActiveChatId } = useChat();
  const { otherId } = useParams();

  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [text, setText] = useState("");

  const listRef = useRef(null);

  /* ---------------------------------------------
        1. OPEN CHAT + FETCH MESSAGES
  --------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/chats/open", {
          otherUserId: otherId,
        });

        setChatId(data._id);

        const msgRes = await api.get(`/chats/${data._id}/messages`);
        setMessages(msgRes.data);

        // BACKEND RESET unread
        await api.put(`/chats/${data._id}/read`);

        // SOCKET RESET unread
        socketRef.current?.emit("markRead", { chatId: data._id });

        // CONTEXT RESET unread
        setUnreadTotal((prev) => {
          const fixed = prev > 0 ? prev - (data.unread || 0) : 0;
          return fixed < 0 ? 0 : fixed;
        });
      } catch (err) {
        console.error("Error opening chat:", err);
      }
    })();
  }, [otherId]);

  /* ---------------------------------------------
        2. SET ACTIVE CHAT (Navbar listens to this)
  --------------------------------------------- */
  useEffect(() => {
    if (chatId) {
      setActiveChatId(chatId);
      socketRef.current?.emit("markRead", { chatId });
    }
  }, [chatId]);

  /* ---------------------------------------------
        3. FETCH OTHER USER INFO
  --------------------------------------------- */
  useEffect(() => {
    if (!chatId) return;

    (async () => {
      try {
        const res = await api.get("/chats");
        const chat = res.data.find((c) => String(c._id) === String(chatId));
        if (chat) setOtherUser(chat.other);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [chatId]);

  /* ---------------------------------------------
        4. SOCKET MESSAGE HANDLING
  --------------------------------------------- */
  useEffect(() => {
    if (!socketRef.current || !chatId) return;

    const socket = socketRef.current;

    const onNewMessage = (msg) => {
      if (String(msg.chat) === String(chatId)) {
        setMessages((prev) => [...prev, msg]);

        socket.emit("messageReceived", { messageId: msg._id });
        socket.emit("markRead", { chatId });
        api.put(`/chats/${chatId}/read`).catch(() => {});

        // Reset unread in context
        setUnreadTotal((u) => (u > 0 ? u - 1 : 0));
      } else {
        setUnreadTotal((u) => u + 1);
      }
    };

    const onStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(messageId) ? { ...m, status } : m
        )
      );
    };

    const onRead = ({ chatId: cId }) => {
      if (String(cId) !== String(chatId)) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.receiver === user._id ? { ...m, status: "read" } : m
        )
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messageStatus", onStatus);
    socket.on("messagesRead", onRead);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messageStatus", onStatus);
      socket.off("messagesRead", onRead);
    };
  }, [chatId]);

  /* ---------------------------------------------
        5. AUTO SCROLL
  --------------------------------------------- */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight + 200,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------------------------------------------
        6. SEND MESSAGE
  --------------------------------------------- */
  const sendText = () => {
    if (!text.trim() || !chatId) return;

    const socket = socketRef.current;

    const temp = {
      _id: "temp-" + Date.now(),
      chat: chatId,
      sender: user._id,
      receiver: otherId,
      content: text,
      type: "text",
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, temp]);

    const payload = {
      chatId,
      to: otherId,
      content: text,
      type: "text",
    };

    setText("");

    socket.emit("sendMessage", payload, (ack) => {
      if (ack?.ok && ack.message) {
        setMessages((prev) =>
          prev.map((m) => (m._id === temp._id ? ack.message : m))
        );
      } else {
        alert("Message send failed");
      }
    });
  };

  const online = onlineUsers.has(String(otherId));

  /* ---------------------------------------------
        UI
  --------------------------------------------- */
  return (
    <div className="min-h-screen pt-6 pb-6 max-w-4xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b pb-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center text-blue-700 dark:text-white font-semibold">
            {otherUser ? otherUser.name[0] : "U"}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {otherUser?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {online ? (
                <span className="text-green-400">● online</span>
              ) : (
                "offline"
              )}
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-3 space-y-3"
        >
          {messages.map((m) => {
            const mine = String(m.sender) === String(user._id);

            return (
              <div
                key={m._id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${
                    mine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  } rounded-lg p-3 max-w-[70%]`}
                >
                  <div>{m.content}</div>

                  <div className="text-xs flex items-center gap-2 justify-end opacity-70 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    {mine && (
                      <>
                        {m.status === "sent" && "✓"}
                        {m.status === "delivered" && "✓✓"}
                        {m.status === "read" && (
                          <span className="text-blue-400">✓✓</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-3 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />

          <button
            onClick={sendText}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
