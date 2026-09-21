export const getVisitorPassHTML = (
    visitor,
    qrBase64,
    company
) => {

const logo = company.company_logo || "";
const photo = visitor.visitor_photo || "";

const visitorId =
`VIS-${String(visitor.id).padStart(5,"0")}`;

return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>Visitor Pass</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html,
body{
    margin:0;
    padding:0;
}

body{

margin:0;

padding:0;

display:flex;

justify-content:center;

align-items:center;

background:white;

overflow:hidden;

font-family:"Segoe UI",Arial,sans-serif;

-webkit-print-color-adjust:exact;
print-color-adjust:exact;

}


.pass{

    width:210mm;
    height:148mm;

    display:flex;
    flex-direction:column;

    background:white;

    overflow:hidden;

    border:1px solid #D9E3EF;

}
/* ===========================
   HEADER
=========================== */

.header{

height:20mm;

background:#0F4C81;

display:flex;

align-items:center;

justify-content:space-between;

padding:0 8mm;

color:white;

flex-shrink:0;

}

.logo{

width:18mm;

height:18mm;

object-fit:contain;

}

.company{

flex:1;

text-align:center;

}

.company h1{

font-size:8mm;

font-weight:700;

line-height:1;

margin-bottom:2mm;

}

.company p{

font-size:3mm;

letter-spacing:1px;

text-transform:uppercase;

}

.status{

background:#16A34A;

padding:3mm 6mm;

border-radius:8px;

font-size:4mm;

font-weight:700;

}
/* ===========================
   CONTENT
=========================== */

.content{

flex:1;

display:grid;

grid-template-columns:38mm 1fr 42mm;

gap:6mm;

padding:6mm;

background:#F8FAFC;

}

.card{

background:white;

border:1px solid #D7E3EF;

border-radius:10px;

padding:4mm;

display:flex;

flex-direction:column;

}

.cardTitle{

font-size:5mm;

font-weight:700;

color:#0F4C81;

margin-bottom:4mm;

text-align:center;

}
.photoCard{

align-items:center;

}

.photo{

width:30mm;

height:38mm;

border-radius:8px;

border:1px solid #D7E3EF;

object-fit:cover;

background:#f3f4f6;

}

.photoLabel{

margin-top:3mm;

font-size:3mm;

color:#64748B;

}
.details{

display:grid;

grid-template-columns:1fr 1fr;

column-gap:6mm;

row-gap:2mm;

font-size:3.2mm;

}

.item{

display:flex;

flex-direction:column;

}

.label{

font-size:2.6mm;

color:#64748B;

margin-bottom:1mm;

}

.value{

font-size:3.4mm;

font-weight:600;

color:#111827;

word-break:break-word;

}
.qrCard{

align-items:center;

}

.qr{

width:28mm;

height:28mm;

margin:2mm 0;

}

.valid{

margin-top:3mm;

background:#16A34A;

color:white;

padding:2.5mm;

border-radius:6px;

font-size:3mm;

font-weight:700;

text-align:center;

width:100%;

}

.issue{

margin-top:3mm;

font-size:2.5mm;

color:#64748B;

text-align:center;

}
/* ===========================
   FOOTER
=========================== */

.footer{

height:18mm;

border-top:1px solid #D7E3EF;

display:flex;

justify-content:space-between;

align-items:center;

padding:4mm 6mm;

background:white;

flex-shrink:0;

}

.instructions{

font-size:2.8mm;

color:#475569;

line-height:1.6;

}

.instructions strong{

display:block;

color:#111827;

margin-bottom:1mm;

}

.companyInfo{

text-align:right;

font-size:2.8mm;

color:#475569;

line-height:1.6;

}

.companyInfo strong{

display:block;

font-size:3.2mm;

color:#0F4C81;

margin-bottom:1mm;

}

.bottom{

height:6mm;

background:#0F4C81;

display:flex;

align-items:center;

justify-content:center;

color:white;

font-size:2.8mm;

font-weight:600;

flex-shrink:0;

}
</style>

</head>

<body>

<div class="pass">

<div class="header">

<img
class="logo"
src="${logo}"
>

<div class="company">

<h1>

${company.company_name || "Catalyst"}

</h1>

<p>

Corporate Visitor Pass

</p>

</div>


<div class="status">

APPROVED

</div>
</div>
<div class="content">

    <!-- PHOTO -->

    <div class="card photoCard">

        <img
            class="photo"
            src="${photo}"
        >

        <div class="photoLabel">

            Visitor Photo

        </div>

    </div>

    <!-- DETAILS -->

    <div class="card">

        <div class="cardTitle">

            Visitor Details

        </div>

        <div class="details">

            <div class="item">
                <span class="label">Visitor ID</span>
                <span class="value">${visitorId}</span>
            </div>

            <div class="item">
                <span class="label">Visit Date</span>
                <span class="value">${new Date(visitor.visit_date).toLocaleDateString("en-IN")}</span>
            </div>

            <div class="item">
                <span class="label">Visitor Name</span>
                <span class="value">${visitor.visitor_name || "-"}</span>
            </div>

            <div class="item">
                <span class="label">Mobile</span>
                <span class="value">${visitor.mobile || "-"}</span>
            </div>

            <div class="item">
                <span class="label">Company</span>
                <span class="value">${visitor.company_name || "-"}</span>
            </div>

            <div class="item">
                <span class="label">Host Employee</span>
                <span class="value">${visitor.employee_name || "-"}</span>
            </div>

            <div class="item" style="grid-column:1 / span 2;">
                <span class="label">Purpose</span>
                <span class="value">${visitor.purpose || "-"}</span>
            </div>

        </div>

    </div>

    <!-- QR -->

    <div class="card qrCard">

        <div class="cardTitle">

            Scan At Gate

        </div>

        <img
            class="qr"
            src="${qrBase64}"
        >

        <div class="valid">

            VALID TODAY

        </div>

        <div class="issue">

            Show this QR at the security gate.

        </div>

    </div>

</div>
<!-- FOOTER -->

<div class="footer">

<div class="instructions">

<strong>

Security Instructions

</strong>

• Carry this visitor pass during your visit.<br>

• Show this pass at the security gate.<br>

• Return the pass before leaving the premises.

</div>

<div class="companyInfo">

<strong>

${company.company_name || "Catalyst"}

</strong>

${company.address || ""}<br>

☎ ${company.mobile || ""}<br>

✉ ${company.email || ""}

</div>

</div>

<div class="bottom">

Property of ${company.company_name || "Catalyst"} • Visitor Management System

</div>
</div>



</body>

</html>

`;

};