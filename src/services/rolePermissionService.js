import axios from "axios";

const API_URL =
"http://localhost:3060/api/role-permissions";

export const getRolePermissions =
(roleId) =>
axios.get(
`${API_URL}/${roleId}`
);

export const saveRolePermissions =
(data) =>
axios.post(
API_URL,
data
);
export const getPermissionsByRole =
(roleId)=>
axios.get(
`http://localhost:3060/api/role-permissions/permissions/${roleId}`
);