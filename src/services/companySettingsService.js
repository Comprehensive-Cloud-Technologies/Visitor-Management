import axios from "axios";

const API_URL =
"http://localhost:3060/api/company-settings";

export const getCompanySettings =
() =>
axios.get(API_URL);

export const updateCompanySettings =
(data) =>
axios.put(
API_URL,
data
);