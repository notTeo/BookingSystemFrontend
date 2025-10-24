import "./Overview.css";
import { useOutletContext } from "react-router-dom";
import type { UserDTO } from "../../types/user";

type OutletContextType = { user: UserDTO };

export default function Overview() {
  const { user } = useOutletContext<OutletContextType>();

  return (
      <div className="profile-card">
        <h1 className="me-title">My Profile</h1>
        <div className="profile-info">
          <h2><strong>ID:</strong> {user.id}</h2>
          <h2><strong>Name:</strong> {user.name}</h2>
          <h2><strong>Email:</strong> {user.email}</h2>
          <h2><strong>Subscription:</strong> {user.subscription}</h2>
          <h2><strong>Active:</strong> {user.active ? "Yes" : "No"}</h2>
        </div>
      </div>
  );
}
