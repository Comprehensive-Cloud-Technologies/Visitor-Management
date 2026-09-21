import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRoles,
  deleteRole
} from "../../services/roleService";
import "./RoleList.css";
import {
  FaEye
} from "react-icons/fa";
import RolePermission from "../RolePermission";

function RoleList() {

  const navigate =
    useNavigate();

  const [roles, setRoles] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [selectedRole, setSelectedRole] =
    useState(null);

  const [showPermissionModal, setShowPermissionModal] =
    useState(false);

  useEffect(() => {

    let isMounted = true;
    const loadRoles =
      async () => {

        try {

          const response =
            await getRoles();

          if (
            isMounted &&
            response.data.success
          ) {

            setRoles(
              response.data.roles || []
            );

          }

        }
        catch (error) {

          console.log(error);

        }
        finally {

          if (isMounted) {

            setLoading(false);

          }

        }

      };

    loadRoles();

    return () => {

      isMounted = false;

    };

  }, []);

  const refreshRoles =
    async () => {

      try {

        const response =
          await getRoles();

        if (
          response.data.success
        ) {

          setRoles(
            response.data.roles || []
          );

        }

      }
      catch (error) {

        console.log(error);

      }

    };

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this role?"
        );

      if (!confirmDelete) {

        return;

      }

      try {

        const response =
          await deleteRole(id);

        if (
          response.data.success
        ) {

          alert(
            "Role Deleted Successfully"
          );

          refreshRoles();

        }

      }
      catch (error) {

        console.log(error);

        alert(
          "Failed to delete role"
        );

      }

    };

  const filteredRoles =
    roles.filter(
      (role) =>
        role.role_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  if (loading) {

    return (
      <div className="role-container">
        <h2>Loading Roles...</h2>
      </div>
    );

  }

  return (

    <div className="role-container">

      <div className="role-header">

        <h2>
          Role Management
        </h2>

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <input
            type="text"
            placeholder="Search Role..."
            className="search-box"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <button
            className="add-role-btn"
            onClick={() =>
              navigate(
                "/add-role"
              )
            }
          >
            Add Role
          </button>

        </div>

      </div>

      <table className="role-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Role Name</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {
            filteredRoles.length > 0
              ?

              filteredRoles.map(
                (role) => (

                  <tr key={role.id}>

                    <td>
                      {role.id}
                    </td>

                    <td>
                      {role.role_name}
                    </td>

                    <td>

                      <span
                        className={
                          role.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {role.status}
                      </span>

                    </td>

                  <td>
  <div className="action-icons">

   <button
  className="icon-btn view"
  title="View Permissions"
  onClick={() => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  }}
>
  <FaEye />
</button>

   {
  showPermissionModal && (
    <div className="modal-overlay">
      <div className="modal-content">

        <button
          className="close-btn"
          onClick={() =>
            setShowPermissionModal(false)
          }
        >
          ✕
        </button>

        <RolePermission
          roleId={selectedRole?.id}
          roleName={selectedRole?.role_name}
        />

      </div>
    </div>
  )
}
    <button
      className="icon-btn edit"
      title="Edit"
      onClick={() =>
        navigate(`/edit-role/${role.id}`)
      }
    >
      ✏️
    </button>

    <button
      className="icon-btn delete"
      title="Delete"
      onClick={() =>
        handleDelete(role.id)
      }
    >
      🗑️
    </button>

  </div>
</td>

                  </tr>

                )
              )

              :

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: "center"
                  }}
                >
                  No Roles Found
                </td>

              </tr>

          }

        </tbody>

      </table>

      {
        showPermissionModal &&
        (
          <div className="modal-overlay">

            <div className="modal-content">

              <button
                className="close-btn"
                onClick={() =>
                  setShowPermissionModal(false)
                }
              >
                ✕
              </button>

              <RolePermission
                roleId={selectedRole?.id}
                roleName={selectedRole?.role_name}
              />

            </div>

          </div>
        )
      }

    </div>

  );

}

export default RoleList;