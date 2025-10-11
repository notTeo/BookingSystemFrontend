import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="logo">
          MyApp
        </a>
        <nav className="nav-links">
          <a href="/login" className="nav-btn">
            Login
          </a>
          <a href="/register" className="nav-btn">
            Register
          </a>
        </nav>
      </div>
    </header>
  );
}
