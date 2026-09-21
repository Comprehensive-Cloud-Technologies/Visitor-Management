import axios from "axios";

const API_URL =
"/api/company-settings";

export const getCompanySettings =
() =>
axios.get(API_URL);

export const updateCompanySettings =
(data) =>
axios.put(
API_URL,
data
);