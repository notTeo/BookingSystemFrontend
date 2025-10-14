import { useState } from "react";
import "./Register.css";
import { registerRequest } from "../../api/auth";

export default function RegisterPage() {
  const [name, setName] = useState("Nick Theodosis");
  const [email, setEmail] = useState("nick@gmail.com");
  const [password, setPassword] = useState("nick123");
  const [confirmPassword, setConfirmPassword] = useState("nick123");
  const [subscription, setSubscription] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    registerRequest(name, email, password, confirmPassword, subscription)
      .then((res) => {
        console.log("Backend response:", res);

        const { accessToken, refreshToken, user } = res.data.result;

        if (!accessToken) {
          alert("No token received from server");
          return;
        }

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("activeShop");

        window.location.href = "/login";
      })
      .catch((err) => {
        console.error("Registration error:", err);
        alert("Error: " + (err as Error).message);
      });
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
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
            required
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
