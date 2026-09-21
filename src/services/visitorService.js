import axios from "axios";


const API_URL =
  "http://localhost:3060/api/visitors";


/* ==========================================
   GET LOGGED-IN COMPANY ID
========================================== */

function getCompanyId() {

  const savedUser =
    localStorage.getItem(
      "user"
    );


  if (
    !savedUser
  ) {

    throw new Error(

      "User session not found. Please login again."

    );

  }


  let user;


  try {

    user =
      JSON.parse(
        savedUser
      );

  }
  catch {

    throw new Error(

      "Invalid login session. Please login again."

    );

  }


  if (
    !user.company_id
  ) {

    throw new Error(

      "Company ID is missing. Please login again."

    );

  }


  return user.company_id;

}


/* ==========================================
   CREATE COMPANY HEADERS
========================================== */

function getCompanyHeaders() {

  const companyId =
    getCompanyId();


  return {

    "x-company-id":

      String(
        companyId
      )

  };

}


/* ==========================================
   GET ALL VISITORS
========================================== */

export const getVisitors =
  () =>

    axios.get(

      API_URL,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   GET SINGLE VISITOR
========================================== */

export const getVisitorById =
  (id) =>

    axios.get(

      `${API_URL}/${id}`,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   ADD VISITOR
========================================== */

export const addVisitor =
  (data) =>

    axios.post(

      API_URL,

      data,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   UPDATE VISITOR
========================================== */

export const updateVisitor =
  (
    id,
    data
  ) =>

    axios.put(

      `${API_URL}/${id}`,

      data,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   DELETE VISITOR
========================================== */

export const deleteVisitor =
  (id) =>

    axios.delete(

      `${API_URL}/${id}`,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   BULK VISITOR STATUS UPDATE
========================================== */

export const updateVisitorStatusBulk =
  (
    data
  ) => {

    console.log(

      "CALLING BULK STATUS API",

      data

    );


    return axios.put(

      `${API_URL}/bulk-status`,

      data,

      {

        headers:

          getCompanyHeaders()

      }

    );

  };


/* ==========================================
   SECURITY CHECK-IN
========================================== */

export const checkInVisitor =
  (
    id,
    data
  ) =>

    axios.put(

      `${API_URL}/checkin/${id}`,

      data,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   VISITOR CHECKOUT
========================================== */

export const checkOutVisitor =
  (
    id,
    data = {}
  ) =>

    axios.put(

      `${API_URL}/checkout/${id}`,

      data,

      {

        headers:

          getCompanyHeaders()

      }

    );


/* ==========================================
   CURRENT VISITORS
========================================== */

export const getCurrentVisitors =
  async () => {

    const res =

      await axios.get(

        `${API_URL}/current`,

        {

          headers:

            getCompanyHeaders()

        }

      );


    return res.data;

  };


/* ==========================================
   RECENT ACTIVITY
========================================== */

export const getRecentActivity =
  async () => {

    const res =

      await axios.get(

        `${API_URL}/recent-activity`,

        {

          headers:

            getCompanyHeaders()

        }

      );


    return res.data;

  };


/* ==========================================
   DASHBOARD STATS
========================================== */

export const getDashboardStats =
  async () => {

    const res =

      await axios.get(

        `${API_URL}/dashboard-stats`,

        {

          headers:

            getCompanyHeaders()

        }

      );


    return res.data;

  };


/* ==========================================
   SEARCH VISITORS
========================================== */

export const searchVisitors =
  async (
    query
  ) => {

    const res =

      await axios.get(

        `${API_URL}/search/${

          encodeURIComponent(
            query
          )

        }`,

        {

          headers:

            getCompanyHeaders()

        }

      );


    return res.data;

  };


/* ==========================================
   PRINT VISITOR PASS
========================================== */

export const printVisitorPass =
  async (
    id
  ) => {

    const response =

      await axios.get(

        `${API_URL}/print/${id}`,

        {

          headers:

            getCompanyHeaders(),

          responseType:

            "blob"

        }

      );


    const pdfBlob =

      new Blob(

        [

          response.data

        ],

        {

          type:

            "application/pdf"

        }

      );


    const pdfUrl =

      window.URL
        .createObjectURL(

          pdfBlob

        );


    window.open(

      pdfUrl,

      "_blank"

    );


    setTimeout(

      () => {

        window.URL
          .revokeObjectURL(

            pdfUrl

          );

      },

      60000

    );

  };


/* ==========================================
   GET VISITOR PASS URL
========================================== */

/*
  Do not use this function for
  authenticated company-wise printing.

  The printVisitorPass(id)
  function above should be used.
*/

export const getVisitorPassUrl =
  (id) =>

    `${API_URL}/print/${id}`;