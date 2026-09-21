import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function VerifyOtp() {

  const navigate = useNavigate();

  const [otp, setOtp] =
    useState("");

 const email =
  localStorage.getItem(
    "resetEmail"
  );

if (!email) {

  return (
    <div
      style={{
        padding: "20px"
      }}
    >
      Email not found.
      Please start again.
    </div>
  );

}

  const handleVerify =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await axios.post(
            "http://localhost:3060/api/auth/verify-otp",
            {
              email,
              otp
            }
          );

        if(response.data.success)
        {
          alert(
            "OTP Verified"
          );

          navigate(
            "/reset-password"
          );
        }

      }
      catch(error)
      {
        alert(
          error.response?.data?.message ||
          "Invalid OTP"
        );
      }

    };

  return (

    <div className="forgot-page">

      <form
        className="forgot-card"
        onSubmit={handleVerify}
      >

        <h2>
          Verify OTP
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=>
            setOtp(
              e.target.value
            )
          }
          required
        />

        <button
          type="submit"
        >
          Verify OTP
        </button>

      </form>

    </div>

  );

}

export default VerifyOtp;