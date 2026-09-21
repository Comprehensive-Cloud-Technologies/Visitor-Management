import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response =
        await axios.post(
          "http://localhost:3060/api/auth/forgot-password",
          { email }
        );

      if(response.data.success)
{
  localStorage.setItem(
    "resetEmail",
    email
  );

  navigate(
    "/verify-otp"
  );
}

    }
    catch(error)
    {
      alert(
        error.response?.data?.message ||
        "Failed"
      );
    }

  };

  return (

    <div className="auth-container">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          required
        />

        <button
          type="submit"
          className="auth-btn"
        >
          Send OTP
        </button>

      </form>

    </div>

  );

}

export default ForgotPassword;