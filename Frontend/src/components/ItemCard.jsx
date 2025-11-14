import React from "react";
import { Link } from "react-router-dom";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const API_BASE = "http://localhost:5000";

const ItemCard = ({ item, type, showDelete, showEdit, onDelete, onEdit }) => {
  if (!item) return null;

  return (
    <div
      className="rounded-2xl bg-white/70 dark:bg-gray-800/60 backdrop-blur-md
                    shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]
                    overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {item.imagePath && (
        <img
          src={
            item.imagePath.startsWith("http")
              ? item.imagePath
              : API_BASE + item.imagePath
          }
          alt={item.name}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4">
        <Link to={`/${type}/${item._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
            {item.name}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {item.description}
        </p>

        <p className="text-gray-700 dark:text-gray-200 text-sm mt-1">
          📍 <b>{item.place}</b>
        </p>
        <p className="text-gray-700 dark:text-gray-200 text-sm">
          📞 {item.contact}
        </p>

        <div className="flex gap-2 mt-3">
          {showEdit && (
            <button
              onClick={() => onEdit(type, item._id)}
              className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
            >
              <PencilSquareIcon className="h-4 w-4" /> Edit
            </button>
          )}

          {showDelete && (
            <button
              onClick={() => onDelete(type, item._id)}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
            >
              <TrashIcon className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
