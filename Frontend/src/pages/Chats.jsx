import React, { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

/* Smooth Fade + Slide Animation Hook */
const useFadeIn = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return [ref, visible];
};

const Chats = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  // animation root
  const [rootRef, visible] = useFadeIn();

  const fetchChats = async () => {
    try {
      const { data } = await api.get("/chats");
      setChats(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load chats");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`min-h-screen pt-8 pb-20 max-w-6xl mx-auto px-4 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">
        Chats
      </h1>

      {chats.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No chats yet. Start a conversation from an item.
        </p>
      ) : (
        <div className="space-y-3">
          {chats.map((c, i) => (
            <div
              key={c._id}
              onClick={() => navigate(`/chat/${c.other?._id}`)}
              className={`
                flex items-center justify-between gap-4 p-4 rounded-xl 
                bg-white dark:bg-gray-800 shadow hover:shadow-md cursor-pointer
                transition-all duration-700
                ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }
                delay-${i * 75}
              `}
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center text-blue-700 dark:text-white font-semibold">
                  {c.other?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </div>

                {/* Chat preview */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {c.other?.name || "Unknown User"}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {c.lastMessage?.createdAt
                        ? new Date(c.lastMessage.createdAt).toLocaleString()
                        : ""}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xl">
                    {c.lastMessage?.type === "file"
                      ? "📎 File"
                      : c.lastMessage?.text || "No messages yet"}
                  </div>
                </div>
              </div>

              {/* Unread count */}
              <div className="flex flex-col items-end gap-2">
                {c.unread > 0 && (
                  <span className="bg-red-600 text-white px-2 py-0.5 text-xs rounded-full">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;
