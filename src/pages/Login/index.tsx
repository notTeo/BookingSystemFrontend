import { useState } from "react";
import "./Login.css";
import { loginRequest } from "../../api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("nick@gmail.com");
  const [password, setPassword] = useState("nick123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    loginRequest(email, password)
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

        console.log("Token saved:", localStorage.getItem("token"));
        window.location.href = "/overview";
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Login failed. Check console for details.");
      });
  };

  return (
    <div className="register-page">
      <h1 className="title">Login Owner</h1>
      <form onSubmit={handleLogin} className="register-form">
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
        <button type="submit" className="submit-btn">
          Login
        </button>
        <p className="alt-link">
          Already have an account? <a href="/register">Create one</a>
        </p>
      </form>
    </div>
  );
}
