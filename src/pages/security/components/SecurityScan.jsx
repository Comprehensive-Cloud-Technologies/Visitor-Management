import {
useState,
useEffect
} from "react";

import {
useParams
} from "react-router-dom";

import axios from "axios";

function SecurityScan() {

/* ===============================
ROUTE PARAMETER
=============================== */

const {
id
} = useParams();

/* ===============================
COMPANY ID
=============================== */

const getStoredCompanyId = () => {

try {


/* ===========================
   DIRECT COMPANY ID
=========================== */

const directCompanyId =

  localStorage.getItem(
    "company_id"
  );


if (

  directCompanyId

) {

  return Number(
    directCompanyId
  );

}


/* ===========================
   USER OBJECT
=========================== */

const storedUser =

  localStorage.getItem(
    "user"
  );


if (

  storedUser

) {

  const user =

    JSON.parse(
      storedUser
    );


  return Number(

    user.company_id

    ||

    user.companyId

    ||

    0

  );

}


return 0;


}

catch (

error


) {

console.log(

  "COMPANY ID ERROR:",

  error

);


return 0;


}

};

const companyId =

getStoredCompanyId();

/* ===============================
STATE
=============================== */

const [

visitor,

setVisitor

] = useState(
null
);

const [

loading,

setLoading

] = useState(
true
);

const [

checkingIn,

setCheckingIn

] = useState(
false
);

const [

visitorPassId,

setVisitorPassId

] = useState(
""
);

/* ===============================
LOAD VISITOR
=============================== */

useEffect(() => {

const loadVisitor =

async () => {

try {


if (

  !companyId

) {

  console.log(

    "Company ID was not found in localStorage"

  );


  alert(

    "Company information is missing. Please log in again."

  );


  setLoading(
    false
  );


  return;

}


const response =

  await axios.get(

    `/api/visitors/scan/${id}`,

    {

      headers: {

        "x-company-id":

          companyId

      }

    }

  );


if (

  response
    .data
    .success

) {

  setVisitor(

    response
      .data
      .visitor

  );

}


}

catch (


error


) {

console.log(

  "LOAD VISITOR ERROR:",

  error

);


console.log(

  "SERVER RESPONSE:",

  error
    ?.response
    ?.data

);


alert(

  error
    ?.response
    ?.data
    ?.message

  ||

  "Unable to load visitor"

);


}

finally {


setLoading(
  false
);


}

};

loadVisitor();

}, [

id,

companyId

]);

/* ===============================
CHECK IN
=============================== */

const handleCheckIn =

async () => {

try {


if (

  !companyId

) {

  alert(

    "Company information is missing."

  );


  return;

}


setCheckingIn(
  true
);


const response =

  await axios.put(

    `/api/visitors/checkin/${id}`,

    {

      checked_in_by:

        "Security",

      has_vehicle:

        0,

      verifiedAssets:

        {}

    },

    {

      headers: {

        "x-company-id":

          companyId

      }

    }

  );


if (

  response
    .data
    .success

) {

  setVisitor(

    response
      .data
      .visitor

  );


  setVisitorPassId(

    response
      .data
      .visitorPassId

    ||

    ""

  );


  alert(

    "Visitor Checked In Successfully"

  );

}


}

catch (


error


) {


console.log(

  "CHECK-IN ERROR:",

  error

);


console.log(

  "SERVER RESPONSE:",

  error
    ?.response
    ?.data

);


alert(

  error
    ?.response
    ?.data
    ?.message

  ||

  "Check-In Failed"

);


}

finally {

setCheckingIn(
  false
);


}

};

/* ===============================
LOADING
=============================== */

if (

loading

) {

return (

  <div

style={{

  minHeight:

    "100vh",

  display:

    "flex",

  alignItems:

    "center",

  justifyContent:

    "center",

  fontSize:

    "24px",

  fontWeight:

    "bold"

}}


>


Loading Visitor...
```

  </div>

);

}

/* ===============================
VISITOR NOT FOUND
=============================== */

if (

!visitor

) {

return (

  <div


style={{

  minHeight:

    "100vh",

  display:

    "flex",

  alignItems:

    "center",

  justifyContent:

    "center",

  color:

    "red",

  fontSize:

    "24px",

  fontWeight:

    "bold"

}}


>


Visitor Not Found


  </div>

);

}

/* ===============================
PAGE
=============================== */

return (

<div

style={{


minHeight:

  "100vh",

background:

  "#f1f5f9",

padding:

  "40px"


}}

>

  <div


style={{

  maxWidth:

    "800px",

  margin:

    "auto",

  background:

    "#ffffff",

  borderRadius:

    "20px",

  overflow:

    "hidden",

  boxShadow:

    "0 10px 30px rgba(0,0,0,0.12)"

}}


>


{/* HEADER */}

<div

  style={{

    background:

      "#0f4c81",

    color:

      "#ffffff",

    padding:

      "25px",

    textAlign:

      "center"

  }}

>

  <h1

    style={{

      margin:

        0

    }}

  >

    Visitor Verification

  </h1>


  <p

    style={{

      marginTop:

        "10px"

    }}

  >

    Security Check-In Portal

  </p>

</div>


{/* BODY */}

<div

  style={{

    padding:

      "35px"

  }}

>


  {/* PHOTO */}

  <div

    style={{

      textAlign:

        "center",

      marginBottom:

        "30px"

    }}

  >

    {

      visitor
        .visitor_photo

      ?

      <img

        src={

          visitor
            .visitor_photo

        }

        alt=

        "Visitor"

        style={{

          width:

            "150px",

          height:

            "150px",

          borderRadius:

            "50%",

          objectFit:

            "cover",

          border:

            "5px solid #2563eb"

        }}

      />

      :

      <div

        style={{

          width:

            "150px",

          height:

            "150px",

          borderRadius:

            "50%",

          background:

            "#e2e8f0",

          display:

            "inline-flex",

          alignItems:

            "center",

          justifyContent:

            "center",

          fontSize:

            "50px"

        }}

      >

        ðŸ‘¤

      </div>

    }

  </div>


  {/* DETAILS */}

  <table

    style={{

      width:

        "100%",

      borderCollapse:

        "collapse"

    }}

  >

    <tbody>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Visitor ID

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          VIS-

          {

            String(

              visitor.id

            )

            .padStart(

              5,

              "0"

            )

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Visitor Name

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor
              .visitor_name

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Email

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor.email

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Company

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor
              .company_name

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Purpose

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor.purpose

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Visit Date

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor
              .visit_date

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Host Employee

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          {

            visitor
              .employee_name

          }

        </td>

      </tr>


      <tr>

        <td

          style={{

            padding:

              "12px"

          }}

        >

          <b>

            Status

          </b>

        </td>


        <td

          style={{

            padding:

              "12px"

          }}

        >

          <span

            style={{

              padding:

                "8px 15px",

              borderRadius:

                "20px",

              color:

                "#ffffff",

              fontWeight:

                "bold",

              background:

                visitor.status
                ===
                "CHECKED IN"

                ?

                "#16a34a"

                :

                visitor.status
                ===
                "APPROVED"

                ?

                "#2563eb"

                :

                visitor.status
                ===
                "REJECTED"

                ?

                "#dc2626"

                :

                "#f59e0b"

            }}

          >

            {

              visitor.status

            }

          </span>

        </td>

      </tr>


    </tbody>

  </table>


  {

    visitorPassId

    &&

    <div

      style={{

        marginTop:

          "25px",

        textAlign:

          "center"

      }}

    >

      <h3

        style={{

          color:

            "#0f4c81",

          marginBottom:

            "10px"

        }}

      >

        Visitor Pass ID

      </h3>


      <div

        style={{

          display:

            "inline-block",

          background:

            "#e0f2fe",

          color:

            "#0f4c81",

          padding:

            "12px 25px",

          borderRadius:

            "10px",

          fontSize:

            "22px",

          fontWeight:

            "bold",

          letterSpacing:

            "2px"

        }}

      >

        {

          visitorPassId

        }

      </div>

    </div>

  }


  {/* ACTION */}

  <div

    style={{

      textAlign:

        "center",

      marginTop:

        "40px"

    }}

  >


    {

      visitor.status
      ===
      "APPROVED"

      &&

      <button

        onClick={

          handleCheckIn

        }

        disabled={

          checkingIn

        }

        style={{

          background:

            "#16a34a",

          color:

            "#ffffff",

          border:

            "none",

          padding:

            "15px 35px",

          borderRadius:

            "10px",

          fontSize:

            "18px",

          fontWeight:

            "bold",

          cursor:

            checkingIn

            ?

            "not-allowed"

            :

            "pointer",

          opacity:

            checkingIn

            ?

            0.7

            :

            1

        }}

      >

        {

          checkingIn

          ?

          "Checking In..."

          :

          "CHECK IN VISITOR"

        }

      </button>

    }


    {

      visitor.status
      ===
      "CHECKED IN"

      &&

      <div

        style={{

          color:

            "#16a34a",

          fontSize:

            "20px",

          fontWeight:

            "bold"

        }}

      >

        âœ“ Visitor Already Checked In

      </div>

    }


    {

      visitor.status
      ===
      "REJECTED"

      &&

      <div

        style={{

          color:

            "#dc2626",

          fontSize:

            "20px",

          fontWeight:

            "bold"

        }}

      >

        âœ• Visitor Request Rejected

      </div>

    }


    {

      visitor.status
      ===
      "PENDING"

      &&

      <div

        style={{

          color:

            "#f59e0b",

          fontSize:

            "20px",

          fontWeight:

            "bold"

        }}

      >

        Waiting For Approval

      </div>

    }


  </div>

</div>


  </div>

</div>

);

}

export default SecurityScan;
