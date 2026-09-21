import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Signup() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
useState({
  fullName: "",
  employeeCode: "",
  email: "",
  mobile: "",
  password: ""
});

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };
  
const handleSubmit = async (e) => {

  e.preventDefault();

  if(formData.fullName.trim() === "")
  {
    alert("Enter Full Name");
    return;
  }

  if(formData.employeeCode.trim() === "")
  {
    alert("Enter Employee Code");
    return;
  }

  if(!/^[0-9]{10}$/.test(formData.mobile))
  {
    alert("Enter Valid Mobile Number");
    return;
  }

  if(
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(formData.email)
  )
  {
    alert("Enter Valid Email");
    return;
  }

  if(formData.password.length < 6)
  {
    alert(
      "Password must be minimum 6 characters"
    );
    return;
  }

  try {

    const response = await axios.post(
      "/api/auth/register",
      formData
    );

    if(response.data.success)
    {
      alert("Registration Successful");

      navigate("/");
    }

  }
  catch(error)
  {
    alert(
       error.response?.data?.message
  );
  }

};

  return (

    <div className="auth-container">

      <div className="auth-right">

        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >

          <h2>Admin Registration</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="employeeCode"
            placeholder="Employee Code"
            value={formData.employeeCode}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <div className="password-box">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? <FaEyeSlash />
                : <FaEye />
              }
            </span>

          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Register
          </button>

          <div className="switch-auth">

            Already have account?

            <Link to="/">
              Login
            </Link>

          </div>

        </form>

      </div>

    </div>

  );
}

export default Signup;