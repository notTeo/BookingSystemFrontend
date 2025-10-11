import { useState } from "react";
import "./Register.css";

export default function RegisterPage() {
  const [name, setName] = useState("nick");
  const [email, setEmail] = useState("nick@gmial.com");
  const [password, setPassword] = useState("nick123");
  const [confirmPassword, setConfirmPassword] = useState("nick123");
  const [subscription, setSubscription] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, subscription }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error: " + (err as Error).message);
    }
  };

  return (
    <div className="register-page">
      <h1 className="title">Register Owner</h1>
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group subscription-group">
          <label htmlFor="subscription">Choose Subscription:</label>
          <select
            id="subscription"
            name="subscription"
            className="subscription-select"
            onChange={(e) => setSubscription(e.target.value)}
          >
            <option value="">Select a plan</option>
            <option value="MEMBER">Member</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Pro</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
        <p className="alt-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
