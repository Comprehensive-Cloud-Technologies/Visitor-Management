import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import "./ForgotPassword.css";


function ResetPassword() {

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const email =
    localStorage.getItem(
      "resetEmail"
    );

  const handleReset =
    async (e) => {

      e.preventDefault();

      if(
        password !==
        confirmPassword
      )
      {
        return alert(
          "Passwords do not match"
        );
      }

      try {

        const response =
          await axios.post(
            "http://localhost:3060/api/auth/reset-password",
            {
              email,
              password
            }
          );

        if(response.data.success)
        {
          alert(
            "Password Reset Successfully"
          );

          localStorage.removeItem(
            "resetEmail"
          );

          navigate("/");
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

    <div className="forgot-page">

      <form
        className="forgot-card"
        onSubmit={handleReset}
      >

        <h2>
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>
            setConfirmPassword(
              e.target.value
            )
          }
          required
        />

        <button
          type="submit"
        >
          Reset Password
        </button>

      </form>

    </div>

  );

}

export default ResetPassword;