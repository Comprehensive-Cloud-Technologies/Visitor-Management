import pool from "../config/db.js";
import process from "process";
/* GET ALL VISITORS */
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { addNotification }
from "./notificationController.js";
import {
  generateVisitorPass
}
from "../services/pdfService.js";

import {
  sendVisitorApprovedMail,
  sendVisitorRejectedMail,
  sendVisitorApprovalMail,
  sendVisitorArrivedMail,
  sendVisitorCheckedOutMail
}
from "../services/mailService.js";

/* ==========================================
   GET COMPANY ID FROM REQUEST
========================================== */

const getCompanyId = (req) => {

  const companyId =
    req.headers["x-company-id"];

  if (!companyId) {

    return null;

  }

  return Number(companyId);

};
/* ==========================================
   GET ALL VISITORS
   COMPANY-WISE
========================================== */

export const getVisitors = async (
  req,
  res
) => {

  try {

    const companyId =
      getCompanyId(req);

    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }

    const [visitors] =
      await pool.execute(

        `
        SELECT

          v.*,

          e.employee_name

        FROM visitors v

        LEFT JOIN employees e

          ON v.employee_id = e.id

          AND e.company_id = ?

        WHERE

          v.company_id = ?

        ORDER BY

          v.id DESC
        `,

        [

          companyId,

          companyId

        ]

      );

    res.json({

      success: true,

      visitors

    });

  }
  catch (error) {

    console.log(
      "GET VISITORS ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};
/* ==========================================
   GET SINGLE VISITOR
   COMPANY-WISE
========================================== */
export const getVisitorById = async (
req,
res
) => {

try {


const companyId =
  getCompanyId(req);

const {
  id
} = req.params;


/* ===============================
   VALIDATE COMPANY
=============================== */

if (!companyId) {

  return res.status(400).json({

    success: false,

    message:
      "Company ID is required"

  });

}


/* ===============================
   VISITOR DETAILS
=============================== */

const [visitorRows] =
  await pool.execute(

    `
    SELECT

      v.*,

      DATE_FORMAT(
        v.visit_date,
        '%Y-%m-%d'
      )
      AS formatted_visit_date,

      TIME_FORMAT(
        v.check_in,
        '%H:%i'
      )
      AS formatted_check_in,

      e.employee_name,

      e.employee_code,

      e.department,

      e.designation,

      e.email
      AS employee_email,

      e.mobile
      AS employee_mobile,

      e.warehouse

    FROM visitors v

    LEFT JOIN employees e

      ON v.employee_id = e.id

      AND e.company_id = ?

    WHERE

      v.id = ?

      AND v.company_id = ?
    `,

    [

      companyId,

      id,

      companyId

    ]

  );


/* ===============================
   VISITOR NOT FOUND
=============================== */

if (
  visitorRows.length === 0
) {

  return res.status(404).json({

    success: false,

    message:
      "Visitor Not Found"

  });

}


/* ===============================
   GET VISITOR
=============================== */

const visitor =
  visitorRows[0];


/* ===============================
   SET DATE FOR HTML DATE INPUT
=============================== */

visitor.visit_date =

  visitor.formatted_visit_date

  ||

  "";


/* ===============================
   SET TIME FOR HTML TIME INPUT
=============================== */

visitor.check_in =

  visitor.formatted_check_in

  ||

  "";


/* ===============================
   REMOVE TEMPORARY FIELDS
=============================== */

delete visitor.formatted_visit_date;

delete visitor.formatted_check_in;


/* ===============================
   VISITOR ASSETS
=============================== */

const [assets] =
  await pool.execute(

    `
    SELECT

      id,

      asset_type,

      asset_name,

      quantity,

      serial_number,

      remarks
      AS asset_remarks,

      asset_photo

    FROM visitor_assets

    WHERE

      visitor_id = ?

    ORDER BY

      id ASC
    `,

    [

      id

    ]

  );


/* ===============================
   ATTACH ASSETS
=============================== */

visitor.assets =
  assets;


/* ===============================
   SUCCESS RESPONSE
=============================== */

return res.json({

  success: true,

  visitor

});


}
catch (error) {


console.log(

  "GET VISITOR ERROR:",

  error

);


return res.status(500).json({

  success: false,

  message:
    "Server Error"

});


}

};


/* ADD VISITOR */
/* ==========================================
   ADD VISITOR
   COMPANY-WISE
========================================== */

export const addVisitor = async (
req,
res
) => {

const connection =
await pool.getConnection();

let transactionStarted =
false;

try {


/* ===============================
   GET COMPANY ID
=============================== */

const companyId =
  getCompanyId(req);

if (!companyId) {

  return res.status(400).json({

    success: false,

    message:
      "Company ID is required"

  });

}


/* ===============================
   GET REQUEST DATA
=============================== */

const {

  visitor_name,

  mobile,

  email,

  company_name,

  visitor_type,
  visitor_type_other,

  has_companion,

  companion_name,

  companion_mobile,

  companion_relationship,

  has_asset,

  assets,

  purpose,
  purpose_other,

  status,

  employee_id,

  visit_date,

  check_in,

  remarks,

  id_proof,

  id_proof_number,

  visitor_photo,

  signature

} = req.body;


/* ===============================
   FORMAT DATE
=============================== */

const formattedVisitDate =

  visit_date

    ?

    String(
      visit_date
    )

    .trim()

    .split(
      "T"
    )[0]

    :

    null;


/* ===============================
   FORMAT TIME
=============================== */

const formattedCheckIn =

  check_in

    ?

    String(
      check_in
    )

    .trim()

    .slice(
      0,
      5
    )

    :

    null;


/* ===============================
   REQUIRED VALIDATION
=============================== */

if (

  !visitor_name?.trim()

  ||

  !mobile?.trim()

  ||

  !visitor_type?.trim()

  ||

  !employee_id

  ||

  !formattedVisitDate

) {

  return res.status(400).json({

    success: false,

    message:
      "Please fill all required visitor details"

  });

}


/* ===============================
   EMAIL VALIDATION
=============================== */

if (
  email?.trim()
) {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (

    !emailRegex.test(
      email.trim()
    )

  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid visitor email format"

    });

  }

}


/* ===============================
   START TRANSACTION
=============================== */

await connection.beginTransaction();

transactionStarted =
  true;


/* ===============================
   GET EMPLOYEE
   COMPANY-WISE
=============================== */

const [
  employee
] =

  await connection.execute(

    `
    SELECT

      id,

      employee_name,

      email

    FROM employees

    WHERE

      id = ?

      AND company_id = ?

    `,

    [

      employee_id,

      companyId

    ]

  );


/* ===============================
   EMPLOYEE NOT FOUND
=============================== */

if (
  employee.length === 0
) {

  await connection.rollback();

  transactionStarted =
    false;

  return res.status(404).json({

    success: false,

    message:
      "Selected employee was not found in your company"

  });

}


const person_to_meet =

  employee[0]
    .employee_name;

/* ===============================
   FINAL VISITOR TYPE
=============================== */

const finalVisitorType =

  visitor_type === "Other"

    ? visitor_type_other?.trim()

    : visitor_type;


/* ===============================
   FINAL PURPOSE
=============================== */

const finalPurpose =

  purpose === "Other"

    ? purpose_other?.trim()

    : purpose;


/* ===============================
   VALIDATE OTHER VALUES
=============================== */

if (

  visitor_type === "Other"

  &&

  !visitor_type_other?.trim()

) {

  await connection.rollback();

  return res.status(400).json({

    success: false,

    message:
      "Please specify the visitor type"

  });

}


if (

  purpose === "Other"

  &&

  !purpose_other?.trim()

) {

  await connection.rollback();

  return res.status(400).json({

    success: false,

    message:
      "Please specify the purpose"

  });

}
/* ===============================
   INSERT VISITOR
   COMPANY-WISE
=============================== */


/* ===============================
   INSERT VISITOR
   COMPANY-WISE
=============================== */

const [
  result
] =

  await connection.execute(

    `
    INSERT INTO visitors
    (

      company_id,

      visitor_name,

      mobile,

      email,

      company_name,

      visitor_type,

      has_companion,

      companion_name,

      companion_mobile,

      companion_relationship,

      has_asset,

      purpose,

      employee_id,

      person_to_meet,

      visit_date,

      check_in,

      remarks,

      status,

      id_proof,

      id_proof_number,

      visitor_photo,

      signature

    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
    `,

    [

      companyId,

      visitor_name.trim(),

      mobile.trim(),

      email?.trim()
        || null,

      company_name?.trim()
        || null,


      /* SAVE CUSTOM VISITOR TYPE */

      finalVisitorType
        || null,


      /* HAS COMPANION */

      Number(
        has_companion
      ) === 1

        ? 1

        : 0,


      /* COMPANION NAME */

      Number(
        has_companion
      ) === 1

        ?

        companion_name?.trim()
        || null

        :

        null,


      /* COMPANION MOBILE */

      Number(
        has_companion
      ) === 1

        ?

        companion_mobile?.trim()
        || null

        :

        null,


      /* COMPANION RELATIONSHIP */

      Number(
        has_companion
      ) === 1

        ?

        companion_relationship?.trim()
        || null

        :

        null,


      /* HAS ASSET */

      Number(
        has_asset
      ) === 1

        ? 1

        : 0,


      /* SAVE CUSTOM PURPOSE */

      finalPurpose
        || null,


      employee_id,

      person_to_meet,

      formattedVisitDate,

      formattedCheckIn,

      remarks?.trim()
        || null,

      status
        || "PENDING",

      id_proof
        || null,

      id_proof_number?.trim()
        || null,

      visitor_photo
        || null,

      signature
        || null

    ]

  );


const visitorId =
  result.insertId;


/* ===============================
   INSERT VISITOR ASSETS
=============================== */

if (

  Number(
    has_asset
  ) === 1

  &&

  Array.isArray(
    assets
  )

  &&

  assets.length > 0

) {

  for (
    const asset
    of assets
  ) {

    await connection.execute(

      `
      INSERT INTO visitor_assets
      (

        visitor_id,

        asset_type,

        asset_name,

        quantity,

        serial_number,

        remarks,

        created_at,

        asset_photo

      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
      `,

      [

        visitorId,

        asset.asset_type
          ?.trim()
          || null,

        asset.asset_name
          ?.trim()
          || null,

        Number(
          asset.quantity
        ) > 0

          ?

          Number(
            asset.quantity
          )

          :

          1,

        asset.serial_number
          ?.trim()
          || null,

        asset.asset_remarks
          ?.trim()

          ||

        asset.remarks
          ?.trim()

          ||

        null,

        new Date(),

        asset.asset_photo
          || null

      ]

    );

  }

}


/* ===============================
   COMMIT DATABASE DATA
=============================== */

await connection.commit();

transactionStarted =
  false;


/* ===============================
   CREATE NOTIFICATION
=============================== */

await addNotification(

  "New Visitor Request",

  `${visitor_name} requested a visit`,

  visitorId

);


/* ===============================
   SEND APPROVAL EMAIL
=============================== */

await sendVisitorApprovalMail(

  employee[0].email,

  employee[0].employee_name,

  {

    visitor_name,

    company_name,

    email,

    purpose,

    visit_date:
      formattedVisitDate,

    check_in:
      formattedCheckIn,

    visitor_photo,

    signature

  },

  visitorId

);


/* ===============================
   SUCCESS RESPONSE
=============================== */

return res.status(201).json({

  success: true,

  visitor_id:
    visitorId,

  message:
    "Visitor Added Successfully (PENDING approval)"

});


}
catch (error) {

if (
  transactionStarted
) {

  try {

    await connection.rollback();

  }
  catch {

    // Ignore rollback error.

  }

}


console.log(

  "ADD VISITOR ERROR:",

  error

);


return res.status(500).json({

  success: false,

  message:
    "Unable to add visitor"

});


}
finally {


connection.release();


}

};

/* UPDATE VISITOR */

/* ==========================================
UPDATE VISITOR
COMPANY-WISE
========================================== */

export const updateVisitor = async (
req,
res
) => {

const connection =
await pool.getConnection();

let transactionStarted =
false;

try {

/* ===============================
   GET COMPANY ID
=============================== */

const companyId =
  getCompanyId(req);

if (!companyId) {

  return res.status(400).json({

    success: false,

    message:
      "Company ID is required"

  });

}


/* ===============================
   GET VISITOR ID
=============================== */

const {
  id
} = req.params;


/* ===============================
   GET REQUEST DATA
=============================== */

const {

  visitor_name,

  mobile,

  email,

  visitor_photo,

  company_name,

  visitor_type,

  visitor_type_other,

  has_companion,

  companion_name,

  companion_mobile,

  companion_relationship,

  has_asset,

  assets,

  purpose,

  purpose_other,

  employee_id,

  visit_date,

  check_in,

  remarks,

  id_proof,

  id_proof_number

} = req.body;


/* ===============================
   PREPARE VISITOR TYPE
=============================== */

const finalVisitorType =

  String(
    visitor_type || ""
  ).trim()
  ===
  "Other"

    ?

    String(
      visitor_type_other || ""
    ).trim()

    :

    String(
      visitor_type || ""
    ).trim();


/* ===============================
   PREPARE PURPOSE
=============================== */

const finalPurpose =

  String(
    purpose || ""
  ).trim()
  ===
  "Other"

    ?

    String(
      purpose_other || ""
    ).trim()

    :

    String(
      purpose || ""
    ).trim();


/* ===============================
   REQUIRED VALIDATION
=============================== */

if (

  !visitor_name?.trim()

  ||

  !mobile?.trim()

  ||

  !finalVisitorType

  ||

  !employee_id

  ||

  !visit_date

) {

  return res.status(400).json({

    success: false,

    message:
      "Please fill all required visitor details"

  });

}


/* ===============================
   EMAIL VALIDATION
=============================== */

if (
  email?.trim()
) {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (

    !emailRegex.test(
      email.trim()
    )

  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid visitor email format"

    });

  }

}


/* ===============================
   FORMAT DATE
=============================== */

const formattedDate =

  String(
    visit_date
  )

  .trim()

  .split(
    "T"
  )[0];


/* ===============================
   FORMAT TIME
=============================== */

const formattedTime =

  check_in

    ?

    String(
      check_in
    )

    .trim()

    .slice(
      0,
      5
    )

    :

    null;


/* ===============================
   START TRANSACTION
=============================== */

await connection.beginTransaction();

transactionStarted =
  true;


/* ===============================
   CHECK VISITOR
=============================== */

const [
  existingVisitor
] =

  await connection.execute(

    `
    SELECT
      id
    FROM visitors
    WHERE
      id = ?
      AND company_id = ?
    `,

    [

      id,

      companyId

    ]

  );


if (
  existingVisitor.length === 0
) {

  await connection.rollback();

  transactionStarted =
    false;

  return res.status(404).json({

    success: false,

    message:
      "Visitor not found"

  });

}


/* ===============================
   GET EMPLOYEE
=============================== */

const [
  employee
] =

  await connection.execute(

    `
    SELECT

      id,

      employee_name

    FROM employees

    WHERE

      id = ?

      AND company_id = ?

    `,

    [

      employee_id,

      companyId

    ]

  );


if (
  employee.length === 0
) {

  await connection.rollback();

  transactionStarted =
    false;

  return res.status(404).json({

    success: false,

    message:
      "Selected employee was not found in your company"

  });

}


const personToMeet =

  employee[0]
    .employee_name;


/* ===============================
   CONVERT FLAGS
=============================== */

const hasCompanionValue =

  Number(
    has_companion
  ) === 1

    ? 1

    : 0;


const hasAssetValue =

  Number(
    has_asset
  ) === 1

    ? 1

    : 0;


/* ===============================
   VALIDATE ASSETS
=============================== */

if (

  hasAssetValue === 1

  &&

  (

    !Array.isArray(
      assets
    )

    ||

    assets.length === 0

  )

) {

  await connection.rollback();

  transactionStarted =
    false;

  return res.status(400).json({

    success: false,

    message:
      "Please add at least one asset"

  });

}


/* ===============================
   UPDATE VISITOR
=============================== */

await connection.execute(

  `
  UPDATE visitors
  SET

    visitor_name = ?,

    mobile = ?,

    email = ?,

    visitor_photo = ?,

    company_name = ?,

    visitor_type = ?,

    has_companion = ?,

    companion_name = ?,

    companion_mobile = ?,

    companion_relationship = ?,

    has_asset = ?,

    purpose = ?,

    employee_id = ?,

    person_to_meet = ?,

    visit_date = ?,

    check_in = ?,

    remarks = ?,

    id_proof = ?,

    id_proof_number = ?

  WHERE

    id = ?

    AND company_id = ?
  `,

  [

    visitor_name.trim(),

    mobile.trim(),

    email?.trim()
      || null,

    visitor_photo
      || null,

    company_name?.trim()
      || null,

    finalVisitorType,

    hasCompanionValue,

    hasCompanionValue === 1

      ?

      companion_name?.trim()
      || null

      :

      null,

    hasCompanionValue === 1

      ?

      companion_mobile?.trim()
      || null

      :

      null,

    hasCompanionValue === 1

      ?

      companion_relationship?.trim()
      || null

      :

      null,

    hasAssetValue,

    finalPurpose
      || null,

    employee_id,

    personToMeet,

    formattedDate,

    formattedTime,

    remarks?.trim()
      || null,

    id_proof
      || null,

    id_proof_number?.trim()
      || null,

    id,

    companyId

  ]

);


/* ===============================
   DELETE OLD ASSETS
=============================== */

await connection.execute(

  `
  DELETE va
  FROM visitor_assets va

  INNER JOIN visitors v

    ON v.id = va.visitor_id

  WHERE

    va.visitor_id = ?

    AND v.company_id = ?
  `,

  [

    id,

    companyId

  ]

);


/* ===============================
   INSERT UPDATED ASSETS
=============================== */

if (

  hasAssetValue === 1

  &&

  Array.isArray(
    assets
  )

  &&

  assets.length > 0

) {

  for (
    const asset
    of assets
  ) {

    await connection.execute(

      `
      INSERT INTO visitor_assets
      (

        visitor_id,

        asset_type,

        asset_name,

        quantity,

        serial_number,

        remarks,

        created_at,

        asset_photo

      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
      `,

      [

        id,

        asset.asset_type
          ?.trim()
          || null,

        asset.asset_name
          ?.trim()
          || null,

        Number(
          asset.quantity
        ) > 0

          ?

          Number(
            asset.quantity
          )

          :

          1,

        asset.serial_number
          ?.trim()
          || null,

        asset.asset_remarks
          ?.trim()

          ||

        asset.remarks
          ?.trim()

          ||

        null,

        new Date(),

        asset.asset_photo
          || null

      ]

    );

  }

}


/* ===============================
   COMMIT
=============================== */

await connection.commit();

transactionStarted =
  false;


/* ===============================
   SUCCESS
=============================== */

return res.json({

  success: true,

  message:
    "Visitor Updated Successfully"

});


}
catch (error) {


if (
  transactionStarted
) {

  try {

    await connection.rollback();

  }
  catch (
    rollbackError
  ) {

    console.log(

      "ROLLBACK ERROR:",

      rollbackError

    );

  }

}


console.log(

  "UPDATE VISITOR ERROR:",

  error

);


return res.status(500).json({

  success: false,

  message:
    "Unable to update visitor"

});


}
finally {


connection.release();


}

};


export const approveVisitorFromEmail =
async (req, res) => {

try {

const {
  id,
  status
} = req.params;


/* ===============================
   VALIDATE STATUS
=============================== */

const finalStatus =

  String(status)
    .toUpperCase();


if (

  finalStatus !== "APPROVED"

  &&

  finalStatus !== "REJECTED"

) {

  return res.status(400).send(`

    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:80px;
        "
      >

        <h1>
          Invalid Request
        </h1>

        <p>
          Invalid visitor approval status.
        </p>

      </body>

    </html>

  `);

}


/* ===============================
   GET VISITOR FIRST
=============================== */

const [
  visitorData
] =

  await pool.execute(

    `
    SELECT

      v.*,

      e.employee_name,

      e.department,

      e.designation,

      e.employee_code,

      e.email
      AS employee_email

    FROM visitors v

    LEFT JOIN employees e

      ON v.employee_id = e.id

      AND e.company_id = v.company_id

    WHERE

      v.id = ?

    LIMIT 1
    `,

    [
      id
    ]

  );


/* ===============================
   VISITOR NOT FOUND
=============================== */

if (

  visitorData.length === 0

) {

  return res.status(404).send(`

    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:80px;
        "
      >

        <h1>
          Visitor Not Found
        </h1>

        <p>
          This visitor request does not exist.
        </p>

      </body>

    </html>

  `);

}


const visitor =

  visitorData[0];


/* ===============================
   ALREADY APPROVED
=============================== */

if (

  visitor.status === "APPROVED"

  &&

  finalStatus === "APPROVED"

) {

  return res.send(`

    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:80px;
        "
      >

        <h1
          style="
            color:#16a34a;
          "
        >

          Visitor Already Approved

        </h1>

        <p>

          ${visitor.visitor_name}

          has already been approved.

        </p>

        <p>

          You may now close this page.

        </p>

      </body>

    </html>

  `);

}


/* ===============================
   ALREADY REJECTED
=============================== */

if (

  visitor.status === "REJECTED"

  &&

  finalStatus === "REJECTED"

) {

  return res.send(`

    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:80px;
        "
      >

        <h1
          style="
            color:#dc2626;
          "
        >

          Visitor Already Rejected

        </h1>

        <p>

          ${visitor.visitor_name}

          has already been rejected.

        </p>

        <p>

          You may now close this page.

        </p>

      </body>

    </html>

  `);

}


/* ===============================
   UPDATE STATUS
=============================== */

await pool.execute(

  `
  UPDATE visitors

  SET

    status = ?

  WHERE

    id = ?
  `,

  [

    finalStatus,

    id

  ]

);


/* ===============================
   APPROVED
=============================== */

if (

  finalStatus === "APPROVED"

) {

  console.log(

    "Starting approval process for visitor:",

    visitor.id

  );


  /* ===============================
     UPLOADS FOLDER
  =============================== */

  const uploadsDir =

    path.join(

      process.cwd(),

      "uploads"

    );


  if (

    !fs.existsSync(

      uploadsDir

    )

  ) {

    fs.mkdirSync(

      uploadsDir,

      {

        recursive: true

      }

    );

  }


  /* ===============================
     GENERATE QR
  =============================== */

  const qrPath =

    path.join(

      uploadsDir,

      `qr-${visitor.id}.png`

    );


  const visitorPassId =

    `VIS-${

      String(

        visitor.id

      )

      .padStart(

        5,

        "0"

      )

    }`;


  await QRCode.toFile(

    qrPath,

    JSON.stringify({

      visitorId:

        visitor.id,

      visitorPassId,

      visitorName:

        visitor.visitor_name

    })

  );


  console.log(

    "QR generated:",

    qrPath

  );


  /* ===============================
     GET COMPANY SETTINGS
  =============================== */

  const [
    settingsData
  ] =

    await pool.execute(

      `
      SELECT *

      FROM company_settings

      LIMIT 1
      `

    );


  const companySettings =

    settingsData.length > 0

      ?

      settingsData[0]

      :

      null;


  console.log(

    "Company settings:",

    companySettings

  );


  /* ===============================
     GENERATE PDF
  =============================== */

  console.log(

    "Generating visitor pass..."

  );


  const pdfPath =

    await generateVisitorPass(

      visitor,

      qrPath,

      companySettings

    );


  console.log(

    "PDF generated:",

    pdfPath

  );


  /* ===============================
     CHECK PDF
  =============================== */

  if (

    !pdfPath

    ||

    !fs.existsSync(

      pdfPath

    )

  ) {

    throw new Error(

      "Visitor pass PDF was not generated."

    );

  }


  /* ===============================
     SEND EMAIL
  =============================== */

  if (

    visitor.email

  ) {

    await sendVisitorApprovedMail(

      visitor.email,

      visitor,

      pdfPath

    );


    console.log(

      "Approval email sent successfully"

    );

  }
  else {

    console.log(

      "Visitor email is empty. Approval email was skipped."

    );

  }

}


/* ===============================
   REJECTED
=============================== */

if (

  finalStatus === "REJECTED"

) {

  if (

    visitor.email

  ) {

    await sendVisitorRejectedMail(

      visitor.email,

      visitor

    );

  }

}


/* ===============================
   SUCCESS PAGE
=============================== */

return res.send(`

  <html>

    <body
      style="
        font-family:Arial;
        text-align:center;
        padding-top:80px;
        background:#f8fafc;
      "
    >

      <div
        style="
          max-width:550px;
          margin:auto;
          background:white;
          padding:40px;
          border-radius:18px;
          box-shadow:
            0 10px 30px
            rgba(0,0,0,0.08);
        "
      >

        <h1
          style="
            color:${
              finalStatus === "APPROVED"

                ?

                "#16a34a"

                :

                "#dc2626"
            };
          "
        >

          Visitor ${finalStatus}

        </h1>

        <p>

          ${visitor.visitor_name}

          has been

          ${finalStatus.toLowerCase()}.

        </p>

        <p>

          You may now close this page.

        </p>

      </div>

    </body>

  </html>

`);


}
catch (error) {


console.log(

  "VISITOR APPROVAL ERROR:",

  error

);


console.log(

  "ERROR MESSAGE:",

  error.message

);


console.log(

  "ERROR STACK:",

  error.stack

);


return res.status(500).send(`

  <html>

    <body
      style="
        font-family:Arial;
        text-align:center;
        padding-top:80px;
        background:#f8fafc;
      "
    >

      <div
        style="
          max-width:600px;
          margin:auto;
          background:white;
          padding:40px;
          border-radius:18px;
          box-shadow:
            0 10px 30px
            rgba(0,0,0,0.08);
        "
      >

        <h1
          style="
            color:#dc2626;
          "
        >

          Approval Processing Error

        </h1>

        <p>

          The visitor status may have been updated,
          but an error occurred while generating
          the visitor pass or sending the email.

        </p>

        <p
          style="
            color:#64748b;
            font-size:13px;
            word-break:break-word;
          "
        >

          ${error.message}

        </p>

      </div>

    </body>

  </html>

`);

}

};



export const scanVisitorQR = async (req, res) => {

try {


const companyId =
  getCompanyId(req);


const {
  id
} = req.params;


/* ===============================
   VALIDATE COMPANY
=============================== */

if (!companyId) {

  return res.status(400).send(`
    <h2>
      Company ID is required
    </h2>
  `);

}


/* ===============================
   GET COMPANY-WISE VISITOR
=============================== */

const [
  visitor
] = await pool.execute(

  `
  SELECT

    v.*,

    e.employee_name

  FROM visitors v

  LEFT JOIN employees e

    ON v.employee_id = e.id

    AND e.company_id = ?

  WHERE

    v.id = ?

    AND v.company_id = ?
  `,

  [

    companyId,

    id,

    companyId

  ]

);


/* ===============================
   VISITOR NOT FOUND
=============================== */

if (
  visitor.length === 0
) {

  return res.status(404).send(`
    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:100px;
        "
      >

        <h2>
          Visitor Not Found
        </h2>

      </body>

    </html>
  `);

}


/* ===============================
   ALREADY CHECKED IN
=============================== */

if (
  visitor[0].status
  ===
  "CHECKED IN"
) {

  return res.send(`
    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:100px;
        "
      >

        <h2>
          Visitor Already Checked In
        </h2>

        <p>

          ${visitor[0].visitor_name}

        </p>

      </body>

    </html>
  `);

}


/* ===============================
   ALREADY CHECKED OUT
=============================== */

if (
  visitor[0].status
  ===
  "CHECKED OUT"
) {

  return res.send(`
    <html>

      <body
        style="
          font-family:Arial;
          text-align:center;
          padding-top:100px;
        "
      >

        <h2>
          Visitor Has Already Checked Out
        </h2>

      </body>

    </html>
  `);

}


/* ===============================
   CHECK IN VISITOR

   IMPORTANT:

   Do not update check_in.

   check_in stores the scheduled
   visiting time.

   check_in_at stores the actual
   security check-in date and time.
=============================== */

await pool.execute(

  `
  UPDATE visitors

  SET

    status = 'CHECKED IN',

    check_in_at = NOW()

  WHERE

    id = ?

    AND company_id = ?
  `,

  [

    id,

    companyId

  ]

);


/* ===============================
   SUCCESS PAGE
=============================== */

return res.send(`

  <html>

  <body

    style="
      font-family:Arial;
      text-align:center;
      padding-top:100px;
      background:#f8fafc;
    "

  >

    <div

      style="
        max-width:500px;
        margin:auto;
        padding:40px;
        background:white;
        border-radius:18px;
        box-shadow:
          0 10px 30px
          rgba(0,0,0,0.12);
      "

    >

      <h1
        style="
          color:#16a34a;
        "
      >

        Visitor Checked In Successfully

      </h1>

      <p>

        <strong>
          Visitor:
        </strong>

        ${visitor[0].visitor_name}

      </p>

      <p>

        <strong>
          Host:
        </strong>

        ${visitor[0].employee_name
          || "Not Assigned"
        }

      </p>

    </div>

  </body>

  </html>

`);


}

catch (error) {


console.log(

  "SCAN VISITOR QR ERROR:",

  error

);


return res.status(500).send(

  "Something went wrong"

);


}

};
export const getVisitorForScan = async (
req,
res
) => {

try {

const companyId =
  getCompanyId(req);

const {
  id
} = req.params;


/* ===========================
   VALIDATE COMPANY
=========================== */

if (!companyId) {

  return res.status(400).json({

    success: false,

    message:
      "Company ID is required"

  });

}


/* ===========================
   GET VISITOR
=========================== */

const [
  visitorRows
] = await pool.execute(

  `
  SELECT

    v.*,

    e.employee_name,

    e.department,

    e.designation,

    e.mobile
    AS employee_mobile,

    e.email
    AS employee_email

  FROM visitors v

  LEFT JOIN employees e

    ON v.employee_id = e.id

    AND e.company_id = ?

  WHERE

    v.id = ?

    AND v.company_id = ?
  `,

  [

    companyId,

    id,

    companyId

  ]

);


/* ===========================
   VISITOR NOT FOUND
=========================== */

if (

  visitorRows.length === 0

) {

  return res.status(404).json({

    success: false,

    message:
      "Visitor not found"

  });

}


const visitor =
  visitorRows[0];


/* ===========================
   GET VISITOR ASSETS
=========================== */

const [
  assets
] = await pool.execute(

  `
  SELECT

    id,

    asset_type,

    asset_name,

    brand,

    model,

    serial_number,

    quantity,

    remarks,

    asset_photo

  FROM visitor_assets

  WHERE

    visitor_id = ?

  ORDER BY

    id ASC
  `,

  [

    id

  ]

);


/* ===========================
   RETURN VISITOR
=========================== */

return res.json({

  success: true,

  visitor: {

    ...visitor,

    assets

  }

});


}

catch (error) {


console.log(

  "GET VISITOR FOR SCAN ERROR:",

  error

);


return res.status(500).json({

  success: false,

  message:
    "Server Error"

});


}

};


export const checkInVisitor = async (
  req,
  res
) => {

  const connection =
    await pool.getConnection();

  try {

    /* ==========================
       GET COMPANY ID
    ========================== */

    const companyId =
      getCompanyId(req);


    if (!companyId) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    await connection.beginTransaction();


    const {
      id
    } = req.params;


    /* ==========================
       CHECK VISITOR STATUS
       COMPANY-WISE
    ========================== */

    const [existingVisitor] =

      await connection.execute(

        `
        SELECT

          id,

          company_id,

          status,

          check_in

        FROM visitors

        WHERE

          id = ?

          AND company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    if (
      existingVisitor.length === 0
    ) {

      await connection.rollback();

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found"

      });

    }


    if (
      String(
        existingVisitor[0]
          .status
      )
      .toUpperCase()
      ===
      "CHECKED IN"
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Visitor is already checked in."

      });

    }


    if (
      String(
        existingVisitor[0]
          .status
      )
      .toUpperCase()
      ===
      "CHECKED OUT"
    ) {

      await connection.rollback();

      return res.status(400).json({

        success: false,

        message:
          "Visitor has already checked out."

      });

    }


    /* ==========================
       REQUEST DATA
    ========================== */

    let {

      checked_in_by,

      live_photo,

      has_vehicle,

      vehicle_type,

      vehicle_number,

      driver_name,

      verifiedAssets,

      security_notes

    } = req.body;


    /* ==========================
       VEHICLE VALIDATION
    ========================== */

    has_vehicle =

      Number(
        has_vehicle
      );


    if (
      has_vehicle === 1
    ) {

      if (

        !vehicle_type

        ||

        !vehicle_number

        ||

        !driver_name

      ) {

        await connection.rollback();

        return res.status(400).json({

          success: false,

          message:
            "Please enter complete vehicle details."

        });

      }

    }

    else {

      has_vehicle = 0;

      vehicle_type = null;

      vehicle_number = null;

      driver_name = null;

    }


    /* ==========================
       CALCULATE ASSET VERIFIED
    ========================== */

    let asset_verified = 0;


    if (
      verifiedAssets
    ) {

      const values =

        Object.values(
          verifiedAssets
        );


      if (

        values.length > 0

        &&

        values.every(

          value =>
            value === true

        )

      ) {

        asset_verified = 1;

      }

    }


    /* ==========================
       UPDATE VISITOR
       COMPANY-WISE
    ========================== */

    const [

      updateResult

    ] =

      await connection.execute(

        `
        UPDATE visitors

        SET

          status = 'CHECKED IN',

          

          check_in_at = NOW(),

          live_photo = ?,

          live_photo_captured_at = NOW(),

          asset_verified = ?,

          checked_in_by = ?,

          has_vehicle = ?,

          vehicle_type = ?,

          vehicle_number = ?,

          driver_name = ?,

          security_notes = ?

        WHERE

          id = ?

          AND company_id = ?
        `,

        [

          live_photo
            || null,

          asset_verified,

          checked_in_by
            || null,

          has_vehicle,

          vehicle_type,

          vehicle_number,

          driver_name,

          security_notes
            || null,

          id,

          companyId

        ]

      );


    if (
      updateResult.affectedRows === 0
    ) {

      await connection.rollback();

      return res.status(404).json({

        success: false,

        message:
          "Visitor could not be checked in"

      });

    }


    /* ==========================
       VERIFY ASSETS
       ONLY FOR THIS VISITOR
    ========================== */

    if (
      verifiedAssets
    ) {

      for (

        const assetId

        of

        Object.keys(
          verifiedAssets
        )

      ) {

        await connection.execute(

          `
          UPDATE visitor_assets

          SET

            verified = ?

          WHERE

            id = ?

            AND visitor_id = ?
          `,

          [

            verifiedAssets[
              assetId
            ]

              ? 1

              : 0,

            assetId,

            id

          ]

        );

      }

    }


    /* ==========================
       GET UPDATED VISITOR
       COMPANY-WISE
    ========================== */

    const [

      visitorData

    ] =

      await connection.execute(

        `
        SELECT

          v.*,

          e.employee_name,

          e.email
          AS employee_email

        FROM visitors v

        LEFT JOIN employees e

          ON
            v.employee_id = e.id

          AND
            e.company_id = v.company_id

        WHERE

          v.id = ?

          AND v.company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    if (
      visitorData.length === 0
    ) {

      await connection.rollback();

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found"

      });

    }


    const visitor =

      visitorData[0];


    /* ==========================
       COMMIT DATABASE CHANGES
    ========================== */

    await connection.commit();


    /* ==========================
       CREATE NOTIFICATION
    ========================== */

    try {

      await addNotification(

        "Visitor Checked In",

        `${visitor.visitor_name} has arrived`,

        visitor.id,

        companyId

      );

    }

    catch (err) {

      console.log(

        "Notification Error:",

        err

      );

    }


    /* ==========================
       GENERATE PASS ID
    ========================== */

    const visitorPassId =

      `VIS-${

        new Date()
          .getFullYear()

      }-${

        String(
          visitor.id
        )
        .padStart(
          5,
          "0"
        )

      }`;


    /* ==========================
       EMAIL HOST
    ========================== */

    try {

      if (
        visitor.employee_email
      ) {

        await sendVisitorArrivedMail(

          visitor.employee_email,

          visitor

        );

      }

    }

    catch (err) {

      console.log(

        "Mail Error:",

        err

      );

    }


    /* ==========================
       RESPONSE
    ========================== */

    return res.json({

      success: true,

      message:
        "Visitor Checked In Successfully",

      visitor,

      visitorPassId

    });

  }

  catch (error) {

    try {

      await connection.rollback();

    }

    catch (
      rollbackError
    ) {

      console.log(

        "ROLLBACK ERROR:",

        rollbackError

      );

    }


    console.log(

      "CHECK-IN ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

  finally {

    connection.release();

  }

};
/* ===============================
   DELETE VISITOR
=============================== */

export const deleteVisitor = async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =

      getCompanyId(
        req
      );


    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET VISITOR ID
    =============================== */

    const {

      id

    } = req.params;


    /* ===============================
       DELETE COMPANY-WISE
    =============================== */

    const [

      result

    ] =

      await pool.execute(

        `
        DELETE FROM visitors

        WHERE

          id = ?

          AND company_id = ?
        `,

        [

          id,

          companyId

        ]

      );


    /* ===============================
       VISITOR NOT FOUND
    =============================== */

    if (
      result.affectedRows === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found or does not belong to this company"

      });

    }


    /* ===============================
       SUCCESS
    =============================== */

    return res.json({

      success: true,

      message:
        "Visitor Deleted Successfully"

    });

  }

  catch (error) {

    console.log(

      "DELETE VISITOR ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};


/* =================================
   CHECK OUT VISITOR
================================= */

export const checkOutVisitor = async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =

      getCompanyId(
        req
      );


    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET REQUEST DATA
    =============================== */

    const {

      id

    } = req.params;


    const {

      checked_out_by

    } = req.body;


    /* ===============================
       GET VISITOR
       COMPANY-WISE
    =============================== */

    const [

      visitorData

    ] =

      await pool.execute(

        `
        SELECT

          v.*,

          e.employee_name,

          e.email
          AS employee_email

        FROM visitors v

        LEFT JOIN employees e

          ON v.employee_id = e.id

          AND e.company_id = ?

        WHERE

          v.id = ?

          AND v.company_id = ?
        `,

        [

          companyId,

          id,

          companyId

        ]

      );


    /* ===============================
       VISITOR NOT FOUND
    =============================== */

    if (
      visitorData.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found or does not belong to this company"

      });

    }


    /* ===============================
       GET VISITOR
    =============================== */

    const visitor =

      visitorData[0];


    /* ===============================
       ALREADY CHECKED OUT
    =============================== */

    if (
      visitor.status
      ===
      "CHECKED OUT"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Visitor has already checked out"

      });

    }


    /* ===============================
       UPDATE VISITOR
       COMPANY-WISE
    =============================== */

    const [

      updateResult

    ] =

      await pool.execute(

        `
        UPDATE visitors

        SET

          check_out =
            CURRENT_TIME(),

          check_out_at =
            NOW(),

          checked_out_by =
            ?,

          status =
            'CHECKED OUT'

        WHERE

          id = ?

          AND company_id = ?
        `,

        [

          checked_out_by
          || null,

          id,

          companyId

        ]

      );


    /* ===============================
       UPDATE FAILED
    =============================== */

    if (
      updateResult.affectedRows
      ===
      0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor could not be checked out"

      });

    }


    /* ===============================
       NOTIFICATION
    =============================== */

    try {

      await addNotification(

        "Visitor Checked Out",

        `${

          visitor.visitor_name

        } has left the premises`,

        visitor.id

      );

    }
    catch (
      notificationError
    ) {

      console.log(

        "CHECK-OUT NOTIFICATION ERROR:",

        notificationError

      );

    }


    /* ===============================
       EMAIL HOST
    =============================== */

    try {

      if (
        visitor.employee_email
      ) {

        await sendVisitorCheckedOutMail(

          visitor.employee_email,

          {

            ...visitor,

            status:
              "CHECKED OUT"

          }

        );

      }

    }
    catch (
      mailError
    ) {

      console.log(

        "CHECK-OUT MAIL ERROR:",

        mailError

      );

    }


    /* ===============================
       SUCCESS
    =============================== */

    return res.json({

      success: true,

      message:
        "Visitor Checked Out Successfully",

      visitor: {

        ...visitor,

        status:
          "CHECKED OUT"

      }

    });

  }

  catch (
    error
  ) {

    console.log(

      "CHECK OUT VISITOR ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};

/* =================================
   BULK UPDATE VISITOR STATUS
================================= */

export const bulkUpdateVisitorStatus = async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =

      getCompanyId(
        req
      );


    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET REQUEST DATA
    =============================== */

    const {

      ids,

      status

    } = req.body;


    /* ===============================
       VALIDATE IDS AND STATUS
    =============================== */

    if (

      !Array.isArray(
        ids
      )

      ||

      ids.length
      ===
      0

      ||

      !status

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Visitor IDs or status are missing"

      });

    }


    /* ===============================
       VALIDATE STATUS
    =============================== */

    const allowedStatuses = [

      "PENDING",

      "APPROVED",

      "REJECTED",

      "CHECKED IN",

      "CHECKED OUT"

    ];


    if (

      !allowedStatuses.includes(

        String(
          status
        )
        .toUpperCase()

      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid visitor status"

      });

    }


    /* ===============================
       CREATE PLACEHOLDERS
    =============================== */

    const placeholders =

      ids

        .map(
          () => "?"
        )

        .join(
          ","
        );


    /* ===============================
       UPDATE COMPANY-WISE
    =============================== */

    const [

      result

    ] =

      await pool.execute(

        `
        UPDATE visitors

        SET

          status = ?

        WHERE

          id IN (

            ${placeholders}

          )

          AND company_id = ?
        `,

        [

          String(
            status
          )
          .toUpperCase(),

          ...ids,

          companyId

        ]

      );


    /* ===============================
       NO VISITORS UPDATED
    =============================== */

    if (
      result.affectedRows
      ===
      0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "No visitors found for this company"

      });

    }


    /* ===============================
       SUCCESS
    =============================== */

    return res.json({

      success: true,

      message:
        `${

          result.affectedRows

        } visitor(s) updated successfully`

    });

  }

  catch (
    error
  ) {

    console.log(

      "BULK VISITOR STATUS ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};
/* =================================
   SEARCH VISITORS
================================= */

export const searchVisitors = async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =

      getCompanyId(
        req
      );


    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET SEARCH KEYWORD
    =============================== */

    const keyword =

      String(

        req.params.query
        || ""

      )

      .trim();


    /* ===============================
       SEARCH COMPANY-WISE
    =============================== */

    const [

      rows

    ] =

      await pool.execute(

        `
        SELECT

          id,

          visitor_name,

          visitor_photo,

          mobile,

          status

        FROM visitors

        WHERE

          company_id = ?

          AND

          (

            CAST(
              id
              AS CHAR
            )
            LIKE ?

            OR

            visitor_name
            LIKE ?

            OR

            mobile
            LIKE ?

          )

          AND status =
            'APPROVED'

        ORDER BY

          id DESC

        LIMIT 10
        `,

        [

          companyId,

          `%${keyword}%`,

          `%${keyword}%`,

          `%${keyword}%`

        ]

      );


    /* ===============================
       SUCCESS
    =============================== */

    return res.json({

      success: true,

      visitors:
        rows

    });

  }

  catch (
    error
  ) {

    console.log(

      "SEARCH VISITORS ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};


/* ==========================================
    GET VISITOR USING PASS ID
========================================== */

export const getVisitorByPassId =
async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =
      getCompanyId(
        req
      );


    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET PASS ID
    =============================== */

    const {

      visitorPassId

    } = req.params;


    /* ===============================
       VALIDATE PASS FORMAT
    =============================== */

    if (
      !visitorPassId
      ||
      !visitorPassId
        .toUpperCase()
        .startsWith(
          "VIS-"
        )
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Visitor Pass"

      });

    }


    /* ===============================
       CONVERT VIS-24 TO 24
    =============================== */

    const visitorId =
      Number(

        visitorPassId

          .toUpperCase()

          .replace(
            "VIS-",
            ""
          )

      );


    if (
      !Number.isInteger(
        visitorId
      )
      ||
      visitorId <= 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid Visitor Pass"

      });

    }


    /* ===============================
       GET VISITOR
       COMPANY-WISE
    =============================== */

    const [

      rows

    ] =

      await pool.execute(

        `
        SELECT

          v.*,

          e.employee_name,

          e.email
          AS employee_email

        FROM visitors v

        LEFT JOIN employees e

          ON
            v.employee_id = e.id

          AND
            e.company_id = ?

        WHERE

          v.id = ?

          AND

          v.company_id = ?

        LIMIT 1
        `,

        [

          companyId,

          visitorId,

          companyId

        ]

      );


    /* ===============================
       VISITOR NOT FOUND
    =============================== */

    if (
      rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found or does not belong to this company"

      });

    }


    /* ===============================
       GET VISITOR
    =============================== */

    const visitor =
      rows[0];


    /* ===============================
       GET VISITOR ASSETS
    =============================== */

    const [

      assets

    ] =

      await pool.execute(

        `
        SELECT

          va.*

        FROM visitor_assets va

        INNER JOIN visitors v

          ON
            va.visitor_id = v.id

        WHERE

          va.visitor_id = ?

          AND

          v.company_id = ?
        `,

        [

          visitor.id,

          companyId

        ]

      );


    /* ===============================
       ATTACH ASSETS
    =============================== */

    visitor.assets =
      assets;


    /* ===============================
       SUCCESS
    =============================== */

    return res.json({

      success: true,

      visitor

    });

  }

  catch (
    error
  ) {

    console.log(

      "GET VISITOR BY PASS ID ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Server Error"

    });

  }

};
export const getCurrentVisitors =
async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =
      getCompanyId(
        req
      );


    /* ===============================
       COMPANY VALIDATION
    =============================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET CURRENT VISITORS
       COMPANY-WISE
    =============================== */

    const [

      visitors

    ] =

      await pool.execute(

        `
        SELECT

          id,

          company_id,

          visitor_name,

          company_name,

          visitor_photo,

          person_to_meet,

          visit_date,

          check_in,

          check_in_at

        FROM visitors

        WHERE

          company_id = ?

          AND

          status = 'CHECKED IN'

        ORDER BY

          check_in_at DESC
        `,

        [

          companyId

        ]

      );


    /* ===============================
       SUCCESS RESPONSE
    =============================== */

    return res.json({

      success: true,

      visitors

    });

  }

  catch (
    error
  ) {

    console.log(

      "GET CURRENT VISITORS ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load current visitors"

    });

  }

};
export const getRecentActivity =
async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =
      getCompanyId(
        req
      );


    /* ===============================
       COMPANY VALIDATION
    =============================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET RECENT ACTIVITY
       COMPANY-WISE
    =============================== */

    const [

      activities

    ] =

      await pool.execute(

        `
        SELECT

          id,

          company_id,

          visitor_name,

          status,

          check_in,

          check_out,

          check_in_at,

          check_out_at,

          visitor_photo

        FROM visitors

        WHERE

          company_id = ?

          AND

          status IN (

            'CHECKED IN',

            'CHECKED OUT'

          )

        ORDER BY

          COALESCE(

            check_out_at,

            check_in_at

          ) DESC

        LIMIT 10
        `,

        [

          companyId

        ]

      );


    /* ===============================
       SUCCESS RESPONSE
    =============================== */

    return res.json({

      success: true,

      activities

    });

  }

  catch (
    error
  ) {

    console.log(

      "GET RECENT ACTIVITY ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load recent activity"

    });

  }

};
export const getDashboardStats =
async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =
      getCompanyId(
        req
      );


    /* ===============================
       COMPANY VALIDATION
    =============================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       CURRENTLY INSIDE
    =============================== */

    const [

      insideRows

    ] =

      await pool.execute(

        `
        SELECT

          COUNT(*)
          AS total

        FROM visitors

        WHERE

          company_id = ?

          AND

          status =
          'CHECKED IN'
        `,

        [

          companyId

        ]

      );


    /* ===============================
       TODAY CHECKED IN
    =============================== */

    const [

      todayInRows

    ] =

      await pool.execute(

        `
        SELECT

          COUNT(*)
          AS total

        FROM visitors

        WHERE

          company_id = ?

          AND

          status =
          'CHECKED IN'

          AND

          DATE(
            check_in_at
          ) =
          CURDATE()
        `,

        [

          companyId

        ]

      );


    /* ===============================
       TODAY CHECKED OUT
    =============================== */

    const [

      todayOutRows

    ] =

      await pool.execute(

        `
        SELECT

          COUNT(*)
          AS total

        FROM visitors

        WHERE

          company_id = ?

          AND

          status =
          'CHECKED OUT'

          AND

          DATE(
            check_out_at
          ) =
          CURDATE()
        `,

        [

          companyId

        ]

      );


    /* ===============================
       PENDING VISITORS
    =============================== */

    const [

      pendingRows

    ] =

      await pool.execute(

        `
        SELECT

          COUNT(*)
          AS total

        FROM visitors

        WHERE

          company_id = ?

          AND

          status =
          'PENDING'
        `,

        [

          companyId

        ]

      );


    /* ===============================
       SUCCESS RESPONSE
    =============================== */

    return res.json({

      success: true,

      stats: {

        inside:

          insideRows[0]
            .total,

        todayIn:

          todayInRows[0]
            .total,

        todayOut:

          todayOutRows[0]
            .total,

        pending:

          pendingRows[0]
            .total

      }

    });

  }

  catch (
    error
  ) {

    console.log(

      "GET DASHBOARD STATS ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load dashboard statistics"

    });

  }

};


export const printVisitorPass =
async (
  req,
  res
) => {

  try {

    /* ===============================
       GET COMPANY ID
    =============================== */

    const companyId =
      getCompanyId(
        req
      );


    /* ===============================
       COMPANY VALIDATION
    =============================== */

    if (
      !companyId
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Company ID is required"

      });

    }


    /* ===============================
       GET VISITOR ID
    =============================== */

    const {

      id

    } = req.params;


    /* ===============================
       VALIDATE VISITOR
       COMPANY-WISE
    =============================== */

    const [

      visitors

    ] =

      await pool.execute(

        `
        SELECT

          id,

          company_id

        FROM visitors

        WHERE

          id = ?

          AND

          company_id = ?

        LIMIT 1
        `,

        [

          id,

          companyId

        ]

      );


    /* ===============================
       VISITOR NOT FOUND
    =============================== */

    if (
      visitors.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor not found or does not belong to this company"

      });

    }


    /* ===============================
       CREATE PDF PATH
    =============================== */

    const pdfPath =
      path.join(

        process.cwd(),

        "uploads",

        `visitor-pass-${id}.pdf`

      );


    /* ===============================
       CHECK PDF EXISTS
    =============================== */

    if (
      !fs.existsSync(
        pdfPath
      )
    ) {

      return res.status(404).json({

        success: false,

        message:
          "Visitor Pass not found."

      });

    }


    /* ===============================
       SEND PDF
    =============================== */

    return res.sendFile(

      pdfPath

    );

  }

  catch (
    error
  ) {

    console.log(

      "PRINT VISITOR PASS ERROR:",

      error

    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to load Visitor Pass"

    });

  }

};
export default {
  getVisitors,
  getVisitorById,
  addVisitor,
  updateVisitor,
  deleteVisitor,
  checkOutVisitor,
  searchVisitors,
    bulkUpdateVisitorStatus,
  approveVisitorFromEmail,
  scanVisitorQR,
  getVisitorForScan,
  
  getVisitorByPassId,
  checkInVisitor,
getRecentActivity,
getCurrentVisitors,
  sendVisitorCheckedOutMail,getDashboardStats,

  printVisitorPass
  
  
};