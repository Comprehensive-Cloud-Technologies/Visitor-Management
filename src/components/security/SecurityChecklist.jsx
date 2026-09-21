import "./SecurityChecklist.css";
import { checkInVisitor } from "../../services/visitorService";

function SecurityChecklist({

    checklist,

    setChecklist,

    visitor,

    currentUser,

    onCheckInSuccess

})  {

    if (!visitor) return null;

    const toggle = (field) => {

        setChecklist({

            ...checklist,

            [field]: !checklist[field]

        });

    };

    const handleCheckIn = async () => {

        try {

           

            const response = await checkInVisitor(

                visitor.id,

                {

                    security_verified: 1,

                    id_verified:
                        checklist.idVerified ? 1 : 0,

                    asset_verified:
                        checklist.assetVerified ? 1 : 0,

                    vehicle_verified:
                        checklist.vehicleVerified ? 1 : 0,

                    signature_verified:
                        checklist.signatureVerified ? 1 : 0,

                  checked_in_by:
    currentUser?.full_name || ""

                }

            );

            if (response.data.success) {

             onCheckInSuccess(response.data.visitor);

alert("Visitor Checked In Successfully");

            }

        }

        catch (error) {

            console.log(error);

            alert("Unable to Check In Visitor");

        }

    };

    const checks = [

        {

            field: "photoVerified",

            label: "Face Matches Visitor",

            icon: "👤"

        },

        {

            field: "idVerified",

            label: "Original ID Verified",

            icon: "🪪"

        }

    ];

    if (Number(visitor.has_asset) === 1) {

        checks.push({

            field: "assetVerified",

            label: "Assets Verified",

            icon: "💻"

        });

    }

    if (Number(visitor.has_vehicle) === 1) {

        checks.push({

            field: "vehicleVerified",

            label: "Vehicle Verified",

            icon: "🚗"

        });

    }

    checks.push({

        field: "signatureVerified",

        label: "Signature Verified",

        icon: "✍"

    });

    const completed = checks.filter(

        item => checklist[item.field]

    ).length;

    const percentage = Math.round(

        (completed / checks.length) * 100

    );

    return (

        <div className="security-checklist">

            <div className="checklist-header">

                <div>

                    <h2>

                        Security Verification

                    </h2>

                    <p>

                        Complete all mandatory checks before allowing visitor entry.

                    </p>

                </div>

                <div className="progress-circle">

                    {percentage}%

                </div>

            </div>

            <div className="progress-bar">

                <div

                    className="progress-fill"

                    style={{

                        width: `${percentage}%`

                    }}

                />

            </div>

            <div className="verification-grid">

                {

                    checks.map((item) => (

                        <label

                            key={item.field}

                            className={

                                checklist[item.field]

                                    ? "verify-card active"

                                    : "verify-card"

                            }

                        >

                            <input

                                type="checkbox"

                                checked={checklist[item.field]}

                                onChange={() =>

                                    toggle(item.field)

                                }

                            />

                            <div className="verify-icon">

                                {item.icon}

                            </div>

                            <div>

                                <strong>

                                    {item.label}

                                </strong>

                            </div>

                        </label>

                    ))

                }

            </div>

            <div className="verification-footer">

                <div className="verification-status">

                    {

                        percentage === 100

                            ?

                            "🟢 Ready for Visitor Check-In"

                            :

                            `Pending Verification (${completed}/${checks.length})`

                    }

                </div>

                <button

                    className="checkin-btn"

                    disabled={

                        percentage !== 100 ||

                        visitor.status === "CHECKED IN"||

    visitor.status === "Checked Out"

                    }

                    onClick={handleCheckIn}

                >

                  {

visitor.status === "CHECKED IN"

?

"🟢 Visitor Already Checked In"

:

visitor.status === "Checked Out"

?

"🔴 Visitor Already Checked Out"

:

"✅ Check In Visitor"

}

                </button>

            </div>

        </div>

    );

}

export default SecurityChecklist;