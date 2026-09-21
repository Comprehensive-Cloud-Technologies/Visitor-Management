import axios from "axios";

const API =
"http://localhost:3060/api/company-settings";

export const getCompanySettings =
() =>
axios.get(API);

export const updateCompanySettings =
(data) =>
axios.put(API,data);