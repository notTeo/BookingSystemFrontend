// src/layouts/ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import "./PublicLayout.css";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

export default function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) {
    window.location.href = "/overview";
    return null;
  }

  return (
    <div className="public-layout">
      <Navbar/>
      <Outlet />
    </div>
  );
}