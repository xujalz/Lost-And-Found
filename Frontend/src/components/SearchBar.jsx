import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        placeholder="Search by name, place or category"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border p-2 rounded-md"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
