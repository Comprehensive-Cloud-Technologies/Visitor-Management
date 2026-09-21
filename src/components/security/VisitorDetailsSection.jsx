import {
    FaPhoneAlt,
    FaEnvelope,
    FaIdCard,
    FaCalendarAlt,
   
    FaClipboardList
} from "react-icons/fa";

import "./VisitorDetailsSection.css";

function VisitorDetailsSection({ visitor }) {

    if (!visitor) return null;

    return (

        <div className="visitor-details-card">

            <h3>Visitor Details</h3>

            <div className="visitor-details-grid">

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaPhoneAlt />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            Mobile
                        </span>

                        <span className="detail-value">
                            {visitor.mobile || "-"}
                        </span>

                    </div>

                </div>

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaEnvelope />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            Email
                        </span>

                        <span className="detail-value">
                            {visitor.email || "-"}
                        </span>

                    </div>

                </div>

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaIdCard />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            ID Proof
                        </span>

                        <span className="detail-value">
                            {visitor.id_proof || "-"}
                        </span>

                    </div>

                </div>

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaIdCard />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            ID Number
                        </span>

                        <span className="detail-value">
                            {visitor.id_proof_number || "-"}
                        </span>

                    </div>

                </div>

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaClipboardList />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            Purpose
                        </span>

                        <span className="detail-value">
                            {visitor.purpose || "-"}
                        </span>

                    </div>

                </div>

               

                <div className="detail-item">

                    <div className="detail-icon">
                        <FaCalendarAlt />
                    </div>

                    <div className="detail-content">

                        <span className="detail-label">
                            Visit Date
                        </span>

                        <span className="detail-value">
                            {visitor.visit_date || "-"}
                        </span>

                    </div>

                </div>

                

            </div>

        </div>

    );

}

export default VisitorDetailsSection;