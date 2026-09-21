import axios from "axios";

const API =
"/api/dashboard";

export const getDashboardStats =
() =>
  axios.get(
    `${API}/stats`
  );