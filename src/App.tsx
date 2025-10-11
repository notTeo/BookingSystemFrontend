import "./styles/global.css";

export default function App() {
  return (
    
    <div className="app">
      <div className="welcome-card">
        <h1 className="app-title">Welcome</h1>
        <nav className="nav-buttons">
          <a href="/login" className="btn">Login</a>
          <a href="/register" className="btn">Register</a>
          <a href="/overview" className="btn">Overview</a>
        </nav>
      </div>
    </div>
  );
}
