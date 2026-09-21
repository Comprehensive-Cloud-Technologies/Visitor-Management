import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Auth.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

 const [username, setUsername] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username || !password) {
  alert("Please enter Username and Password");
  return;
}

    try {

     const response = await axios.post(
  "/api/auth/login",
  {
    username,
    password
  }
);

     if (response.data.success) {

  /* Remove old login information */

  localStorage.removeItem("user");

  /* Save current user with company details */

  localStorage.setItem(

    "user",

    JSON.stringify(
      response.data.user
    )

  );

  alert(

    `Welcome ${response.data.user.full_name}`

  );

  navigate("/dashboard");

}
    }

    
    catch (error) {

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (
    <div className="auth-container">

      <div className="overlay"></div>

      <div className="auth-right">

        <form
          className="auth-card"
          onSubmit={handleLogin}
        >

          <h2>Sign In</h2>

          <div className="input-group">

            <input
  type="text"
  placeholder="Username"
  value={username}
  onChange={(e) =>
    setUsername(e.target.value)
  }
/>

          </div>

          <div className="input-group">

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
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

          </div>

          <div className="remember-row">

            <label>

              <input
                type="checkbox"
                className="remember-check"
              />

              Remember Me

            </label>

            <Link to="/forgot-password">
  Forgot Password?
</Link>

          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Sign In
          </button>

          <div className="switch-auth">

            Don't have an account?

            <Link to="/signup">
              Sign Up
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;