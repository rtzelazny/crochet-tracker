import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/useAuth";
import "./index.css";
import App from "./App.tsx";
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import ProtectedRoute from "./auth/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* route for landing page */}
          <Route path="/" element={<LandingPage />} />
          {/* protected route for user's home page */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
