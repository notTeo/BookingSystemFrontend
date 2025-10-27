import { useState } from "react";
import "./Account.css";
import { useAuth } from "../../context/AuthContext";
import { updateUser, deleteUser, type UpdateUserPayload } from "../../api/user";

interface Preferences {
  theme: "system" | "light" | "dark";
  language: "English" | "Greek";
  notifications: boolean;
}

export default function Account() {
  const { user, refreshUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState<Preferences>({
    theme: "system",
    language: "English",
    notifications: true,
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    msg: string;
  }>({
    type: "",
    msg: "",
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔹 NEW – for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  // ---------------------------------
  // HANDLERS
  // ---------------------------------
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, type, value } = target;

    setPreferences({
      ...preferences,
      [name]:
        type === "checkbox"
          ? (target as HTMLInputElement).checked
          : (value as Preferences[keyof Preferences]),
    });
  };

  // ---------------------------------
  // ACTIONS
  // ---------------------------------
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    const payload: UpdateUserPayload = {
      name: profile.name,
      email: profile.email,
    };

    try {
      await updateUser(payload);
      await refreshUser?.();
      setStatus({ type: "success", msg: "Profile updated successfully" });
    } catch (err) {
      setStatus({ type: "error", msg: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: "error", msg: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      await updateUser({ password: passwords.new });
      setPasswords({ current: "", new: "", confirm: "" });
      setStatus({ type: "success", msg: "Password updated successfully" });
    } catch (err) {
      setStatus({ type: "error", msg: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 NEW - actual delete logic
  const confirmDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword.trim()) return;

    try {
      setDeleting(true);
      await deleteUser(deletePassword);
      alert("Account deleted successfully");
      logout();
    } catch (err) {
      setStatus({
        type: "error",
        msg: (err as Error).message || "Error deleting account",
      });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  // ---------------------------------
  // RENDER
  // ---------------------------------
  return (
    <div className="account-container">
      <h1>Account Settings</h1>
      <p className="subtitle">
        Manage your personal information, security, and preferences
      </p>

      <div className="settings-grid">
        {/* PROFILE */}
        <section className="card">
          <h2>Profile Information</h2>
          <form onSubmit={saveProfile}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Full Name"
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Email"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* SECURITY */}
        <section className="card">
          <h2>Security</h2>
          <form onSubmit={updatePassword}>
            <label>Current Password</label>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder="Current password"
            />

            <label>New Password</label>
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
              placeholder="New password"
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* PREFERENCES */}
        <section className="card">
          <h2>Preferences</h2>
          <label>Theme</label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handlePreferenceChange}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label>Language</label>
          <select
            name="language"
            value={preferences.language}
            onChange={handlePreferenceChange}
          >
            <option>English</option>
            <option>Greek</option>
          </select>

          <div className="checkbox">
            <input
              type="checkbox"
              name="notifications"
              checked={preferences.notifications}
              onChange={handlePreferenceChange}
            />
            <label>Receive email notifications</label>
          </div>

          <button onClick={() => alert("Preferences saved locally for now.")}>
            Save Preferences
          </button>
        </section>

        {/* DANGER ZONE */}
        <section className="card danger">
          <h2>Danger Zone</h2>
          <p>Deleting your account will remove all data permanently.</p>
          <button
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            Delete My Account
          </button>
        </section>
      </div>

      {status.msg && <p className={`status ${status.type}`}>{status.msg}</p>}

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Account Deletion</h3>
            <p>
              This action is permanent. Please enter your password to confirm.
            </p>

            <form onSubmit={confirmDeleteAccount}>
              <input
                type="password"
                className="delete-input"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />

              <div className="delete-actions">
                <button
                  type="submit"
                  className="delete-confirm"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  className="delete-cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
