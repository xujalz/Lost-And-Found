import React, { useState } from "react";

const UploadForm = ({ onSubmit, type, setType }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    place: "",
    date: "",
    time: "",
    contact: "",
    category: "",
    otherCategory: "",
  });

  const [image, setImage] = useState(null);

  const categories = [
    "Electronics",
    "Books",
    "Keys",
    "Bottle",
    "Clothing",
    "Documents",
    "Wallet",
    "Accessories",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const dateTime = `${form.date} ${form.time}`;
    const finalCategory =
      form.category === "Other" ? form.otherCategory : form.category;

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("place", form.place);
    data.append("dateTime", dateTime);
    data.append("contact", form.contact);
    data.append("category", finalCategory);
    if (image) data.append("image", image);

    onSubmit(type, data);
  };

  const setVal = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl 
                 border border-gray-200 dark:border-gray-700 
                 p-6 rounded-xl shadow-lg"
    >
      {/* Type */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
      </div>

      {/* Item Name */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Item Name
        </label>
        <input
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          value={form.name}
          onChange={setVal("name")}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          rows="3"
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          value={form.description}
          onChange={setVal("description")}
        ></textarea>
      </div>

      {/* Place */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Place
        </label>
        <input
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          value={form.place}
          onChange={setVal("place")}
          required
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            className="w-full border p-2 rounded 
                       bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-gray-200"
            value={form.date}
            onChange={setVal("date")}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Time
          </label>
          <input
            type="time"
            className="w-full border p-2 rounded 
                       bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-gray-200"
            value={form.time}
            onChange={setVal("time")}
            required
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Contact Number
        </label>
        <input
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          value={form.contact}
          onChange={setVal("contact")}
          pattern="[0-9]{10}"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          value={form.category}
          onChange={setVal("category")}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {form.category === "Other" && (
          <input
            placeholder="Enter custom category"
            className="mt-2 w-full border p-2 rounded 
                       bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-gray-200"
            value={form.otherCategory}
            onChange={setVal("otherCategory")}
            required
          />
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-700 
                     text-gray-900 dark:text-gray-200"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
      </div>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg 
                         hover:bg-blue-700 transition font-medium"
      >
        Upload Item
      </button>
    </form>
  );
};

export default UploadForm;
