import "regenerator-runtime/runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import RecordingPage from "./components/record/RecordingPage";
import SignupPage from "./components/signup-page"; // Renamed for clarity
import SignInPage from "./components/signin-page"; // New import

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/home" element={<App />} />
          <Route path="/record" element={<RecordingPage />} />
          {/* Redirect from root to login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root container not found");
}