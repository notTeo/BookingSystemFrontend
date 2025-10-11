// src/layouts/ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ProtectedLayout.css";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div >
      <Sidebar role={user.role} name={user.name} />
      <div className="with-sidebar">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
