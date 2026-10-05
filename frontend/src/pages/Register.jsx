import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: replace with axios.post("/api/auth/register", formData)
    console.log("Register Data:", formData);
    alert(`Registered as ${formData.role}: ${formData.name}`);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Create an Account</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Register As</label>
          {/* Select dropdown - controlled component */}
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Reader (User)</option>
            <option value="author">Author</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;