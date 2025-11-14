import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* Footer Animation Hook */
const useFadeIn = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  return [ref, visible];
};

const Footer = () => {
  const [footerRef, visible] = useFadeIn();

  return (
    <footer
      ref={footerRef}
      className={`
        bg-blue-600 text-white mt-12
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} Lost & Found | Developed by{" "}
          <span className="font-semibold">Sujal Gupta</span>
        </p>

        <div className="flex gap-4 mt-3 sm:mt-0">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/lost" className="hover:underline">
            Lost Items
          </Link>
          <Link to="/found" className="hover:underline">
            Found Items
          </Link>
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
