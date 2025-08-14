import { Routes, Route } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import LandingPage from "./Pages/LandingPage";
import WorkSpace from "./Pages/Workspace";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function AppRouter() {
  const { loading } = useAuth();

  if (loading) {
    // Full-screen loader so nothing else flashes
    return (
      <div className="min-h-dvh grid place-items-center">
        <div className="text-zinc-600">Loading…</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* route for landing page (public) */}
      <Route path="/" element={<LandingPage />} />
      {/* protected route for user's home page (Auth only!)*/}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <WorkSpace />
          </ProtectedRoute>
        }
      />
      {/* Pattern route by id num */}
      <Route
        path="/app/p/:id"
        element={
          <ProtectedRoute>
            <WorkSpace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
