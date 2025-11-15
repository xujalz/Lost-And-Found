import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

const ItemDetails = ({ type: routeType }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine type: lost / found
  const type =
    routeType || (location.pathname.includes("/found/") ? "found" : "lost");

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ------------------ LOAD ITEM ------------------ */
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/${type}/${id}`);
        setItem(data);
      } catch {
        alert("Item not found or has been deleted.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, type, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );

  if (!item) return null;

  /* ------------------ FIXED UPLOADER ID ------------------ */
  const uploaderId = item.user?._id || item.user;
  const isUploader = user && String(user._id) === String(uploaderId);

  // Split date and time
  const [date, time] = (item.dateTime || "").split(" ");

  /* ------------------ OPEN CHAT (FIXED) ------------------ */
  const handleMessage = async () => {
    try {
      const { data } = await api.post("/chats/open", {
        otherUserId: uploaderId,
      });

      const chatId = data._id; // correct
      const otherUser = data.participants.find((p) => p._id !== user._id);

      navigate(`/chat/${otherUser._id}?chatId=${chatId}`);
    } catch (err) {
      console.error(err);
      alert("Unable to open chat.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">
      {/* ------------------ IMAGE ------------------ */}
      <div className="md:w-1/2 flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
        {item.imagePath ? (
          <img
            src={
              item.imagePath.startsWith("http")
                ? item.imagePath
                : API_BASE + item.imagePath
            }
            alt={item.name}
            className="max-h-[500px] w-auto object-contain rounded-xl shadow-xl transition-transform hover:scale-105"
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No image</p>
        )}
      </div>

      {/* ------------------ DETAILS ------------------ */}
      <div className="md:w-1/2 p-8 flex flex-col">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-3">
          {item.name}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {item.description}
        </p>

        {/* Victim / Founder */}
        {type === "lost" && item.victimName && (
          <p className="text-sm mb-3 text-blue-500 dark:text-green-300">
            <b>Victim:</b> {item.victimName}
          </p>
        )}
        {type === "found" && item.founderName && (
          <p className="text-sm mb-3 text-blue-500 dark:text-green-300">
            <b>Founder:</b> {item.founderName}
          </p>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
          <p>
            <b>📍 Location:</b> {item.place}
          </p>
          <p>
            <b>📅 Date:</b> {date || "-"}
          </p>
          <p>
            <b>⏰ Time:</b> {time || "-"}
          </p>
          <p>
            <b>📞 Contact:</b> {item.contact}
          </p>

          {item.category && (
            <p>
              <b>🏷 Category:</b> {item.category}
            </p>
          )}
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md w-fit"
        >
          ← Back
        </button>

        {/* MESSAGE BUTTON */}
        {!isUploader && user && (
          <button
            onClick={handleMessage}
            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md w-fit"
          >
            Message
          </button>
        )}

        {/* Timestamp */}
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-6">
          Uploaded on {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ItemDetails;
