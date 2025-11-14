// Frontend/src/components/MessageBubble.jsx
import React from "react";

const Tick = ({ delivered, read }) => {
  if (!delivered) return <span className="text-xs">✓</span>;
  if (delivered && !read) return <span className="text-xs">✓✓</span>;
  if (read) return <span className="text-xs text-blue-400">✓✓</span>;
  return null;
};

const MessageBubble = ({ m, isMe, onReact }) => {
  return (
    <div
      className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${
        isMe
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-700 text-gray-900"
      }`}
    >
      <div className="text-sm">{m.text}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-[10px] text-gray-700 dark:text-gray-300">
          {new Date(m.createdAt).toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
          {isMe && <Tick delivered={m.delivered} read={m.read} />}
          {/* reactions */}
          <div className="flex gap-1">
            {m.reactions?.slice(0, 4).map((r, idx) => (
              <div key={idx} className="text-xs px-1 rounded">
                {r.reaction}
              </div>
            ))}
            <button
              onClick={() => onReact(m._id)}
              className="text-xs hover:opacity-80"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
