import { useState } from "react";
import "./Login.css"

export default function LoginPage() {
  const [email, setEmail] = useState("nick@gmial.com");
  const [password, setPassword] = useState("nick123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);

        const payload = data.data?.data;
        if (!payload || !payload.accessToken) {
          alert("No token received from server");
          return;
        }
        localStorage.setItem("token", payload.accessToken);
        localStorage.setItem("refreshToken", payload.refreshToken);
        window.location.href = "/overview";
        console.log("Token saved:", localStorage.getItem("token"));
      })
      .catch((err) => {
        console.error("Login error:", err);
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
