import { useEffect, useState } from "react";

import {

    Bell,

   

    UserCircle,

    Clock

}

from "lucide-react";

import "./SecurityHeader.css";

import logo from "../../../src/assets/company-logo.png";

function SecurityHeader() {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(new Date());

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <header className="security-header">

            {/* LEFT */}

            <div className="security-header-left">

                <img

                    src={logo}

                    alt="Company Logo"

                    className="company-logo"

                />

                <div>

                    <h1>

                        Visitor Management System

                    </h1>

                    <p>

                        Security Control Center

                    </p>

                </div>

            </div>

            {/* RIGHT */}

            <div className="security-header-right">

                {/* TIME */}

                <div className="live-time">

                    <Clock size={18} />

                    <div>

                        <strong>

                            {currentTime.toLocaleTimeString("en-IN")}

                        </strong>

                        <span>

                            {currentTime.toLocaleDateString("en-IN", {

                                weekday: "long",

                                day: "2-digit",

                                month: "long",

                                year: "numeric"

                            })}

                        </span>

                    </div>

                </div>

                {/* NOTIFICATION */}

                <button className="notification-btn">

                    <Bell size={20} />

                    <span className="notification-count">

                        0

                    </span>

                </button>

                {/* USER */}

                <div className="security-user">

                    <UserCircle size={38} />

                    <div>

                        <strong>

                            {user?.full_name || "Security"}

                        </strong>

                        <span>

                            Security Officer

                        </span>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default SecurityHeader;