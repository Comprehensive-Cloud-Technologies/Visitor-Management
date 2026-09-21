import { useNavigate } from "react-router-dom";
import "./public.css";

function PublicHome() {
  const navigate = useNavigate();

  return (
    <div className="bg">

      {/* animated shapes */}
      <div className="blob one"></div>
      <div className="blob two"></div>
      <div className="blob three"></div>

      <div className="glass-card">

        {/* HEADER */}
        <div className="header">
          <img src="/thermax_logo__2_.png" className="logo" alt="logo" />

          <div>
            <h1>ABC Technologies</h1>
            <p>Visitor Management Portal</p>
          </div>
        </div>

        {/* INFO */}
        <div className="info">
          <h3>How it works</h3>

          <div className="steps">
            <div>1. Submit Visitor Request</div>
            <div>2. Admin Reviews & Approves</div>
            <div>3. QR Pass is Generated</div>
            <div>4. Security Scans at Entry</div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="cta"
          onClick={() => navigate("/add-visitor", { state: { mode: "request" } })}
        >
          Request Visitor Access
        </button>

        <div className="footer">
          © 2026 ABC Technologies
        </div>

      </div>
    </div>
  );
}

export default PublicHome;