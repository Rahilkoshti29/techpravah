import { Link } from "react-router-dom";

// For now, we hardcode role to test UI. Later this comes from login/auth state.
function Navbar({ role }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">TechPravah</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {/* Conditional Rendering based on role */}
          {(role === "author" || role === "admin") && (
            <li className="nav-item">
              <Link className="nav-link" to="/author/create">Write Article</Link>
            </li>
          )}

          {role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">Admin Panel</Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav">
          {!role && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          {role && (
            <li className="nav-item">
              <span className="nav-link text-warning">Logged in as {role}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;