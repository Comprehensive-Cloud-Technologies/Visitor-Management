import { useNavigate } from "react-router-dom";
import "./VisitorThankYou.css";

function VisitorThankYou() {
  const navigate = useNavigate();

  return (
    <div className="thankyou-container">

      <div className="thankyou-card">

        <div className="emoji">🎉✨🙏</div>

        <h1>Thank You!</h1>

        <p>
          Your visitor request has been successfully submitted.
        </p>

        <p className="subtext">
          You will receive the details on your email shortly 📩
        </p>

        <div className="loader"></div>

        {/* EXIT BUTTON */}
        <button
          className="exit-btn"
          onClick={() => navigate("/public-home")}
        >
          Exit to Home
        </button>

      </div>

    </div>
  );
}

export default VisitorThankYou;