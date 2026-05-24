import { Link } from "react-router-dom";

function HomeNavbar() {
  return (
    <nav className="home-nav">
      <div className="brand">
        <div className="brand-icon">CF</div>
        <span>ChatFlow AI</span>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="nav-link">
          Sign in
        </Link>

        <Link to="/register" className="nav-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;