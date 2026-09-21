import axios from "axios";

const API =
"http://localhost:3060/api/dashboard";

export const getDashboardStats =
() =>
  axios.get(
    `${API}/stats`
  );