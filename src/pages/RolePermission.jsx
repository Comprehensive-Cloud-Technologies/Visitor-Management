import { useState, useEffect } from "react";
import "./RolePermission.css";
import { getRolePermissions, saveRolePermissions } from "../services/rolePermissionService";
import { getRoles } from "../services/roleService";
// Assuming you have an API service to fetch roles from your Role Master, import it here:
// import { getAllRoles } from "../services/roleService"; 
// Ensure this path is correct based on your project structure
function RolePermission() {
  // 1. Dynamic states for database roles and loading indicators
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState({});

  // 2. Dynamic modules listed as matrix column sections
  const modules = [
    "Employees",
    "Visitors",
    "Dashboard",
    "Roles",
    "Profile"
  ];

  const actions = ["create", "read", "update", "delete"];

  // Helper to assign specific color background classes to role badges based on text content
  const getBadgeColorClass = (roleName) => {
    const name = roleName.toLowerCase();
    if (name.includes("admin")) return "badge-indigo";
    if (name.includes("manager")) return "badge-purple";
    if (name.includes("employee")) return "badge-blue";
    if (name.includes("storekeeper")) return "badge-orange";
    return "badge-gray"; // Default fallback color
  };

  // 3. Fetch Master Roles and their respective Permission states
  useEffect(() => {
    const fetchMasterData = async () => {
      setIsLoadingRoles(true);
      try {
        // --- API FALLBACK / REPLACEMENT ---
        // Replace this mockup with your actual API call from Role Master:
        // const rolesResponse = await getAllRoles();
        // const fetchedRoles = rolesResponse.data.roles;
       const roleResponse =
  await getRoles();

const fetchedRoles =
  roleResponse.data.roles || [];

setRoles(fetchedRoles);
console.log("ROLES:", fetchedRoles);
        // Fetch permissions for all loaded roles instantly
        let initialPermissionsMap = {};
        
        for (let roleItem of fetchedRoles) {
          try {
            const response = await getRolePermissions(roleItem.id);
            if (response?.data?.success && response.data.permissions) {
              const rolePerms = {};
              response.data.permissions.forEach(p => {
                rolePerms[p.module_name] = {
                  create: p.can_create || false,
                  read: p.can_read || false,
                  update: p.can_update || false,
                  delete: p.can_delete || false,
                };
              });
              initialPermissionsMap[roleItem.id] = rolePerms;
            }
          } catch (err) {
            console.error(`Failed loading permissions for Role ID ${roleItem.id}:`, err);
          }
        }
        setPermissions(initialPermissionsMap);

      } catch (error) {
        console.error("Error fetching data from Role Master:", error);
        alert("Failed to load roles list from Role Master.");
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchMasterData();
    
  }, []);

  // Handle matrix dynamic checkbox state change
  const handleCheckboxChange = (roleId, module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId]?.[module],
          [action]: !prev[roleId]?.[module]?.[action]
        }
      }
    }));
  };

  // Save full matrix back to the backend database service
  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (let roleItem of roles) {
        const rolePermData = permissions[roleItem.id] || {};
        
        const payload = {
          role_id: roleItem.id,
          permissions: modules.map(module => ({
            module_name: module,
            can_create: rolePermData[module]?.create || false,
            can_read: rolePermData[module]?.read || false,
            can_update: rolePermData[module]?.update || false,
            can_delete: rolePermData[module]?.delete || false
          }))
        };

        await saveRolePermissions(payload);
      }
      alert("Permissions Saved Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Saving Permissions matrix configurations");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingRoles) {
    return (
      <div className="role-permission-container centered-status">
        <div className="loader-spinner"></div>
        <p>Loading Role Master Data...</p>
      </div>
    );
  }

  return (
    <div className="role-permission-container">
      <div className="role-permission-card">
        
        <div className="role-permission-header">
          <h2>Role Permissions</h2>
          <p className="subtitle">Configure Create / Read / Update / Delete permissions per role and module.</p>
        </div>

        {/* Matrix Table Presentation Layout */}
        <div className="matrix-table-wrapper">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="th-role">Role</th>
                {modules.map((module) => (
                  <th key={module} className="th-module">
                    <span className="module-title">{module}</span>
                    <div className="crud-legend">
                      <span>C</span>
                      <span>R</span>
                      <span>U</span>
                      <span>D</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((roleItem) => (
                <tr key={roleItem.id}>
                  {/* Dynamic Role Identification Badge */}
                  <td className="td-role">
                    <span className={`role-badge ${getBadgeColorClass(roleItem.role_name)}`}>
                      {roleItem.role_name}
                    </span>
                  </td>

                  {/* Columns Modules Mappings */}
                  {modules.map((module) => (
                    <td key={module} className="td-permissions">
                      <div className="checkbox-crud-group">
                        {actions.map((action) => (
                          <input
                            key={action}
                            type="checkbox"
                            title={`${roleItem.role_name} - ${module} [${action.toUpperCase()}]`}
                            checked={permissions[roleItem.id]?.[module]?.[action] || false}
                            onChange={() => handleCheckboxChange(roleItem.id, module, action)}
                            disabled={isSaving}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Controls Footer Panel */}
        <div className="matrix-footer">
          <button 
            className="save-permissions-btn" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Permissions"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default RolePermission;