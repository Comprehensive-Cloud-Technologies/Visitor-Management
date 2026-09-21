import {

    Users,

    LogIn,

    LogOut,

    Clock3

}

from "lucide-react";

import "./DashboardStats.css";

function DashboardStats({ stats }) {

    const dashboardStats = [

        {

            title: "Visitors Inside",

            value: stats?.inside || 0,

            icon: <Users size={26}/>,

            color:"#2563eb"

        },

        {

            title: "Today's Check In",

            value: stats?.todayIn || 0,

            icon:<LogIn size={26}/>,

            color:"#16a34a"

        },

        {

            title:"Today's Check Out",

            value:stats?.todayOut || 0,

            icon:<LogOut size={26}/>,

            color:"#ea580c"

        },

        {

            title:"Pending Approval",

            value:stats?.pending || 0,

            icon:<Clock3 size={26}/>,

            color:"#f59e0b"

        }

    ];

    return(

        <div className="stats-grid">

            {

                dashboardStats.map((item,index)=>(

                    <div

                        key={index}

                        className="stats-card"

                    >

                        <div

                            className="stats-icon"

                            style={{

                                background:item.color

                            }}

                        >

                            {item.icon}

                        </div>

                        <div className="stats-info">

                            <h2>

                                {item.value}

                            </h2>

                            <p>

                                {item.title}

                            </p>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default DashboardStats;