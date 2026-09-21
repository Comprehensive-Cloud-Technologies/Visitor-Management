import axios from "axios";

const API =
"http://localhost:3060/api/employees";

export const getEmployees =
() => axios.get(API);

export const getEmployee =
(id) => axios.get(
`${API}/${id}`
);

export const addEmployee =
(data) => axios.post(
API,
data
);

export const updateEmployee =
(id,data) => axios.put(
`${API}/${id}`,
data
);

export const deleteEmployee =
(id) => axios.delete(
`${API}/${id}`
);