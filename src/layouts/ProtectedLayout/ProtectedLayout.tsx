// src/layouts/ProtectedLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProtectedLayout.css";
import { useAuth } from "../../context/AuthContext";
import { ShopProvider } from "../../context/ShopContext";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if unauthenticated once auth finishes loading
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // 🧠 Prevent early rendering before auth is done
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return null;

  return (
    <ShopProvider>
      <div className="protected-layout">
        <Sidebar user={user} />
        <main className="with-sidebar">
          <Outlet context={{ user }} />
        </main>
      </div>
    </ShopProvider>
  );
}
