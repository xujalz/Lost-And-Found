import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../lib/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef(null);

  const [unreadTotal, setUnreadTotal] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeChatId, setActiveChatId] = useState(null); // ⭐ track opened chat

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setUnreadTotal(0);
      return;
    }

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // authenticate
    socket.on("connect", () => {
      socket.emit("authenticate", { token: localStorage.getItem("token") });
    });

    /* -------------------------------------------
            NEW MESSAGE HANDLING
       ------------------------------------------- */
    socket.on("newMessage", (msg) => {
      // If message belongs to the currently open chat → do NOT add to unread
      if (String(msg.chat) === String(activeChatId)) return;

      // Otherwise increase global unread
      setUnreadTotal((u) => u + 1);
    });

    /* -------------------------------------------
            MESSAGES READ (reset unread)
       ------------------------------------------- */
    socket.on("messagesRead", () => {
      // recalc unread from server
      api.get("/chats").then((res) => {
        const total = res.data.reduce((s, c) => s + (c.unread || 0), 0);
        setUnreadTotal(total);
      });
    });

    /* -------------------------------------------
            USER ONLINE STATUS
       ------------------------------------------- */
    socket.on("user-online", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on("user-offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
    });

    /* -------------------------------------------
            INITIAL UNREAD FETCH
       ------------------------------------------- */
    (async () => {
      try {
        const res = await api.get("/chats");
        const total = res.data.reduce((acc, c) => acc + (c.unread || 0), 0);
        setUnreadTotal(total);
      } catch (err) {
        console.error("Unread fetch failed", err);
      }
    })();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, activeChatId]);

  return (
    <ChatContext.Provider
      value={{
        socketRef,
        unreadTotal,
        setUnreadTotal,
        onlineUsers,
        activeChatId,
        setActiveChatId, // ⭐ exported to ChatWindow
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
