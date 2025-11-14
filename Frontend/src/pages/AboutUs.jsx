import React, { useRef, useEffect, useState } from "react";

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

const AboutUs = () => {
  const [rootRef, visible] = useFadeIn();

  return (
    <div
      ref={rootRef}
      className={`
        max-w-5xl mx-auto mt-12 mb-12 p-6 transition-all duration-700 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      {/* Main Card */}
      <div
        className={` 
          bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-xl 
          rounded-2xl p-8 border border-gray-200 dark:border-gray-700 
          transition-all duration-700 
          ${visible ? "scale-100" : "scale-95"}
        `}
      >
        <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center">
          About This Project
        </h1>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg">
          The Lost & Found Portal is a MERN-based application designed to help
          users report, search, and recover lost or found items with ease. It
          simplifies the process of posting missing belongings and provides a
          platform to help rightful owners reconnect with their items.
        </p>

        {/* Features Section */}
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Key Features
        </h2>

        <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 mb-8 space-y-1">
          <li>Secure user authentication (Signup & Login)</li>
          <li>Post lost and found items with image upload</li>
          <li>Advanced search for quicker item discovery</li>
          <li>“My Items” dashboard for update or deletion</li>
          <li>Responsive UI with full dark mode support</li>
        </ul>

        {/* Technologies */}
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
          Technologies Used
        </h2>

        <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 mb-8 space-y-1">
          <li>
            <b>Frontend:</b> React.js (Vite) + Tailwind CSS
          </li>
          <li>
            <b>Backend:</b> Node.js + Express.js
          </li>
          <li>
            <b>Database:</b> MongoDB (Mongoose)
          </li>
          <li>
            <b>Authentication:</b> JWT
          </li>
        </ul>

        {/* Developer Section */}
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Developer Information
        </h2>

        <div
          className={`
            bg-blue-50 dark:bg-gray-800 p-5 rounded-xl 
            border border-blue-200 dark:border-gray-600 shadow 
            transition-all duration-700 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          `}
        >
          <p className="text-gray-700 dark:text-gray-200 mb-1">
            <b>Developer:</b> Sujal Gupta
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-1">
            <b>Role:</b> MERN Stack Developer
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-1">
            <b>Email:</b>{" "}
            <a
              href="mailto:sujalgupta1104@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              sujalgupta1104@gmail.com
            </a>
          </p>

          <p className="text-gray-700 dark:text-gray-200 mb-1">
            <b>LinkedIn:</b>{" "}
            <a
              href="https://www.linkedin.com/in/sujal-gupta-00709224a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LinkedIn Profile
            </a>
          </p>

          <p className="text-gray-700 dark:text-gray-200">
            <b>GitHub:</b>{" "}
            <a
              href="https://github.com/xujalz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              github.com/xujalz
            </a>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Lost & Found | Designed & Developed by{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              Sujal Gupta
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
