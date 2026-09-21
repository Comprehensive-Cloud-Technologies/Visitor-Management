import {
    FaMapMarkerAlt,
    FaUserShield,
    FaClock,
    FaCircle
} from "react-icons/fa";

import "./GateStatus.css";

function GateStatus({

    gateName = "Main Gate",

    securityName = "Security Officer",

    shift = "09:00 AM - 06:00 PM",

    gateStatus = "OPEN",

    lastSync = "Just Now"

}) {

    return (

        <div className="gate-status-card">

            <div className="gate-status-header">

                <h3>

                    Gate Status

                </h3>

                <span className="gate-live">

                    <FaCircle />

                    LIVE

                </span>

            </div>

            <div className="gate-info">

                <div className="gate-row">

                    <FaMapMarkerAlt />

                    <div>

                        <small>Gate</small>

                        <strong>{gateName}</strong>

                    </div>

                </div>

                <div className="gate-row">

                    <FaUserShield />

                    <div>

                        <small>Security Officer</small>

                        <strong>{securityName}</strong>

                    </div>

                </div>

                <div className="gate-row">

                    <FaClock />

                    <div>

                        <small>Shift</small>

                        <strong>{shift}</strong>

                    </div>

                </div>

            </div>

            <div className="gate-footer">

                <div>

                    <small>Status</small>

                    <span

                        className={

                            gateStatus === "OPEN"

                                ?

                                "status-open"

                                :

                                "status-close"

                        }

                    >

                        {gateStatus}

                    </span>

                </div>

                <div>

                    <small>Last Sync</small>

                    <strong>{lastSync}</strong>

                </div>

            </div>

        </div>

    );

}

export default GateStatus;