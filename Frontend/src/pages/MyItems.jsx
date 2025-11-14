import React, { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";

/* Fade + Slide Animation Hook */
const useFadeIn = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return [ref, visible];
};

const MyItems = () => {
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const navigate = useNavigate();

  const [rootRef, visible] = useFadeIn();

  const fetchMyItems = async () => {
    try {
      const [lostRes, foundRes] = await Promise.all([
        api.get("/lost/mine"),
        api.get("/found/mine"),
      ]);
      setLost(lostRes.data);
      setFound(foundRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to load items");
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleEdit = (type, id) => navigate(`/edit/${type}/${id}`);

  const handleDelete = async (type, id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/${type}/${id}`);
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      ref={rootRef}
      className={`
        min-h-screen           /* FULL SCREEN HEIGHT */
        pt-20 pb-20            /* LARGE TOP/BOTTOM SPACE */
        max-w-7xl mx-auto      /* WIDE CONTENT */
        px-4 transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-10 text-center">
        My Uploaded Items
      </h1>

      {/* LOST ITEMS */}
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-300">
        Lost Items
      </h2>

      {lost.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          No lost items uploaded.
        </p>
      ) : (
        <div
          className={`
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16
            transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {lost.map((it, i) => (
            <div
              key={it._id}
              className={`
                transition-all duration-700 delay-${i * 70}
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              <ItemCard
                item={it}
                type="lost"
                showEdit
                onEdit={handleEdit}
                showDelete
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* FOUND ITEMS */}
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-300">
        Found Items
      </h2>

      {found.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No found items uploaded.
        </p>
      ) : (
        <div
          className={`
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8
            transition-all duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {found.map((it, i) => (
            <div
              key={it._id}
              className={`
                transition-all duration-700 delay-${i * 70}
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              <ItemCard
                item={it}
                type="found"
                showEdit
                onEdit={handleEdit}
                showDelete
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
