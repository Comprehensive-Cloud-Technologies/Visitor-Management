
import nodemailer from "nodemailer";
import process from "process";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVisitorApprovalMail = async (
  employeeEmail,
  employeeName,
  visitor,
  visitorId
) => {

  const approveUrl =
    `http://localhost:3060/api/visitors/approve/${visitorId}/APPROVED`;

  const rejectUrl =
    `http://localhost:3060/api/visitors/approve/${visitorId}/REJECTED`;

  await transporter.sendMail({

    from: `"Visitor Management System" <${process.env.EMAIL_USER}>`,

    to: employeeEmail,

    subject: `Visitor Approval Required - ${visitor.visitor_name}`,

    html: `

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f3f6fb;
    padding:20px;
    font-family:Arial,sans-serif;
  "
>
<tr>
<td align="center">

<table
  width="700"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#ffffff;
    border:1px solid #dbe3ec;
  "
>

  <!-- HEADER -->

  <tr>
    <td
      align="center"
      style="
        background:#0f4c81;
        padding:30px;
      "
    >

      <h1
        style="
          color:#ffffff;
          margin:0;
          font-size:28px;
        "
      >
        Visitor Management System
      </h1>

      <p
        style="
          color:#dbeafe;
          margin-top:8px;
          font-size:14px;
        "
      >
        Visitor Approval Request
      </p>

    </td>
  </tr>

  <!-- BODY -->

  <tr>
    <td style="padding:30px;">

      <h2
        style="
          margin-top:0;
          color:#111827;
        "
      >
        Hello ${employeeName},
      </h2>

      <p
        style="
          color:#4b5563;
          line-height:24px;
        "
      >
        A visitor has requested a meeting with you.
        Please review the visitor details below and
        approve or reject the request.
      </p>

      <!-- VISITOR PHOTO -->

      ${
        visitor.visitor_photo
        ?
        `
        <div style="text-align:center;margin:20px 0;">
          <img
            src="${visitor.visitor_photo}"
            width="120"
            height="120"
            style="
              border-radius:60px;
              border:3px solid #2563eb;
            "
          />
        </div>
        `
        :
        ""
      }

      <!-- DETAILS TABLE -->

      <table
        width="100%"
        cellpadding="10"
        cellspacing="0"
        border="1"
        style="
          border-collapse:collapse;
          border-color:#e5e7eb;
        "
      >

        <tr>
          <td width="35%">
            <b>Visitor Name</b>
          </td>
          <td>
            ${visitor.visitor_name}
          </td>
        </tr>

        <tr>
          <td>
            <b>Email</b>
          </td>
          <td>
            ${visitor.email || "-"}
          </td>
        </tr>

        <tr>
          <td>
            <b>Company</b>
          </td>
          <td>
            ${visitor.company_name || "-"}
          </td>
        </tr>

        <tr>
          <td>
            <b>Purpose</b>
          </td>
          <td>
            ${visitor.purpose}
          </td>
        </tr>

        <tr>
          <td>
            <b>Visit Date</b>
          </td>
          <td>
            ${visitor.visit_date}
          </td>
        </tr>

      </table>

      <br>

      <!-- SIGNATURE -->

      ${
        visitor.signature
        ?
        `
        <table
          width="100%"
          cellpadding="10"
          cellspacing="0"
          border="1"
          style="
            border-collapse:collapse;
            border-color:#e5e7eb;
          "
        >
          <tr>
            <td>

              <h3
                style="
                  margin-top:0;
                  color:#111827;
                "
              >
                Visitor Signature
              </h3>

              <img
                src="${visitor.signature}"
                width="250"
              />

            </td>
          </tr>
        </table>

        <br>
        `
        :
        ""
      }

      <!-- SUMMARY -->

      <table
        width="100%"
        cellpadding="15"
        cellspacing="0"
        border="0"
        style="
          background:#eef6ff;
          border:1px solid #cfe2ff;
        "
      >
        <tr>
          <td>

            <b>Meeting Summary</b>

            <br><br>

            Visitor
            <b>${visitor.visitor_name}</b>

            from

            <b>${visitor.company_name || "-"}</b>

            has requested a meeting on

            <b>${visitor.visit_date}</b>

            regarding

            <b>${visitor.purpose}</b>.

          </td>
        </tr>
      </table>

      <br><br>

      <!-- BUTTONS -->

      <table
        align="center"
        cellpadding="0"
        cellspacing="0"
      >
        <tr>

          <td>

            <a
              href="${approveUrl}"
              style="
                background:#16a34a;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                display:inline-block;
                font-weight:bold;
              "
            >
              APPROVE
            </a>

          </td>

          <td width="20"></td>

          <td>

            <a
              href="${rejectUrl}"
              style="
                background:#dc2626;
                color:#ffffff;
                text-decoration:none;
                padding:12px 24px;
                display:inline-block;
                font-weight:bold;
              "
            >
              REJECT
            </a>

          </td>

        </tr>
      </table>

      <br><br>

      <p
        style="
          font-size:13px;
          color:#6b7280;
        "
      >
        Please review and respond promptly to ensure
        proper visitor scheduling and security compliance.
      </p>

    </td>
  </tr>

  <!-- FOOTER -->

  <tr>
    <td
      align="center"
      style="
        background:#f8fafc;
        padding:20px;
        color:#6b7280;
        font-size:12px;
      "
    >

      This is an automated email from the
      Visitor Management System.

      <br><br>

      Generated:
      ${new Date().toLocaleString()}

    </td>
  </tr>

</table>

</td>
</tr>
</table>
    `,

  });

};
export const sendVisitorApprovedMail = async (
    visitorEmail,
    visitor,
    pdfPath
) => {

    const mailOptions = {

        from: `"Catalyst Visitor Management" <${process.env.EMAIL_USER}>`,

        to: visitorEmail,

        subject: "Visitor Request Approved | Visitor Pass Attached",

        html: `
<!DOCTYPE html>

<html>

<body style="
margin:0;
padding:0;
background:#f3f6fb;
font-family:Arial,sans-serif;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 0;"
>

<tr>

<td align="center">

<table
width="650"
style="
background:white;
border-radius:14px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);
"
>

<tr>

<td
style="
background:#0F4C81;
padding:30px;
text-align:center;
color:white;
"
>

<h1
style="
margin:0;
font-size:30px;
"
>

Catalyst Corporate Services

</h1>

<p
style="
margin-top:10px;
font-size:15px;
"
>

Visitor Management System

</p>

</td>

</tr>

<tr>

<td style="padding:40px;">

<h2
style="
color:#16a34a;
margin-top:0;
"
>

✅ Your Visit Has Been Approved

</h2>

<p>

Dear <b>${visitor.visitor_name}</b>,

</p>

<p>

Your visit request has been approved by the host.

</p>

<table
width="100%"
style="
margin-top:25px;
border-collapse:collapse;
"
>

<tr>

<td
style="
padding:12px;
background:#f8fafc;
font-weight:bold;
width:180px;
"
>

Visitor ID

</td>

<td
style="
padding:12px;
"
>

VIS-${String(visitor.id).padStart(5,"0")}

</td>

</tr>

<tr>

<td
style="
padding:12px;
background:#f8fafc;
font-weight:bold;
"
>

Visit Date

</td>

<td style="padding:12px;">

${new Date(visitor.visit_date).toLocaleDateString("en-IN")}

</td>

</tr>

<tr>

<td
style="
padding:12px;
background:#f8fafc;
font-weight:bold;
"
>

Host

</td>

<td style="padding:12px;">

${visitor.employee_name}

</td>

</tr>

<tr>

<td
style="
padding:12px;
background:#f8fafc;
font-weight:bold;
"
>

Purpose

</td>

<td style="padding:12px;">

${visitor.purpose}

</td>

</tr>

</table>

<div
style="
margin-top:35px;
padding:25px;
background:#eef7ff;
border-left:5px solid #0F4C81;
border-radius:8px;
"
>

<b>Please Note</b>

<ul style="line-height:1.8;">

<li>Carry a Government ID proof.</li>

<li>Bring the attached Visitor Pass.</li>

<li>Show the QR Code at the Security Gate.</li>

<li>The Visitor Pass is valid only for the approved visit date.</li>

</ul>

</div>

<p
style="
margin-top:35px;
"
>

Your Visitor Pass has been attached with this email in PDF format.

</p>

<p>

Thank you.

</p>

<p>

Regards,<br>

<b>Catalyst Visitor Management Team</b>

</p>

</td>

</tr>

<tr>

<td
style="
background:#0F4C81;
padding:18px;
text-align:center;
color:white;
font-size:13px;
"
>

Catalyst Corporate Services Pvt. Ltd.

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,

        attachments: [

            {

                filename: "Visitor-Pass.pdf",

                path: pdfPath

            }

        ]

    };

    await transporter.sendMail(mailOptions);

};
export const sendVisitorRejectedMail =
async(
  visitorEmail,
  visitor
)=>{

  await transporter.sendMail({

    from:
      process.env.EMAIL_USER,

    to:
      visitorEmail,

    subject:
      "Visitor Request Update",

    html: `
      <h2>
        Visitor Request Not Approved
      </h2>

      <p>
        Dear ${visitor.visitor_name},
      </p>

      <p>
        We regret to inform you that
        your visit request scheduled on
        ${visitor.visit_date}
        could not be approved.
      </p>

      <p>
        Please contact the host employee
        for further clarification.
      </p>

      <br>

      <p>
        Regards<br>
        Visitor Management Team
      </p>
    `
  });

};
export const sendVisitorArrivedMail =
async(
  employeeEmail,
  visitor
)=>{

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: employeeEmail,

    subject:
      `Visitor Arrived - ${visitor.visitor_name}`,

    html:`

      <h2>
        Visitor Arrival Notification
      </h2>

      <p>
        Dear Employee,
      </p>

      <p>
        Your visitor
        <b>${visitor.visitor_name}</b>
        has arrived at reception and
        has completed security check-in.
      </p>

      <table border="1" cellpadding="10">

        <tr>
          <td><b>Visitor</b></td>
          <td>${visitor.visitor_name}</td>
        </tr>

        <tr>
          <td><b>Company</b></td>
          <td>${visitor.company_name}</td>
        </tr>

        <tr>
          <td><b>Purpose</b></td>
          <td>${visitor.purpose}</td>
        </tr>

      </table>

      <br>

      <p>
        Kindly receive your visitor.
      </p>

      <br>

      Regards,
      <br>
      Visitor Management System

    `

  });

};
export const sendVisitorCheckedOutMail = async (
    employeeEmail,
    visitor
) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: employeeEmail,

            subject: `Visitor Checked Out - ${visitor.visitor_name}`,

            html: `

                <div style="font-family:Arial;padding:25px">

                    <h2 style="color:#dc2626;">
                        Visitor Checked Out
                    </h2>

                    <p>Hello,</p>

                    <p>
                        The following visitor has exited the premises.
                    </p>

                    <table cellpadding="8">

                        <tr>
                            <td><b>Visitor</b></td>
                            <td>${visitor.visitor_name}</td>
                        </tr>

                        <tr>
                            <td><b>Company</b></td>
                            <td>${visitor.company_name || "-"}</td>
                        </tr>

                        <tr>
                            <td><b>Purpose</b></td>
                            <td>${visitor.purpose || "-"}</td>
                        </tr>

                        <tr>
                            <td><b>Check In</b></td>
                            <td>${visitor.check_in || "-"}</td>
                        </tr>

                        <tr>
                            <td><b>Check Out</b></td>
                            <td>${visitor.check_out || "-"}</td>
                        </tr>

                    </table>

                    <br>

                    <p>
                        Thank you.
                    </p>

                </div>

            `

        });

        console.log("Visitor Checked Out Mail Sent");

    }

    catch (error) {

        console.log(error);

    }

};