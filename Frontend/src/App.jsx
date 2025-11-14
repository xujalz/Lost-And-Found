import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import UploadItem from "./pages/UploadItem";
import MyItems from "./pages/MyItems";
import ItemDetails from "./pages/ItemDetails";
import AboutUs from "./pages/AboutUs";
import EditItem from "./pages/EditItem";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          <Route path="/lost" element={<LostItems />} />
          <Route path="/found" element={<FoundItems />} />

          <Route
            path="/upload"
            element={user ? <UploadItem /> : <Navigate to="/login" />}
          />
          <Route
            path="/myitems"
            element={user ? <MyItems /> : <Navigate to="/login" />}
          />

          <Route path="/lost/:id" element={<ItemDetails type="lost" />} />
          <Route path="/found/:id" element={<ItemDetails type="found" />} />

          <Route path="/edit/:type/:id" element={<EditItem />} />

          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
