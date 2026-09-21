import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {

  const navigate = useNavigate();

  const loggedUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [formData, setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (
      formData.newPassword.length < 6
    ) {
      return alert(
        "Password should be at least 6 characters"
      );
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return alert(
        "Passwords do not match"
      );
    }

    try {

      const response =
        await axios.put(
          `http://localhost:3060/api/auth/change-password/${loggedUser.id}`,
          {
            currentPassword:
              formData.currentPassword,

            newPassword:
              formData.newPassword
          }
        );

      if (
        response.data.success
      ) {

        alert(
          "Password Changed Successfully"
        );

        navigate("/profile");

      }

    }
    catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed"
      );

    }

  };

  return (

    <div className="password-page">

      <form
        className="password-card"
        onSubmit={handleSubmit}
      >

        <h2>
          Change Password
        </h2>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={
            formData.currentPassword
          }
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={
            formData.newPassword
          }
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={
            formData.confirmPassword
          }
          onChange={handleChange}
          required
        />

        <button type="submit">
          Update Password
        </button>

      </form>

    </div>

  );

}

export default ChangePassword;