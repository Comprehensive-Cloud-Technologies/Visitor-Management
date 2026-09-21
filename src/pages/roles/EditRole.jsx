import { useEffect, useState }
from "react";

import {
useNavigate,
useParams
}
from "react-router-dom";

import {
getRoleById,
updateRole
}
from "../../services/roleService";

import "../AddEmployee.css";

function EditRole() {

const navigate =
useNavigate();

const { id } =
useParams();

const [loading,
setLoading] =
useState(true);

const [formData,
setFormData] =
useState({


  role_name: "",
  status: "Active"

});


useEffect(() => {

const loadRole =
  async () => {

    try {

      const response =
        await getRoleById(id);

      if (
        response.data.success
      ) {

        setFormData({

          role_name:
            response.data.role.role_name || "",

          status:
            response.data.role.status || "Active"

        });

      }

    }
    catch (error) {

      console.log(error);

      alert(
        "Failed to load role"
      );

    }
    finally {

      setLoading(false);

    }

  };

if (id) {

  loadRole();

}


}, [id]);

const handleChange =
(e) => {


  setFormData({

    ...formData,

    [e.target.name]:
      e.target.value

  });

};


const handleSubmit =
async (e) => {


  e.preventDefault();

  try {

    const response =
      await updateRole(
        id,
        formData
      );

    if (
      response.data.success
    ) {

      alert(
        "Role Updated Successfully"
      );

      navigate(
        "/roles"
      );

    }

  }
  catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Failed to update role"
    );

  }

};


if (loading) {


return (

  <div
    className="employee-form-container"
  >

    <div
      className="employee-form-card"
    >

      <h2>
        Loading Role...
      </h2>

    </div>

  </div>

);


}

return (


<div
  className="employee-form-container"
>

  <div
    className="employee-form-card"
  >

    <h2>
      Edit Role
    </h2>

    <form
      onSubmit={
        handleSubmit
      }
    >

      <input
        type="text"
        name="role_name"
        placeholder="Role Name"
        value={
          formData.role_name
        }
        onChange={
          handleChange
        }
        required
      />

      <select
        name="status"
        value={
          formData.status
        }
        onChange={
          handleChange
        }
      >

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>

      </select>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px"
        }}
      >

        <button
          type="submit"
        >
          Update Role
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/roles"
            )
          }
          style={{
            background:
              "#6b7280"
          }}
        >
          Cancel
        </button>

      </div>

    </form>

  </div>

</div>


);

}

export default EditRole;
