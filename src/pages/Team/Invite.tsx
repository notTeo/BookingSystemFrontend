import { useState } from "react";
import { sendShopInvite } from "../../api/shop"
import "./Invite.css";

export default function InviteUser() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const shopId = Number(localStorage.getItem("activeShop"))
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !role.trim()) return;
  
    setLoading(true);
    await sendShopInvite(shopId, { email, role, message });
    setInviteSent(true);
    setLoading(false);
  };

  const handleResend = () => {
    setInviteSent(false);
    setEmail("");
    setRole("");
    setMessage("");
  };

  return (
    <div className="invite-page">
      <h2 className="invite-title">Invite New User</h2>

      {!inviteSent ? (
        <form className="invite-form" onSubmit={handleSubmit}>
          <label htmlFor="email">User Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter user's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="MANAGER">Manager</option>
            <option value="STAFF">Staff</option>
          </select>

          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            placeholder="Add a personal note (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Invite"}
        </button>
        </form>
      ) : (
        <div className="invite-sent">
          <p>
            Invitation sent to <span className="invite-email">{email}</span>.
          </p>
          <button onClick={handleResend}>Resend Invite</button>
        </div>
      )}
    </div>
  );
}