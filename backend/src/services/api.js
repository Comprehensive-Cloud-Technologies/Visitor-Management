import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3060/api"
});

export default api;