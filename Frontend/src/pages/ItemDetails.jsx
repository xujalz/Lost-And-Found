import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";

const API_BASE = "http://localhost:5000";

const ItemDetails = ({ type: routeType }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const type =
    routeType || (location.pathname.includes("/found/") ? "found" : "lost");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/${type}/${id}`);
        setItem(data);
      } catch {
        alert("Item not found or deleted.");
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

  const [date, time] = (item.dateTime || "").split(" ");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">
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

      <div className="md:w-1/2 p-8">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-3">
          {item.name}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {item.description}
        </p>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
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

        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
        >
          ← Back
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-xs mt-6">
          Uploaded on {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ItemDetails;
