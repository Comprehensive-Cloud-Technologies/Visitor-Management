import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
}
from "react-router-dom";

import {
  getVisitorById
}
from "../../services/visitorService";

import "./PrintVisitorPass.css";

function PrintVisitorPass() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [visitor,
    setVisitor] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    const loadVisitor =
      async () => {

        try {

          const response =
            await getVisitorById(id);

          if (
            response.data.success
          ) {

            setVisitor(
              response.data.visitor
            );

          }

        }
        catch (error) {

          console.log(error);

        }
        finally {

          setLoading(false);

        }

      };

    loadVisitor();

  }, [id]);

  if (loading) {

    return (
      <div className="pass-loading">
        Loading Visitor Pass...
      </div>
    );

  }

  if (!visitor) {

    return (
      <div className="pass-loading">
        Visitor Not Found
      </div>
    );

  }

 const visitorCode =
  visitor.visitor_pass_id ||
  `VIS-${new Date().getFullYear()}-${String(visitor.id).padStart(5,"0")}`;
  return (

    <div className="pass-page">

      <div className="pass-actions">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/visitors")
          }
        >
          Back
        </button>

        <button
          className="print-btn"
          onClick={() =>
            window.print()
          }
        >
          Print Pass
        </button>

      </div>

      <div
        className="visitor-pass-card"
        id="visitor-pass"
      >

        <div className="pass-top">
          <div className="company-block">
            <h1>
              GATE MANAGEMENT SYSTEM
            </h1>
            <p>
              VISITOR ENTRY PASS
            </p>
          </div>

          <div className="pass-id">
            {visitorCode}
          </div>
        </div>

        <div className="pass-divider"></div>

        <div className="pass-middle">
          <div className="pass-left">
            <h2 className="visitor-name">
              {visitor.visitor_name}
            </h2>

            <span
              className={
                visitor.status === "Checked Out"
                  ? "status-out"
                  : visitor.status === "CHECKED IN"
                  ? "status-in"
                  : "status-pending"
              }
            >
              {visitor.status}
            </span>
          </div>

          <div className="pass-right">
            {
              visitor.visitor_photo
              ? (
                <img
                  src={visitor.visitor_photo}
                  alt="Visitor"
                  className="pass-photo"
                />
              )
              : (
                <div className="pass-avatar">
                  {
                    visitor
                      .visitor_name
                      ?.charAt(0)
                      ?.toUpperCase()
                  }
                </div>
              )
            }
          </div>
        </div>

        <div className="pass-info">
          <div className="pass-row">

            <span>Visitor ID</span>
            <strong>{visitorCode}</strong>
          </div>

          <div className="pass-row">
            <span>Company</span>
            <strong>
              {visitor.company_name || "-"}
            </strong>
          </div>

          <div className="pass-row">
            <span>ID Proof</span>
            <strong>
              {visitor.id_proof || "-"}
            </strong>
          </div>
          <div className="pass-row">
  <span>ID Number</span>
  <strong>
    {visitor.id_proof_number || "-"}
  </strong>
</div>

          <div className="pass-row">
            <span>Host Employee</span>
            <strong>
              {
                visitor.employee_name ||
                visitor.person_to_meet ||
                "-"
              }
            </strong>
          </div>

          <div className="pass-row">
            <span>Purpose</span>
            <strong>
              {visitor.purpose || "-"}
            </strong>
          </div>

          <div className="pass-row">
            <span>Visit Date</span>
            <strong>
              {visitor.visit_date || "-"}
            </strong>
          </div>

          <div className="pass-row">
            <span>Check In</span>
            <strong>
              {visitor.check_in || "-"}
            </strong>
          </div>
        </div>

        <div className="pass-footer">
          {
            visitor.signature &&
            (
              <div className="signature-block">
                <img
                  src={visitor.signature}
                  alt="Signature"
                  className="signature-img"
                />

                <p>
                  Visitor Signature
                </p>
              </div>
            )
          }

          <small>
            Please carry this pass during your visit.
            Security may request this pass at any time.
          </small>
        </div>

      </div>

    </div>

  );

}

export default PrintVisitorPass;