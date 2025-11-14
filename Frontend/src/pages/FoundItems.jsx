import React, { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import ItemCard from "../components/ItemCard";

// Hook: smooth animation on load
const useFadeIn = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return [ref, visible];
};

const FoundItems = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  // page animation hook
  const [rootRef, visible] = useFadeIn();

  const fetchFoundItems = async () => {
    try {
      const { data } = await api.get(
        search ? `/found?search=${search}` : "/found"
      );
      setItems(data);
    } catch (err) {
      console.error("Error fetching found items:", err);
      alert("Failed to load found items");
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoundItems();
  };

  return (
    <div
      ref={rootRef}
      className={`
        min-h-screen               /* FULL SCREEN HEIGHT */
        pt-20 pb-20                /* TOP + BOTTOM BIG SPACE */
        max-w-7xl mx-auto          /* WIDER SCREEN */
        px-4 transition-all duration-700 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-10 text-center">
        Found Items
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-14 justify-center"
      >
        <input
          type="text"
          placeholder="Search found items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
            focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-lg"
        />
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md text-lg"
        >
          Search
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
          No found items yet.
        </p>
      ) : (
        <div
          className={`
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8
            transition-all duration-700 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {items.map((it, i) => (
            <div
              key={it._id}
              className={`
                transition-all duration-700 delay-${i * 75}
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
              `}
            >
              <ItemCard item={it} type="found" showDelete={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoundItems;
