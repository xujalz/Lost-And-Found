import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

/* Fade-in + Slide Hook */
const useFadeIn = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return [ref, visible];
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const [rootRef, visible] = useFadeIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/users/login", { email, password });
      login(data);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      ref={rootRef}
      className={`
        min-h-[75vh] flex items-center justify-center px-4
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg 
          shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700
          transition-all duration-700
          hover:shadow-2xl
        "
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
          Login
        </h2>

        {err && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm p-2 rounded mb-4 animate-pulse">
            {err}
          </div>
        )}

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          className="
            w-full border p-3 rounded-lg bg-white dark:bg-gray-800 
            dark:border-gray-700 text-gray-900 dark:text-gray-200 mb-4
          "
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          className="
            w-full border p-3 rounded-lg bg-white dark:bg-gray-800 
            dark:border-gray-700 text-gray-900 dark:text-gray-200 mb-6
          "
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="
            w-full bg-blue-600 text-white py-3 rounded-lg font-medium 
            hover:bg-blue-700 transition shadow-md hover:shadow-lg
          "
        >
          Login
        </button>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          New here?{" "}
          <a
            className="text-blue-600 dark:text-blue-400 hover:underline"
            href="/register"
          >
            Create account
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
