import {
    FaBuilding,
    FaUserTie,
    FaCalendarAlt,
    FaIdBadge
} from "react-icons/fa";

import "./VisitorProfileSection.css";

function VisitorProfileSection({ visitor }) {

    if (!visitor) return null;

    return (

        <div className="visitor-profile-card">

            {/* Left */}

            <div className="visitor-profile-image">

                {
                    visitor.visitor_photo
                    ?

                    <img
                        src={visitor.visitor_photo}
                        alt={visitor.visitor_name}
                        className="visitor-profile-photo"
                    />

                    :

                    <div className="visitor-profile-placeholder">

                        {
                            visitor.visitor_name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }

                    </div>
                }

            </div>

            {/* Center */}

            <div className="visitor-profile-content">

                <div className="visitor-profile-top">

                    <div>

                        <h2>

                            {visitor.visitor_name}

                        </h2>

                        <span className="visitor-id">

                            VIS-
                            {String(visitor.id).padStart(5, "0")}

                        </span>

                    </div>

                    <span
                        className={`visitor-status ${visitor.status?.toLowerCase().replace(/\s/g,"-")}`}
                    >

                        {visitor.status}

                    </span>

                </div>

                <div className="visitor-profile-info">

                    <div>

                        <FaBuilding />

                        {visitor.company_name || "-"}

                    </div>

                    <div>

                        <FaIdBadge />

                        {visitor.visitor_type || "-"}

                    </div>

                    <div>

                        <FaUserTie />

                        {visitor.employee_name || "-"}

                    </div>

                    <div>

                        <FaCalendarAlt />

                        {visitor.visit_date || "-"}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default VisitorProfileSection;