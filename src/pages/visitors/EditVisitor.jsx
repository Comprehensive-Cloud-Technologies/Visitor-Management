import {
useState,
useEffect
} from "react";

import {
useNavigate,
useParams
} from "react-router-dom";

import {
getVisitorById,
updateVisitor
} from "../../services/visitorService";

import {
getEmployees
} from "../../services/employeeService";

import {
FaUser,
FaIdCard,
FaUsers,
FaLaptop,
FaClipboardList,
FaSignature,
FaCalendarAlt,
FaBuilding,
FaPhone,
FaEnvelope,
FaUserTie,
FaCamera,
FaPlus,
FaTrash,
FaEdit,
FaBoxOpen
} from "react-icons/fa";

import "./AddVisitor.css";
const formatDateForInput = (dateValue) => {

if (!dateValue) {


return "";


}

/* If API already returns YYYY-MM-DD */

const directDateMatch = String(
dateValue
).match(
/^\d{4}-\d{2}-\d{2}/
);

if (directDateMatch) {


return directDateMatch[0];


}

/* Handle MySQL date format */

const mysqlDateMatch = String(
dateValue
).match(
/(\d{4})-(\d{1,2})-(\d{1,2})/
);

if (mysqlDateMatch) {


const year =
  mysqlDateMatch[1];

const month =
  mysqlDateMatch[2]
    .padStart(2, "0");

const day =
  mysqlDateMatch[3]
    .padStart(2, "0");

return `${year}-${month}-${day}`;


}

/* Final fallback */

const parsedDate =
new Date(dateValue);

if (
Number.isNaN(
parsedDate.getTime()
)
) {


return "";


}

const year =
parsedDate.getFullYear();

const month =
String(
parsedDate.getMonth() + 1
).padStart(
2,
"0"
);

const day =
String(
parsedDate.getDate()
).padStart(
2,
"0"
);

return `${year}-${month}-${day}`;

};



const formatTimeForInput = (
  value
) => {

  if (!value) {

    return "";

  }


  const timeValue =

    String(value)


      .trim();


  const timeMatch =

    timeValue.match(

      /(\d{1,2}):(\d{2})/

    );


  if (

    timeMatch

  ) {

    return `${

      timeMatch[1]

        .padStart(

          2,

          "0"

        )

    }:${
    
      timeMatch[2]

    }`;

  }


  const date =

    new Date(

      value

    );


  if (

    !Number.isNaN(

      date.getTime()

    )

  ) {

    return `${

      String(

        date.getHours()

      )

      .padStart(

        2,

        "0"

      )

    }:${
    
      String(

        date.getMinutes()

      )

      .padStart(

        2,

        "0"

      )

    }`;

  }


  return "";

};
function EditVisitor() {

/* ===============================
NAVIGATION
=============================== */

const navigate =
useNavigate();

const {
id
} = useParams();

/* ===============================
FORM DATA
=============================== */

const [formData,
setFormData] =
useState({


  visitor_name: "",

  mobile: "",

  email: "",

  company_name: "",

  visitor_type: "",

  visitor_type_other: "",

  purpose: "",

  purpose_other: "",

  has_companion: "0",

  companion_name: "",

  companion_mobile: "",



  has_asset: "0",

  employee_id: "",

  visit_date: "",

  check_in: "",

  remarks: "",

  id_proof: "",

  id_proof_number: "",

  visitor_photo: "",

  signature: ""

});


/* ===============================
PHOTO
=============================== */

const [
photoPreview,
setPhotoPreview
] = useState(null);

/* ===============================
EMPLOYEES
=============================== */

const [
employees,
setEmployees
] = useState([]);

/* ===============================
ASSETS
=============================== */

const [
assets,
setAssets
] = useState([]);

const [
showAssetForm,
setShowAssetForm
] = useState(false);

const [
editingAsset,
setEditingAsset
] = useState(null);

const emptyAsset = {


asset_type: "",

asset_name: "",

serial_number: "",

asset_remarks: "",

asset_photo: ""


};

const [
assetForm,
setAssetForm
] = useState(
emptyAsset
);

/* ===============================
LOADING
=============================== */

const [
loading,
setLoading
] = useState(true);



/* ===============================
LOAD EMPLOYEES
=============================== */

useEffect(() => {

const loadEmployees =
  async () => {

    try {

      const response =
        await getEmployees();

      if (
        response.data.success
      ) {

        setEmployees(

          response
            .data
            .employees

        );

      }

    }
    catch (error) {

      console.log(

        "EMPLOYEE LOAD ERROR:",

        error

      );

    }

  };


loadEmployees();


}, []);

/* ===============================
LOAD VISITOR
=============================== */

useEffect(() => {


if (!id) {

  return;

}


const loadVisitor =
  async () => {

    try {

      setLoading(true);


      const response =
        await getVisitorById(
          id
        );


      if (
        !response.data.success
      ) {

        alert(
          "Visitor could not be loaded"
        );

        navigate(
          "/visitors"
        );

        return;

      }


      const visitor =
        response
          .data
          .visitor;
          console.log(
  "FULL VISITOR DATA:",
  visitor
);

/* ===============================
   VISITOR TYPE
=============================== */

const visitorTypes = [

  "Guest",

  "Vendor",

  "Interview",

  "Contractor",

  "Delivery",

  "Consultant",

  "Government",

  "Auditor",
   "Other"

];


const savedVisitorType = String(
  visitor.visitor_type ?? ""
)
.trim();

const isSavedVisitorTypeOther =
  savedVisitorType.toLowerCase() === "other";

const isCustomVisitorType =
  savedVisitorType !== ""
  &&
  !isSavedVisitorTypeOther
  &&
  !visitorTypes.some(
    (type) =>
      type.toLowerCase()
      ===
      savedVisitorType.toLowerCase()
  );


/* ===============================
   PURPOSE
=============================== */

const purposeTypes = [

  "Meeting",

  "Interview",

  "Delivery",

  "Vendor Visit",

  "Training",

  "Maintenance",

  "Audit",
   "Other"

];


const savedPurpose = String(
  visitor.purpose ?? ""
)
.trim();

const isSavedPurposeOther =
  savedPurpose.toLowerCase() === "other";

const isCustomPurpose =
  savedPurpose !== ""
  &&
  !isSavedPurposeOther
  &&
  !purposeTypes.some(
    (purpose) =>
      purpose.toLowerCase()
      ===
      savedPurpose.toLowerCase()
  );
      /* ===============================
         SET FORM DATA
      =============================== */

      setFormData({

        visitor_name:

          visitor.visitor_name
          || "",


        mobile:

          visitor.mobile
          || "",


        email:

          visitor.email
          || "",


        company_name:

          visitor.company_name
          || "",
visitor_type:

  isCustomVisitorType

    ? "Other"

    : savedVisitorType,


visitor_type_other:

  isCustomVisitorType

    ? savedVisitorType

    : "",


purpose:

  isCustomPurpose

    ? "Other"

    : savedPurpose,


purpose_other:

  isCustomPurpose

    ? savedPurpose

    : "",


        has_companion:

          Number(
            visitor.has_companion
          ) === 1

            ? "1"

            : "0",


        companion_name:

          visitor.companion_name
          || "",


        companion_mobile:

          visitor.companion_mobile
          || "",


       


     has_asset:

  Number(
    visitor.has_asset
  ) === 1

    ? "1"

    : "0",


        employee_id:

          visitor.employee_id
          ? String(
              visitor.employee_id
            )
          : "",
  visit_date:
    formatDateForInput(
      visitor.visit_date
    ),


check_in:

  formatTimeForInput(

    visitor.check_in
    ||
    visitor.visit_time
    ||
    visitor.visiting_time
    ||
    visitor.check_in_time

  ),
        remarks:

          visitor.remarks
          || "",


        id_proof:

          visitor.id_proof
          || "",


        id_proof_number:

          visitor.id_proof_number
          || "",


        visitor_photo:

          visitor.visitor_photo
          || "",


        signature:

          visitor.signature
          || ""

      });


      /* ===============================
         PHOTO PREVIEW
      =============================== */

      setPhotoPreview(

        visitor.visitor_photo
        || null

      );

  /* ===============================
         LOAD EXISTING ASSETS
      =============================== */

     
/* ===============================
   LOAD EXISTING ASSETS
=============================== */

const loadedAssets =

  Array.isArray(
    visitor.assets
  )

    ?

    visitor.assets.map(

      (
        asset
      ) => ({

        id:

          asset.id
          || null,


        asset_type:

          asset.asset_type
          || "",


        asset_name:

          asset.asset_name
          || "",


        quantity:

          Number(
            asset.quantity
          ) || 1,


        serial_number:

          asset.serial_number
          || "",


        asset_remarks:

          asset.asset_remarks

          ||

          asset.remarks

          ||

          "",


        asset_photo:

          asset.asset_photo
          || ""

      })

    )

    :

    [];


setAssets(
  loadedAssets
);

    }
    catch (error) {

      console.log(

        "VISITOR LOAD ERROR:",

        error

      );


      alert(
        "Failed to load visitor details"
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

navigate


]);

/* ===============================
NORMAL FORM CHANGE
=============================== */

const handleChange =
(event) => {


  const {

    name,

    value

  } = event.target;


  setFormData(

    (
      previous
    ) => ({

      ...previous,

      [name]:

        value

    })

  );


  /* ===============================
     CLEAR COMPANION
  =============================== */

  if (

    name ===
    "has_companion"

    &&

    value === "0"

  ) {

    setFormData(

      (
        previous
      ) => ({

        ...previous,

        has_companion:

          "0",

        companion_name:

          "",

        companion_mobile:

          ""

       

      })

    );

  }


  /* ===============================
     CLEAR ASSETS
  =============================== */

  if (

    name ===
    "has_asset"

    &&

    value === "0"

  ) {

    setAssets(
      []
    );

  }

};


/* ===============================
MOBILE CHANGE
=============================== */

const handleMobileChange =
(
event,
fieldName
) => {


  const value =

    event.target.value

      .replace(

        /\D/g,

        ""

      )

      .slice(

        0,

        10

      );


  setFormData(

    (
      previous
    ) => ({

      ...previous,

      [fieldName]:

        value

    })

  );

};


/* ===============================
PHOTO UPLOAD
=============================== */

const handlePhotoUpload =
(
event
) => {


  const file =

    event.target.files[0];


  if (!file) {

    return;

  }


  const reader =
    new FileReader();


  reader.onloadend =
    () => {

      setPhotoPreview(

        reader.result

      );


      setFormData(

        (
          previous
        ) => ({

          ...previous,

          visitor_photo:

            reader.result

        })

      );

    };


  reader.readAsDataURL(
    file
  );

};


/* ===============================
ASSET INPUT
=============================== */

const handleAssetInput =
(
event
) => {

  const {

    name,

    value,

    files

  } = event.target;


  if (

    name ===
    "asset_photo"

  ) {

    const file =
      files[0];


    if (!file) {

      return;

    }


    const reader =
      new FileReader();


    reader.onloadend =
      () => {

        setAssetForm(

          (
            previous
          ) => ({

            ...previous,

            asset_photo:

              reader.result

          })

        );

      };


    reader.readAsDataURL(
      file
    );


    return;

  }


  setAssetForm(

    (
      previous
    ) => ({

      ...previous,

      [name]:

        value

    })

  );

};


/* ===============================
SAVE ASSET
=============================== */

const saveAsset =
() => {

  const errors = [];


  if (

    !assetForm
      .asset_type
      .trim()

  ) {

    errors.push(

      "• Please select asset type"

    );

  }


  if (

    !assetForm
      .asset_name
      .trim()

  ) {

    errors.push(

      "• Please enter asset name"

    );

  }


  if (

    !assetForm
      .serial_number
      .trim()

  ) {

    errors.push(

      "• Please enter serial number"

    );

  }


  if (

    errors.length > 0

  ) {

    alert(

      "Please fill the following fields:\n\n"

      +

      errors.join(
        "\n"
      )

    );

    return;

  }


  if (

    editingAsset !==
    null

  ) {

    const updatedAssets =

      [
        ...assets
      ];


    updatedAssets[
      editingAsset
    ] = {

      ...assetForm

    };


    setAssets(
      updatedAssets
    );

  }
  else {

    setAssets(

      (
        previous
      ) => [

        ...previous,

        {

          ...assetForm

        }

      ]

    );

  }


  setAssetForm(
    emptyAsset
  );


  setEditingAsset(
    null
  );


  setShowAssetForm(
    false
  );

};


/* ===============================
EDIT ASSET
=============================== */

const editAsset =
(
index
) => {

  setEditingAsset(
    index
  );


  setAssetForm({

    ...assets[index]

  });


  setShowAssetForm(
    true
  );

};

/* ===============================
DELETE ASSET
=============================== */

const deleteAsset =
(
index
) => {


  const confirmed =

    window.confirm(

      "Delete this asset?"

    );


  if (!confirmed) {

    return;

  }


  setAssets(

    (
      previous
    ) =>

      previous.filter(

        (
          _,

          currentIndex

        ) =>

          currentIndex
          !==
          index

      )

  );

};


/* ===============================
SUBMIT
=============================== */

const handleSubmit =
async (
event
) => {


  event.preventDefault();


  /* ===============================
     VALIDATE MOBILE
  =============================== */

  if (

    formData.mobile

    &&

    formData.mobile.length
    !==
    10

  ) {

    alert(

      "Please enter a valid 10 digit mobile number."

    );

    return;

  }


  /* ===============================
     VALIDATE COMPANION
  =============================== */

  if (

    formData
      .has_companion
    ===
    "1"

    &&

    formData
      .companion_mobile

    &&

    formData
      .companion_mobile
      .length
    !==
    10

  ) {

    alert(

      "Please enter a valid companion mobile number."

    );

    return;

  }


  /* ===============================
     VALIDATE EMAIL
  =============================== */

  if (

    formData.email

    &&

    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/

      .test(

        formData.email

      )

  ) {

    alert(

      "Please enter a valid email address."

    );

    return;

  }


  /* ===============================
     VALIDATE ASSETS
  =============================== */

  if (

    Number(
      formData.has_asset
    ) === 1

    &&

    assets.length === 0

  ) {

    alert(

      "Please add at least one asset."

    );

    return;

  }


  /* ===============================
     PREPARE DATA
  =============================== */

  const visitorData = {

    ...formData,


    visitor_type:

      formData
        .visitor_type
      ===
      "Other"

        ? (
            formData
              .visitor_type_other
              .trim()
          )

        : formData
            .visitor_type,


    purpose:

      formData
        .purpose
      ===
      "Other"

        ? (
            formData
              .purpose_other
              .trim()
          )

        : formData
            .purpose,


    assets:

      Number(
        formData
          .has_asset
      ) === 1

        ? assets

        : []

  };


  try {

    const response =

      await updateVisitor(

        id,

        visitorData

      );


    if (

      response
        .data
        .success

    ) {

      alert(

        response
          .data
          .message

        ||

        "Visitor Updated Successfully"

      );


      navigate(

        "/visitors"

      );

    }

  }
  catch (error) {

    console.log(

      "UPDATE ERROR:",

      error

    );


    alert(

      error
        ?.response
        ?.data
        ?.message

      ||

      "Failed to update visitor"

    );

  }

};


/* ===============================
LOADING SCREEN
=============================== */

if (loading) {


return (

  <div
    className=
    "visitor-page"
  >

    <div
      className=
      "visitor-main-form"
    >

      Loading visitor details...

    </div>

  </div>

);


}

/* ===============================
JSX
=============================== */

return (


<div
  className=
  "visitor-page"
>


  {/* ===============================
     HEADER
  =============================== */}

  <div
    className=
    "visitor-hero"
  >

    <h1>

      Edit Visitor

    </h1>

    <p>

      Update visitor details,
      assets and visit information

    </p>

  </div>


  <form

    onSubmit={
      handleSubmit
    }

    className=
    "visitor-main-form"

  >


    {/* ===============================
       VISITOR IDENTITY
    =============================== */}

    <div
      className=
      "form-section"
    >

      <h3>

        <FaIdCard
          className=
          "section-icon"
        />

        Visitor Identity

      </h3>


      <div
        className=
        "identity-grid"
      >


        {/* PHOTO */}

        <div
          className=
          "photo-box"
        >

          {

            photoPreview

            ?

            <img

              src={
                photoPreview
              }

              alt=
              "Visitor"

            />

            :

            <div
              className=
              "photo-placeholder"
            >

              <FaCamera
                size={40}
              />

              <p>

                Upload Photo

              </p>

            </div>

          }


          <input

            type="file"

            accept="image/*"

            onChange={
              handlePhotoUpload
            }

          />

        </div>


        {/* ID DETAILS */}

        <div
          className=
          "id-proof-box"
        >


          <div
            className=
            "id-proof-field"
          >

            <label>

              ID Proof Type

            </label>


            <select

              name=
              "id_proof"

              value={
                formData
                  .id_proof
              }

              onChange={
                handleChange
              }

            >

              <option value="">

                Select ID Proof

              </option>

              <option value="Aadhar">

                Aadhar Card

              </option>

              <option value="PAN">

                PAN Card

              </option>

              <option
                value=
                "Driving License"
              >

                Driving License

              </option>

              <option
                value=
                "Passport"
              >

                Passport

              </option>

            </select>

          </div>


          <div
            className=
            "id-proof-field"
          >

            <label>

              {

                formData
                  .id_proof

                ||

                "ID"

              }

              {" "}Number

            </label>


            <input

              type="text"

              name=
              "id_proof_number"

              value={
                formData
                  .id_proof_number
              }

              onChange={
                handleChange
              }

              placeholder={

                `Enter ${
                  formData
                    .id_proof
                  ||
                  "ID"
                } Number`

              }

            />

          </div>


          <div
            className=
            "id-proof-field"
          >

            <label>

              <FaIdCard />

              Visitor Type

            </label>


            <select

              name=
              "visitor_type"

              value={
                formData
                  .visitor_type
              }

              onChange={
                handleChange
              }

              required

            >

              <option value="">

                Select Visitor Type

              </option>

              <option value="Guest">

                Guest

              </option>

              <option value="Vendor">

                Vendor

              </option>

              <option value="Interview">

                Interview Candidate

              </option>

              <option
                value=
                "Contractor"
              >

                Contractor

              </option>

              <option value="Delivery">

                Delivery

              </option>

              <option
                value=
                "Consultant"
              >

                Consultant

              </option>

              <option
                value=
                "Government"
              >

                Government Officer

              </option>

              <option value="Auditor">

                Auditor

              </option>

              <option value="Other">

                Other

              </option>

            </select>

          </div>


          {

            formData
              .visitor_type
            ===
            "Other"

            &&

            <div
              className=
              "id-proof-field"
            >

              <label>

                Specify Visitor Type

              </label>


              <input

                type="text"

                name=
                "visitor_type_other"

                value={
                  formData
                    .visitor_type_other
                }

                onChange={
                  handleChange
                }

                placeholder=
                "Enter Visitor Type"

                required

              />

            </div>

          }

        </div>

      </div>

    </div>


    {/* ===============================
       VISITOR INFORMATION
    =============================== */}

    <div
      className=
      "form-section"
    >

      <h3>

        <FaUser
          className=
          "section-icon"
        />

        Visitor Information

      </h3>


      <div
        className=
        "form-grid"
      >


        <div
          className=
          "form-group"
        >

          <label>

            <FaUser />

            Visitor Name

          </label>


          <input

            type="text"

            name=
            "visitor_name"

            value={
              formData
                .visitor_name
            }

            onChange={
              handleChange
            }

            placeholder=
            "Enter Visitor Name"

            required

          />

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            <FaPhone />

            Mobile Number

          </label>


          <input

            type="tel"

            value={
              formData
                .mobile
            }

            onChange={

              (
                event
              ) =>

                handleMobileChange(

                  event,

                  "mobile"

                )

            }

            placeholder=
            "Enter Mobile Number"

            required

          />

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            <FaEnvelope />

            Email Address

          </label>


          <input

            type="email"

            name="email"

            value={
              formData
                .email
            }

            onChange={
              handleChange
            }

            placeholder=
            "Enter Email Address"

          />

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            <FaBuilding />

            Company

          </label>


          <input

            type="text"

            name=
            "company_name"

            value={
              formData
                .company_name
            }

            onChange={
              handleChange
            }

            placeholder=
            "Enter Company Name"

          />

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            <FaUserTie />

            Person To Meet

          </label>


          <select

            name=
            "employee_id"

            value={
              formData
                .employee_id
            }

            onChange={
              handleChange
            }

            required

          >

            <option value="">

              Select Employee

            </option>


            {

              employees.map(

                (
                  employee
                ) => (

                  <option

                    key={
                      employee.id
                    }

                    value={
                      employee.id
                    }

                  >

                    {

                      employee
                        .employee_name

                    }

                    {" - "}

                    {

                      employee
                        .department

                    }

                  </option>

                )

              )

            }

          </select>

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            <FaClipboardList />

            Purpose

          </label>


          <select

            name=
            "purpose"

            value={
              formData
                .purpose
            }

            onChange={
              handleChange
            }

          >

            <option value="">

              Select Purpose

            </option>

            <option value="Meeting">

              Meeting

            </option>

            <option value="Interview">

              Interview

            </option>

            <option value="Delivery">

              Delivery

            </option>

            <option
              value=
              "Vendor Visit"
            >

              Vendor Visit

            </option>

            <option value="Training">

              Training

            </option>

            <option
              value=
              "Maintenance"
            >

              Maintenance

            </option>

            <option value="Audit">

              Audit

            </option>

            <option value="Other">

              Other

            </option>

          </select>

        </div>


        {

          formData.purpose
          ===
          "Other"

          &&

          <div
            className=
            "form-group"
          >

            <label>

              Specify Purpose

            </label>


            <input

              type="text"

              name=
              "purpose_other"

              value={
                formData
                  .purpose_other
              }

              onChange={
                handleChange
              }

              placeholder=
              "Enter Purpose"

              required

            />

          </div>

        }

      </div>

    </div>


    {/* ===============================
       COMPANION
    =============================== */}

    <div
      className=
      "form-section"
    >

      <h3>

        <FaUsers
          className=
          "section-icon"
        />

        Companion Details

      </h3>


      <div
        className=
        "form-grid"
      >


        <div
          className=
          "form-group"
        >

          <label>

            Is someone accompanying?

          </label>


          <select

            name=
            "has_companion"

            value={
              formData
                .has_companion
            }

            onChange={
              handleChange
            }

          >

            <option value="0">

              No

            </option>

            <option value="1">

              Yes

            </option>

          </select>

        </div>


        {

          formData
            .has_companion
          ===
          "1"

          &&

          <>

            <div
              className=
              "form-group"
            >

              <label>

                Companion Name

              </label>


              <input

                type="text"

                name=
                "companion_name"

                value={
                  formData
                    .companion_name
                }

                onChange={
                  handleChange
                }

                required

              />

            </div>


            <div
              className=
              "form-group"
            >

              <label>

                Companion Mobile

              </label>


              <input

                type="tel"

                value={
                  formData
                    .companion_mobile
                }

                onChange={

                  (
                    event
                  ) =>

                    handleMobileChange(

                      event,

                      "companion_mobile"

                    )

                }

                required

              />

            </div>





             

           

          </>

        }

      </div>

    </div>


    {/* ===============================
       ASSETS
    =============================== */}

    <div
      className=
      "form-section"
    >

      <div
        className=
        "section-header"
      >

        <h3>

          <FaLaptop
            className=
            "section-icon"
          />

          Asset Information

        </h3>


        {

          Number(

            formData
              .has_asset

          ) === 1

          &&

          <button

            type="button"

            className=
            "add-asset-btn"

            onClick={
              () => {

                setEditingAsset(
                  null
                );

                setAssetForm(
                  emptyAsset
                );

                setShowAssetForm(
                  true
                );

              }
            }

          >

            <FaPlus />

            Add Asset

          </button>

        }

      </div>


      <div
        className=
        "form-grid"
      >

        <div
          className=
          "form-group"
        >

          <label>

            Are you carrying assets?

          </label>


          <select

            name=
            "has_asset"

            value={
              formData
                .has_asset
            }

            onChange={
              handleChange
            }

          >

            <option value="0">

              No

            </option>

            <option value="1">

              Yes

            </option>

          </select>

        </div>

      </div>


      {

        Number(

          formData
            .has_asset

        ) === 1

        &&

        <div
          className=
          "asset-list"
        >

          {

            assets.length === 0

            ?

            <p
              className=
              "no-asset"
            >

              No assets have been added.

              <br />

              Click

              {" "}

              <strong>

                Add Asset

              </strong>

              {" "}

              to continue.

            </p>

            :

            assets.map(

              (
                asset,

                index

              ) => (

                <div

                  className=
                  "asset-card"

                  key={

                    asset.id

                    ||

                    index

                  }

                >

                  <div
                    className=
                    "asset-image"
                  >

                    {

                      asset
                        .asset_photo

                      ?

                      <img

                        src={
                          asset
                            .asset_photo
                        }

                        alt=
                        "Asset"

                      />

                      :

                      <div
                        className=
                        "no-image"
                      >

                        <FaBoxOpen
                          size={28}
                        />

                        <p>

                          No Photo

                        </p>

                      </div>

                    }

                  </div>


                  <div
                    className=
                    "asset-info"
                  >

                    <h4>

                      {

                        asset
                          .asset_type

                      }

                    </h4>


                    <p>

                      {

                        asset
                          .asset_name

                      }

                    </p>


                    <small>

                      Serial Number:

                      {" "}

                      {

                        asset
                          .serial_number

                        ||

                        "-"

                      }

                    </small>


                    {

                      asset
                        .asset_remarks

                      &&

                      <div
                        className=
                        "asset-remarks"
                      >

                        {

                          asset
                            .asset_remarks

                        }

                      </div>

                    }

                  </div>


                  <div
                    className=
                    "asset-actions"
                  >

                    <button

                      type="button"

                      className=
                      "edit-btn"

                      onClick={
                        () =>

                          editAsset(
                            index
                          )
                      }

                    >

                      <FaEdit />

                    </button>


                    <button

                      type="button"

                      className=
                      "delete-btn"

                      onClick={
                        () =>

                          deleteAsset(
                            index
                          )
                      }

                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>

              )

            )

          }

        </div>

      }

    </div>


    {/* ===============================
       ASSET POPUP
    =============================== */}

    {

      showAssetForm

      &&

      <div
        className=
        "asset-popup-overlay"
      >

        <div
          className=
          "asset-popup"
        >

          <h3>

            {

              editingAsset
              !==
              null

              ?

              "Edit Asset"

              :

              "Add New Asset"

            }

          </h3>


          <div
            className=
            "form-grid"
          >


            <div
              className=
              "form-group"
            >

              <label>

                Asset Type

              </label>


              <select

                name=
                "asset_type"

                value={
                  assetForm
                    .asset_type
                }

                onChange={
                  handleAssetInput
                }

              >

                <option value="">

                  Select Asset

                </option>

                <option value="Laptop">

                  Laptop

                </option>

                <option value="Mobile">

                  Mobile

                </option>

                <option value="Tablet">

                  Tablet

                </option>

                <option value="Camera">

                  Camera

                </option>

                <option value="Pendrive">

                  Pendrive

                </option>

                <option
                  value=
                  "Hard Disk"
                >

                  Hard Disk

                </option>

                <option value="Other">

                  Other

                </option>

              </select>

            </div>


            <div
              className=
              "form-group"
            >

              <label>

                Asset Name

              </label>


              <input

                type="text"

                name=
                "asset_name"

                value={
                  assetForm
                    .asset_name
                }

                onChange={
                  handleAssetInput
                }

              />

            </div>


            <div
              className=
              "form-group"
            >

              <label>

                Serial Number

              </label>


              <input

                type="text"

                name=
                "serial_number"

                value={
                  assetForm
                    .serial_number
                }

                onChange={
                  handleAssetInput
                }

              />

            </div>


            <div
              className=
              "form-group"
            >

              <label>

                Asset Photo

              </label>


              <input

                type="file"

                accept=
                "image/*"

                name=
                "asset_photo"

                onChange={
                  handleAssetInput
                }

              />


              {

                assetForm
                  .asset_photo

                &&

                <img

                  src={
                    assetForm
                      .asset_photo
                  }

                  alt=
                  "Preview"

                  className=
                  "asset-preview"

                />

              }

            </div>


            <div
              className=
              "form-group full-width"
            >

              <label>

                Remarks

              </label>


              <textarea

                rows="3"

                name=
                "asset_remarks"

                value={
                  assetForm
                    .asset_remarks
                }

                onChange={
                  handleAssetInput
                }

              />

            </div>

          </div>


          <div
            className=
            "popup-buttons"
          >

            <button

              type="button"

              onClick={
                saveAsset
              }

            >

              Save Asset

            </button>


            <button

              type="button"

              onClick={
                () => {

                  setShowAssetForm(
                    false
                  );

                  setEditingAsset(
                    null
                  );

                  setAssetForm(
                    emptyAsset
                  );

                }
              }

            >

              Cancel

            </button>

          </div>

        </div>

      </div>

    }


    {/* ===============================
       VISIT SCHEDULE
    =============================== */}

    <div
      className=
      "form-section"
    >

      <h3>

        <FaCalendarAlt
          className=
          "section-icon"
        />

        Visit Schedule

      </h3>


      <div
        className=
        "form-grid visit-grid"
      >


        <div
          className=
          "form-group"
        >

          <label>

            Visit Date

          </label>


          <input

            type="date"

            name=
            "visit_date"

            value={
              formData
                .visit_date
            }

            onChange={
              handleChange
            }

            required

          />

        </div>


        <div
          className=
          "form-group"
        >

          <label>

            Visiting Time

          </label>


          <input

            type="time"

            name=
            "check_in"

            value={
              formData
                .check_in
            }

            onChange={
              handleChange
            }

          />

        </div>


        <div
          className=
          "form-group remarks-group"
        >

          <label>

            Remarks

          </label>


          <textarea

            rows="3"

            name=
            "remarks"

            value={
              formData
                .remarks
            }

            onChange={
              handleChange
            }

            placeholder=
            "Additional notes"

          />

        </div>

      </div>

    </div>


    {/* ===============================
       SIGNATURE
    =============================== */}

    <div
      className=
      "signature-section"
    >

      <h3>

        <FaSignature
          className=
          "section-icon"
        />

        Visitor Signature

      </h3>


      {

        formData
          .signature

        ?

        <div
          className=
          "signature-box"
        >

          <img

            src={
              formData
                .signature
            }

            alt=
            "Visitor Signature"

            style={{

              maxWidth:

                "100%",

              maxHeight:

                "180px",

              objectFit:

                "contain"

            }}

          />

        </div>

        :

        <p>

          No signature available.

        </p>

      }

    </div>


    {/* ===============================
       ACTIONS
    =============================== */}

    <div
      className=
      "form-actions"
    >

      <button

        type="button"

        className=
        "cancel-btn"

        onClick={
          () =>

            navigate(
              "/visitors"
            )
        }

      >

        Cancel

      </button>


      <button

        type="submit"

        className=
        "save-btn"

      >

        Update Visitor

      </button>

    </div>

  </form>

</div>


);

}

export default EditVisitor;
