import "./VisitorInfoSection.css";

function VisitorInfoSection({ visitor }) {

    if (!visitor) return null;

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric"

        });

    };

    return (

        <div className="verification-section">

            <div className="section-title">

                <div className="section-icon">

                    👤

                </div>

                <div>

                    <h3>

                        Visitor Information

                    </h3>

                    <p>

                        Verify visitor identity before allowing entry.

                    </p>

                </div>

            </div>

            <div className="visitor-profile-card">

                <div className="visitor-avatar">

                    {

                        visitor.visitor_photo ?

                        (

                            <img

                                src={visitor.visitor_photo}

                                alt={visitor.visitor_name}

                            />

                        )

                        :

                        (

                            <div className="avatar-placeholder">

                                👤

                            </div>

                        )

                    }

                </div>

                <div className="visitor-basic-info">

                    <h2>

                        {visitor.visitor_name}

                    </h2>

                    <span className="visitor-id">

                        VIS-

                        {String(visitor.id).padStart(5,"0")}

                    </span>

                    <span

                        className={`status-chip ${visitor.status

                            ?.toLowerCase()

                            ?.replace(/\s/g,"-")}`}

                    >

                        {visitor.status}

                    </span>

                </div>

            </div>

            <div className="info-grid">

                <div className="info-box">

                    <label>

                        Company

                    </label>

                    <span>

                        {visitor.company_name || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        Visitor Type

                    </label>

                    <span>

                        {visitor.visitor_type || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        Mobile

                    </label>

                    <span>

                        {visitor.mobile || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        Email

                    </label>

                    <span>

                        {visitor.email || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        Purpose

                    </label>

                    <span>

                        {visitor.purpose || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        Visit Date

                    </label>

                    <span>

                        {formatDate(visitor.visit_date)}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        ID Proof

                    </label>

                    <span>

                        {visitor.id_proof || "-"}

                    </span>

                </div>

                <div className="info-box">

                    <label>

                        ID Number

                    </label>

                    <span>

                        {visitor.id_proof_number || "-"}

                    </span>

                </div>

                <div className="info-box full">

                    <label>

                        Companion

                    </label>

                    <span>

                        {

                            Number(visitor.has_companion) === 1

                            ?

                            visitor.companion_name

                            :

                            "No Companion"

                        }

                    </span>

                </div>

            </div>

        </div>

    );

}

export default VisitorInfoSection;