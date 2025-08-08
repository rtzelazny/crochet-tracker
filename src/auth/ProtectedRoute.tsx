import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-6">Loading…</div>;
  if (!session) return <Navigate to="/" state={{ from: loc }} replace />;
  return <>{children}</>;
}
