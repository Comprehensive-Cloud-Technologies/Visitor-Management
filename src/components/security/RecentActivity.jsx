import {
    FaSignInAlt,
    FaSignOutAlt
} from "react-icons/fa";

import "./RecentActivity.css";

function RecentActivity({

    activities = []

}) {

    return (

        <div className="recent-card">

            <div className="recent-header">

                <h3>

                    Recent Activity

                </h3>

            </div>

            {

                activities.length === 0 && (

                    <div className="recent-empty">

                        No Recent Activity

                    </div>

                )

            }

            {

                activities.map((activity) => (

                    <div

                        key={activity.id}

                        className="activity-row"

                    >

                        <div className="activity-left">

                            {

                                activity.status === "CHECKED IN"

                                ?

                                <FaSignInAlt

                                    className="activity-icon checkin"

                                />

                                :

                                <FaSignOutAlt

                                    className="activity-icon checkout"

                                />

                            }

                        </div>

                        <div className="activity-middle">

                            <div className="activity-title">

                                {activity.visitor_name}

                            </div>

                            <div className="activity-subtitle">

                                {activity.status}

                            </div>

                        </div>

                        <div className="activity-right">

                            {

                                activity.status === "CHECKED IN"

                                    ? activity.check_in || "--"

                                    : activity.check_out || "--"

                            }

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default RecentActivity;