import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import imgFind from "../assets/imgFind.png";
import { useAuth } from "../context/AuthContext";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

/* ===================== SCROLL ANIMATION HOOK ===================== */
const useScrollAnimation = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
  }, []);

  return [ref, visible];
};

/* ===================== HERO ANIMATION HOOK ===================== */
const useHeroAnimation = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return visible;
};

/* ===================== COUNTER HOOK ===================== */
const useCounter = (target, start) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let curr = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const animate = () => {
      curr += increment;
      if (curr >= target) setCount(target);
      else {
        setCount(Math.floor(curr));
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [start, target]);

  return count;
};

/* ============================ MAIN PAGE ============================ */

const Home = () => {
  const { user } = useAuth();

  /* Spotlight cursor */
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  /* Scroll animations */
  const [lostRef, lostVisible] = useScrollAnimation();
  const [foundRef, foundVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [extraRef, extraVisible] = useScrollAnimation();

  /* Hero animation */
  const heroVisible = useHeroAnimation();

  /* Counters */
  const lostCount = useCounter(1200, statsVisible);
  const foundCount = useCounter(900, statsVisible);
  const userCount = useCounter(500, statsVisible);

  return (
    <div className="w-full">
      {/* =========================================================== */}
      {/* ======================= HERO SECTION ======================= */}
      {/* =========================================================== */}

      <div
        className="mouse-spotlight min-h-screen flex items-center relative px-6"
        style={{ "--x": `${pos.x}px`, "--y": `${pos.y}px` }}
      >
        <style>{`.mouse-spotlight::before { left: var(--x); top: var(--y); }`}</style>

        <div
          className={`relative z-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 
            transition-all duration-700
            ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
        >
          {/* LEFT IMAGE */}
          <img
            src={imgFind}
            className="w-80 mx-auto drop-shadow-2xl hidden md:block"
            alt="Lost & Found Illustration"
          />

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center items-start text-left gap-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
              Welcome, {user ? user.name.split(" ")[0] : "Guest"}!
            </h1>

            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-lg leading-relaxed">
              Track your lost belongings, report found items and help reunite
              things with their rightful owners. A simple and fast recovery
              system.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <Link
                to="/lost"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 
                text-white hover:bg-blue-700 transition shadow"
              >
                <MagnifyingGlassIcon className="w-5" />
                Lost Items
              </Link>

              <Link
                to="/found"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 
                text-white hover:bg-green-700 transition shadow"
              >
                <EyeIcon className="w-5" />
                Found Items
              </Link>

              {user ? (
                <Link
                  to="/upload"
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-800 
                  text-white hover:bg-gray-900 transition shadow"
                >
                  <ArrowUpTrayIcon className="w-5" />
                  Upload
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-800 
                  text-white hover:bg-gray-900 transition shadow"
                >
                  <LockClosedIcon className="w-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================== */}
      {/* ======================= LOST SECTION ======================= */}
      {/* =========================================================== */}

      <section
        ref={lostRef}
        className={`
          py-20 text-white transition-all duration-700
          ${
            lostVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
          bg-gradient-to-r from-blue-600 to-purple-600
          dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-900
        `}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 px-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/826/826070.png"
            className="w-full max-w-md mx-auto drop-shadow-xl"
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">Lost Something?</h2>
            <p className="text-lg leading-relaxed opacity-90">
              Report your lost belongings with photos, place and time. Our
              community-driven platform increases your chances of recovery.
            </p>
            <p className="mt-4 text-lg opacity-90">
              Browse hundreds of lost-item reports and filter by category,
              location or description.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* ======================= FOUND SECTION ====================== */}
      {/* =========================================================== */}

      <section
        ref={foundRef}
        className={`
          py-20 bg-white dark:bg-gray-900 transition-all duration-700
          ${
            foundVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
        `}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 px-6">
          <div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-300 mb-4">
              Found Something?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Help someone reclaim their lost valuables. Upload images, describe
              where you found the item and how they can reach you.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
              Hundreds of users have recovered their items because of kind
              contributors like you.
            </p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3601/3601653.png"
            className="w-full max-w-md mx-auto drop-shadow-xl"
          />
        </div>
      </section>

      {/* =========================================================== */}
      {/* =========================== STATS =========================== */}
      {/* =========================================================== */}

      <section
        ref={statsRef}
        className={`
          py-20 bg-gray-100 dark:bg-gray-900 transition-all duration-700
          ${
            statsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
        `}
      >
        <h2 className="text-center text-3xl font-bold text-blue-700 dark:text-blue-300 mb-10">
          Our Impact
        </h2>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {lostCount}+
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Items Lost</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-green-600 dark:text-green-400">
              {foundCount}+
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Items Found</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400">
              {userCount}+
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Users Helped
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* ====================== WHY CHOOSE US ======================= */}
      {/* =========================================================== */}

      <section
        ref={extraRef}
        className={`
          py-24 text-white transition-all duration-700
          ${
            extraVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }
          bg-gradient-to-r from-purple-600 to-blue-600
          dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-900
        `}
      >
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Why Choose Us?</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable and community-driven. Thousands of users trust our
            platform to help them recover lost belongings with ease.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
