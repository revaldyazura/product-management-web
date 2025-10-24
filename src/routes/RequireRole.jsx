import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role }) {
  const { isAuthenticated, initializing, hasRole } = useAuth();

  if (initializing) return null; // bisa diganti spinner kecil
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !hasRole(role)) return <Navigate to="/home" replace />;

  return <Outlet />;
}