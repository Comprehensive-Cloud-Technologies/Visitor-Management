import {
  useEffect,
  useState
}
from "react";

import {
  useParams,
  useNavigate
}
from "react-router-dom";

import {
  getVisitorById
}
from "../../services/visitorService";

import "./ViewVisitor.css";

function ViewVisitor() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [visitor, setVisitor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);
    const [activeTab,
  setActiveTab] =
  useState("overview");

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
      <div className="view-loading">
        Loading Visitor...
      </div>
    );


  }

  if (!visitor) {

    return (
      <div className="view-loading">
        Visitor Not Found
      </div>
    );

  }

  return (

    <div className="view-visitor-page">

      <div className="view-card">

        <div className="view-header">

          <div>

            <h2>
              Visitor Details
            </h2>

            <p>
              Complete visitor information
            </p>

          </div>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/visitors")
            }
          >
            Back
          </button>

        </div>

        {/* PROFILE */}

        <div className="profile-section">

          <div className="profile-avatar">

            {
              visitor.visitor_name
                ?.charAt(0)
                ?.toUpperCase()
            }

          </div>

{
  activeTab === "overview" && (

    <div className="tab-content">

      <div className="details-grid">

        <div className="detail-box">
          <label>Visitor ID</label>
          <p>#{visitor.id}</p>
        </div>

        <div className="detail-box">
          <label>Visitor Name</label>
          <p>{visitor.visitor_name}</p>
        </div>

        <div className="detail-box">
          <label>Mobile</label>
          <p>{visitor.mobile || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Email</label>
          <p>{visitor.email || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Company</label>
          <p>{visitor.company_name || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Purpose</label>
          <p>{visitor.purpose || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Person To Meet</label>
          <p>
            {
              visitor.employee_name ||
              visitor.person_to_meet ||
              "-"
            }
          </p>
        </div>

        <div className="detail-box">
          <label>Created On</label>
          <p>
            {
              new Date(
                visitor.created_at
              ).toLocaleString()
            }
          </p>
        </div>

      </div>

    </div>

  )
}
{
  activeTab === "visit" && (

    <div className="tab-content">

      <div className="details-grid">

        <div className="detail-box">
          <label>Visit Date</label>
          <p>{visitor.visit_date || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Check In</label>
          <p>{visitor.check_in || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Check Out</label>
          <p>{visitor.check_out || "-"}</p>
        </div>

        <div className="detail-box">
          <label>Status</label>
          <p>{visitor.status || "-"}</p>
        </div>

      </div>

      <div className="remarks-card">

        <h4>
          Remarks
        </h4>

        <p>
          {
            visitor.remarks ||
            "No remarks available"
          }
        </p>

      </div>

    </div>

  )
}
{
  activeTab === "documents" && (

    <div className="tab-content">

      <div className="details-grid">

        <div className="detail-box">
          <label>ID Proof Type</label>
          <p>
            {visitor.id_proof || "-"}
          </p>
        </div>

        <div className="detail-box">
          <label>ID Proof Number</label>
          <p>
            {
              visitor.id_proof_number ||
              "-"
            }
          </p>
        </div>

      </div>

      <br />

      <div className="document-grid">

        {
          visitor.visitor_photo && (

            <div
              className="visitor-photo-card"
            >

              <h4>
                Visitor Photo
              </h4>

              <img
                src={
                  visitor.visitor_photo
                }
                alt="Visitor"
                className="visitor-photo"
              />

            </div>

          )
        }

        {
          visitor.signature && (

            <div
              className="visitor-signature-card"
            >

              <h4>
                Signature
              </h4>

              <img
                src={visitor.signature}
                alt="Signature"
                className="visitor-signature"
              />

            </div>

          )
        }

      </div>

    </div>

  )
}
          <div>

            <h3>
              {visitor.visitor_name}
            </h3>

            <span
              className={
                visitor.status === "CHECKED IN"
                  ? "status-in"
                  : visitor.status === "CHECKED OUT"
                  ? "status-out"
                  : visitor.status === "APPROVED"
                  ? "status-approved"
                  : "status-pending"
              }
            >
              {visitor.status}
            </span>

          </div>

        </div>
        <div className="tabs">

  <button
    className={
      activeTab === "overview"
      ? "tab-btn active"
      : "tab-btn"
    }
    onClick={() =>
      setActiveTab("overview")
    }
  >
    Overview
  </button>

  <button
    className={
      activeTab === "visit"
      ? "tab-btn active"
      : "tab-btn"
    }
    onClick={() =>
      setActiveTab("visit")
    }
  >
    Visit Details
  </button>

  <button
    className={
      activeTab === "documents"
      ? "tab-btn active"
      : "tab-btn"
    }
    onClick={() =>
      setActiveTab("documents")
    }
  >
    Documents
  </button>

</div>

        

        

      
      

        
          

      </div>

    </div>

  );

}

export default ViewVisitor;