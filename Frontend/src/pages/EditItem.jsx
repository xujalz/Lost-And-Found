import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

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

const EditItem = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    place: "",
    date: "",
    time: "",
    contact: "",
    category: "",
    otherCategory: "",
    image: null,
  });

  // Fetch existing item
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/${type}/${id}`);

        const [date, time] = (data.dateTime || "").split(" ");

        setForm({
          name: data.name,
          description: data.description,
          place: data.place,
          date: date || "",
          time: time || "",
          contact: data.contact,
          category: data.category,
          otherCategory: "",
          image: null,
        });

        const imgUrl = data.imagePath.startsWith("http")
          ? data.imagePath
          : API_BASE + data.imagePath;

        setImagePreview(imgUrl);
      } catch (err) {
        alert("Item not found");
        navigate("/myitems");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, type]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit updated item
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalCategory =
        form.category === "Other" ? form.otherCategory : form.category;

      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("place", form.place);
      data.append("dateTime", `${form.date} ${form.time}`);
      data.append("contact", form.contact);
      data.append("category", finalCategory);

      if (form.image) data.append("image", form.image);

      await api.put(`/${type}/${id}`, data);

      alert("Item updated successfully");
      navigate("/myitems");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mt-8">
      <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
        Edit {type === "lost" ? "Lost" : "Found"} Item
      </h1>

      {/* Image Preview */}
      <div className="mb-4">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded border dark:border-gray-700"
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-300 italic text-center py-10">
            No Image
          </div>
        )}

        <label className="block mt-3 text-gray-700 dark:text-gray-300">
          <span className="font-medium">Update Image (optional)</span>
          <input
            type="file"
            className="mt-2 block w-full text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setForm({ ...form, image: file });
              if (file) setImagePreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Name */}
        <label className="text-gray-700 dark:text-gray-300">
          Item Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
            required
          />
        </label>

        {/* Description */}
        <label className="text-gray-700 dark:text-gray-300">
          Description
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
          />
        </label>

        {/* Place */}
        <label className="text-gray-700 dark:text-gray-300">
          Place
          <input
            type="text"
            name="place"
            value={form.place}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
            required
          />
        </label>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-gray-700 dark:text-gray-300">
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
              required
            />
          </label>

          <label className="text-gray-700 dark:text-gray-300">
            Time
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
              required
            />
          </label>
        </div>

        {/* Contact */}
        <label className="text-gray-700 dark:text-gray-300">
          Contact
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
            required
          />
        </label>

        {/* Category */}
        <label className="text-gray-700 dark:text-gray-300">
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        {/* Other Category Field */}
        {form.category === "Other" && (
          <label className="text-gray-700 dark:text-gray-300">
            Enter Custom Category
            <input
              type="text"
              name="otherCategory"
              value={form.otherCategory}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200"
            />
          </label>
        )}

        {/* Save */}
        <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditItem;
