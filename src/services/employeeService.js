const API_BASE_URL =
  "http://localhost:3060/api";

/* ==========================================
   GET LOGGED-IN COMPANY ID
========================================== */

function getCompanyId() {

  const savedUser =
    localStorage.getItem("user");

  if (!savedUser) {

    throw new Error(
      "User session not found. Please login again."
    );

  }

  const user =
    JSON.parse(savedUser);

  if (!user.company_id) {

    throw new Error(
      "Company ID is missing. Please login again."
    );

  }

  return user.company_id;

}


/* ==========================================
   CREATE COMPANY HEADERS
========================================== */

function getCompanyHeaders(
  includeContentType = false
) {

  const companyId =
    getCompanyId();

  const headers = {

    "x-company-id":
      String(companyId)

  };

  if (includeContentType) {

    headers[
      "Content-Type"
    ] = "application/json";

  }

  return headers;

}


/* ==========================================
   HANDLE API RESPONSE
========================================== */

async function handleResponse(
  response
) {

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  const isJson =
    contentType.includes(
      "application/json"
    );

  const payload =
    isJson
      ? await response.json()
      : null;

  if (!response.ok) {

    const message =
      payload?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);

  }

  return payload;

}


/* ==========================================
   GET ALL EMPLOYEES
========================================== */

export async function getEmployees() {

  const response =
    await fetch(

      `${API_BASE_URL}/employees`,

      {

        headers:
          getCompanyHeaders()

      }

    );

  const data =
    await handleResponse(
      response
    );

  return { data };

}


/* ==========================================
   ADD EMPLOYEE
========================================== */

/* ==========================================
   ADD EMPLOYEE
========================================== */

export async function addEmployee(
  employeeData
) {

  const response =
    await fetch(

      `${API_BASE_URL}/employees`,

      {

        method: "POST",

        headers:
          getCompanyHeaders(true),

        body:
          JSON.stringify(
            employeeData
          )

      }

    );

  const data =
    await handleResponse(
      response
    );

  return {

    data

  };

}


/* ==========================================
   DELETE EMPLOYEE
========================================== */

export async function deleteEmployee(
  id
) {

  const response =
    await fetch(

      `${API_BASE_URL}/employees/${id}`,

      {

        method: "DELETE",

        headers:
          getCompanyHeaders()

      }

    );

  const data =
    await handleResponse(
      response
    );

  return { data };

}


/* ==========================================
   GET EMPLOYEE BY ID
========================================== */

export async function getEmployeeById(
  id
) {

  const response =
    await fetch(

      `${API_BASE_URL}/employees/${id}`,

      {

        headers:
          getCompanyHeaders()

      }

    );

  const data =
    await handleResponse(
      response
    );

  return { data };

}


/* ==========================================
   UPDATE EMPLOYEE
========================================== */

export async function updateEmployee(

  id,

  employeeData

) {

  const response =
    await fetch(

      `${API_BASE_URL}/employees/${id}`,

      {

        method: "PUT",

        headers:
          getCompanyHeaders(true),

        body:
          JSON.stringify(
            employeeData
          )

      }

    );

  const data =
    await handleResponse(
      response
    );

  return { data };

}


/* ==========================================
   IMPORT EMPLOYEES
========================================== */

export async function importEmployees(
  employees
) {

  const response =
    await fetch(

      `${API_BASE_URL}/employees/import`,

      {

        method: "POST",

        headers:
          getCompanyHeaders(true),

        body:
          JSON.stringify({

            employees

          })

      }

    );

  const data =
    await handleResponse(
      response
    );

  return { data };

}