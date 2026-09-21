import "./VisitorInfoCard.css";

function VisitorInfoCard({ visitor }) {

    if (!visitor) return null;

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };

    return (

        <div className="visitor-card">

            {/* LEFT PROFILE */}

            <div className="visitor-profile-panel">

                <div className="visitor-photo">

                    {

                        visitor.visitor_photo ?

                        <img
                            src={visitor.visitor_photo}
                            alt={visitor.visitor_name}
                        />

                        :

                        <div className="photo-placeholder">

                            👤

                        </div>

                    }

                </div>

                <div className="visitor-status">

                    <span
                        className={`status-badge ${visitor.status
                            .toLowerCase()
                            .replace(/\s/g,"-")}`}
                    >
                        {visitor.status}
                    </span>

                </div>

            </div>

            {/* VISITOR DETAILS */}

            <div className="visitor-details-panel">

                <h3>

                    Visitor Information

                </h3>

                <div className="detail-row">

                    <label>Visitor ID</label>

                    <span>

                        VIS-{String(visitor.id).padStart(5,"0")}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Name</label>

                    <span>

                        {visitor.visitor_name}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Company</label>

                    <span>

                        {visitor.company_name || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Visitor Type</label>

                    <span>

                        {visitor.visitor_type}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Mobile</label>

                    <span>

                        {visitor.mobile || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Email</label>

                    <span>

                        {visitor.email || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Purpose</label>

                    <span>

                        {visitor.purpose || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Visit Date</label>

                    <span>

                        {formatDate(visitor.visit_date)}

                    </span>

                </div>

                <div className="detail-row">

                    <label>ID Proof</label>

                    <span>

                        {visitor.id_proof || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Companion</label>

                    <span>

                        {

                            Number(visitor.has_companion) === 1

                            ?

                            visitor.companion_name || "Yes"

                            :

                            "No"

                        }

                    </span>

                </div>

            </div>

            {/* HOST DETAILS */}

            <div className="host-details-panel">

                <h3>

                    Host Information

                </h3>

                <div className="detail-row">

                    <label>Host Name</label>

                    <span>

                        {visitor.employee_name || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Department</label>

                    <span>

                        {visitor.department || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Designation</label>

                    <span>

                        {visitor.designation || "-"}

                    </span>

                </div>

                <div className="detail-row">

                    <label>Host Email</label>

                    <span>

                        {visitor.employee_email || "-"}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default VisitorInfoCard;