import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [editMode, setEditMode] =
    useState(false);

  const [formData, setFormData] =
    useState({
      full_name: "",
      employee_code: "",
      email: "",
      mobile: ""
    });

  useEffect(() => {

    const loggedUser = JSON.parse(
      localStorage.getItem("user")
    );

    const fetchProfile = async () => {

      try {

        const response = await axios.get(
          `http://localhost:3060/api/users/${loggedUser?.id}`
        );

        if (response.data.success) {

          setUser(response.data.user);

          setFormData({
            full_name:
              response.data.user.full_name || "",
            employee_code:
              response.data.user.employee_code || "",
            email:
              response.data.user.email || "",
            mobile:
              response.data.user.mobile || ""
          });

        }

      }
      catch (error) {

        console.error(error);

      }

    };

    if (loggedUser?.id) {
      fetchProfile();
    }

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleUpdate = async () => {

    try {

      const response =
        await axios.put(
          `http://localhost:3060/api/auth/profile/${user.id}`,
          formData
        );

      if (response.data.success) {

        alert(
          "Profile Updated Successfully"
        );

        const updatedUser = {
          ...user,
          ...formData
        };

        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setEditMode(false);

      }

    }
    catch (error) {

      alert(
        error.response?.data?.message ||
        "Update Failed"
      );

    }

  };

  if (!user) {

    return (
      <div className="profile-loading">
        Loading Profile...
      </div>
    );

  }

  return (

    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {user.full_name?.charAt(0)}
          </div>

          <div>

            <h2>{user.full_name}</h2>

            <p>{user.role || "Admin"}</p>

          </div>

        </div>

        <div className="profile-body">

          <div className="profile-row">

            <span>Name</span>

            {
              editMode
              ?
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
              :
              <strong>
                {user.full_name}
              </strong>
            }

          </div>

          <div className="profile-row">

            <span>Employee Code</span>

            {
              editMode
              ?
              <input
                type="text"
                name="employee_code"
                value={formData.employee_code}
                onChange={handleChange}
              />
              :
              <strong>
                {user.employee_code}
              </strong>
            }

          </div>

          <div className="profile-row">

            <span>Email</span>

            {
              editMode
              ?
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              :
              <strong>
                {user.email}
              </strong>
            }

          </div>

          <div className="profile-row">

            <span>Mobile</span>

            {
              editMode
              ?
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
              :
              <strong>
                {user.mobile}
              </strong>
            }

          </div>

          <div className="profile-row">

            <span>Status</span>

            <strong className="active-status">
              {user.status || "Active"}
            </strong>

          </div>

        </div>

        <div className="profile-footer">

          {
            editMode
            ?
            <>
              <button
                className="edit-btn"
                onClick={handleUpdate}
              >
                Save Changes
              </button>

              <button
                className="password-btn"
                onClick={() =>
                  setEditMode(false)
                }
              >
                Cancel
              </button>
            </>
            :
            <>
              <button
                className="edit-btn"
                onClick={() =>
                  setEditMode(true)
                }
              >
                Edit Profile
              </button>

              <button
                className="password-btn"
                onClick={() =>
                  navigate("/change-password")
                }
              >
                Change Password
              </button>
            </>
          }

        </div>

      </div>

    </div>

  );

}

export default Profile;