import { useState } from "react";
import {
useNavigate,
useSearchParams
} from "react-router-dom";

import {
addRole
} from "../../services/roleService";

function AddRole() {

const navigate =
useNavigate();

const [searchParams] =
useSearchParams();

const isViewMode =
searchParams.get("view") === "true";

const [formData,
setFormData] =
useState({


  role_name: "",
  status: "Active"

});


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
      await addRole(
        formData
      );

    if (
      response.data.success
    ) {

      alert(
        "Role Added Successfully"
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
      "Something went wrong"
    );

  }

};


return (

<div className="employee-form-container">

  <div className="employee-form-card">

    <h2>

      {
        isViewMode
          ? "View Role"
          : "Add Role"
      }

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
        disabled={
          isViewMode
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
        disabled={
          isViewMode
        }
      >

        <option value="Active">
          Active
        </option>

        <option value="Inactive">
          Inactive
        </option>

      </select>

      {
        !isViewMode &&

        <button
          type="submit"
        >
          Save Role
        </button>
      }

      {
        isViewMode &&

        <button
          type="button"
          onClick={() =>
            navigate("/roles")
          }
        >
          Back
        </button>
      }

    </form>

  </div>

</div>


);

}

export default AddRole;
