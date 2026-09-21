import "./VerificationVisitorInfo.css";

function VerificationVisitorInfo({ visitor }) {

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

        <div className="verification-section">

            <div className="section-title">

                Visitor Information

            </div>

            <div className="visitor-top-card">

                <div className="visitor-photo-box">

                    {

                        visitor.visitor_photo ?

                            <img
                                src={visitor.visitor_photo}
                                alt={visitor.visitor_name}
                            />

                        :

                            <div className="visitor-placeholder">

                                👤

                            </div>

                    }

                </div>

                <div className="visitor-basic-details">

                    <h2>

                        {visitor.visitor_name}

                    </h2>

                    <div className="visitor-id">

                        VIS-{String(visitor.id).padStart(5,"0")}

                    </div>

                    <span
                        className={`status-chip ${visitor.status
                            .toLowerCase()
                            .replace(/\s/g,"-")}`}
                    >

                        {visitor.status}

                    </span>

                </div>

            </div>

            <div className="info-grid">

                <div className="info-box">

                    <label>Company</label>

                    <span>

                        {visitor.company_name || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>Visitor Type</label>

                    <span>

                        {visitor.visitor_type || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>Mobile</label>

                    <span>

                        {visitor.mobile || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>Email</label>

                    <span>

                        {visitor.email || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>Visit Date</label>

                    <span>

                        {formatDate(visitor.visit_date)}

                    </span>

                </div>

                <div className="info-box">

                    <label>ID Proof</label>

                    <span>

                        {visitor.id_proof || "-"}

                    </span>

                </div>

                <div className="info-box full">

                    <label>Purpose</label>

                    <span>

                        {visitor.purpose || "-"}

                    </span>

                </div>

                {

                    Number(visitor.has_companion) === 1 &&

                    <div className="info-box full">

                        <label>

                            Companion

                        </label>

                        <span>

                            {visitor.companion_name}

                        </span>

                    </div>

                }

            </div>

        </div>

    );

}

export default VerificationVisitorInfo;