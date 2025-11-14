import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import UploadForm from "../components/UploadForm";

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

const UploadItem = () => {
  const [type, setType] = useState("lost");
  const navigate = useNavigate();

  const [cardRef, visible] = useFadeIn();

  const handleSubmit = async (t, data) => {
    try {
      await api.post(`/${t}`, data);
      alert(`${t.toUpperCase()} item uploaded successfully`);
      navigate(`/${t}`);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        max-w-xl mx-auto mt-10 mb-12 
        bg-white/60 dark:bg-gray-800/60 backdrop-blur-md 
        p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
        transition-all duration-700
        ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }
      `}
    >
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
        Upload Lost / Found Item
      </h2>

      <UploadForm onSubmit={handleSubmit} type={type} setType={setType} />
    </div>
  );
};

export default UploadItem;
