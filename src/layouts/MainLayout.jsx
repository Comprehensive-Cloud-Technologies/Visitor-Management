import {
  Outlet,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardCheck,
  FaSignOutAlt,
  FaCog,
  FaUserCircle
  
} from "react-icons/fa";

import "./MainLayout.css";
import { io } from "socket.io-client";
import {
  getPermissionsByRole
} from "../services/rolePermissionService";
import { getNotifications, markAllNotificationsRead } from "../services/notificationService";
import {
  getCompanySettings
} from "../services/companySettingsService";

function MainLayout() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [permissions,
    setPermissions] =
    useState([]);

  const [companyLogo,
    setCompanyLogo] =
    useState("");

  const [companyName,
    setCompanyName] =
    useState("GMS");

  const [showNotifications,
    setShowNotifications] =
    useState(false);
const [notifications,
  setNotifications] =
  useState([]);
const socketRef =
useRef(null);

const roleId =
  user?.role_id;
useEffect(() => {

  socketRef.current = io("http://localhost:3060");

  socketRef.current.on("connect", () => {
   
  });

  socketRef.current.on("disconnect", () => {
    
  });

  socketRef.current.on(
    "newNotification",
    notification => {

      

      const audio = new Audio(
        "/sounds/notification.mp3"
      );

      audio.play()
        .then(() => {
          console.log("🔊 Sound Played");
        })
        .catch(error => {
          console.log("❌ Sound Error", error);
        });

      setNotifications(prev => [
        notification,
        ...prev
      ]);

    }
  );

  return () => {

    socketRef.current.disconnect();

  };

}, []);

 useEffect(() => {

  const loadPermissions = async () => {

    if (!roleId) return;

    try {

      const response =
        await getPermissionsByRole(roleId);

      setPermissions(
        response.data.permissions || []
      );

    }
    catch (error) {

      console.log(error);

    }

  };

  const loadNotifications = async () => {

    try {

      const response =
        await getNotifications();

      if (response.data.success) {

        setNotifications(
          response.data.notifications || []
        );

      }

    }
    catch (error) {

      console.log(error);

    }

  };

  const loadCompanySettings = async () => {

    try {

      const response =
        await getCompanySettings();

      if (response?.data?.success) {

        setCompanyLogo(
          response.data.settings?.company_logo || ""
        );

        setCompanyName(
          response.data.settings?.company_name || "GMS"
        );

      }

    }
    catch (error) {

      console.log(error);

    }

  };

  loadPermissions();
  loadNotifications();
  loadCompanySettings();

}, [roleId]);
useEffect(() => {

  const loadNotifications =
    async () => {

      try {

        const response =
          await getNotifications();

        if (
          response.data.success
        ) {

          const latestNotifications =
            response.data.notifications || [];

          // PLAY SOUND ONLY FOR NEW NOTIFICATIONS

 


          setNotifications(
            latestNotifications
          );

        }

      }
      catch(error){

        console.log(error);

      }

    };

  loadNotifications();



 

}, []);


  const hasReadAccess =
    (moduleName) => {

      return permissions.some(
        p =>
          p.module_name === moduleName &&
          Number(p.can_read) === 1
      );

    };

  const handleLogout =
    () => {

      localStorage.removeItem(
        "user"
      );

      navigate("/");

    };
  const handleMarkAllRead =
async () => {

  try {

    await markAllNotificationsRead();

   setNotifications(prev =>
  prev.map(item => ({
    ...item,
    is_read: Number(1)
  }))
);

  }
  catch(error){

    console.log(error);

  }

};


  return (

    <div className="layout">

      <aside className="sidebar">
  <div className="sidebar-header">
       

          {/* COMPANY HEADER */}
<div className="logo-section">

  {
    companyLogo
    ? (
      <img
        src={companyLogo}
        alt="Company Logo"
        className="company-logo"
      />
    )
    : (
      <div className="logo-box">
        G
      </div>
    )
  }

  <div className="company-header">

    <div className="company-details">

      <h3>
        {companyName}
      </h3>

      <p>
        Gate Management
      </p>

    </div>

    <div className="notification-wrapper">

<button
  className="notification-btn"
  onClick={() =>
    setShowNotifications(
      !showNotifications
    )
  }
>
  🔔

  {
    notifications.filter(
      n => Number(n.is_read) === 0
    ).length > 0 &&
    (
      <span
        className="notification-count"
      >
        {
          notifications.filter(
            n => Number(n.is_read) === 0
          ).length
        }
      </span>
    )
  }
</button>


    {
  showNotifications &&
  (
    <div className="notification-dropdown">

      <div
        className="notification-header"
      >

        <span>
          Notifications
        </span>

        {
          notifications.some(
            n => Number(n.is_read) === 0
          ) &&
          (
            <button
              className="mark-read-btn"
              onClick={
                handleMarkAllRead
              }
            >
              Mark All Read
            </button>
          )
        }

      </div>

      {
        notifications.length > 0
        ? notifications.map(
            item => (

          <div
  key={item.id}
  className={
    Number(item.is_read) === 0
    ? "notification-item unread"
    : "notification-item"
  }
  onClick={() => {

  setShowNotifications(false);

  if(item.visitor_id){

    navigate(
      `/view-visitor/${item.visitor_id}`
    );

  }

}}
>

                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.message}
                </p>

                <small>
                  {
                    new Date(
                      item.created_at
                    ).toLocaleString()
                  }
                </small>

              </div>

            )
          )
        : (
            <div
              className="notification-empty"
            >
              No Notifications
            </div>
          )
      }

    </div>
  )
}

    </div>

  </div>

</div>
 <div className="sidebar-body">
  <nav>

    <p className="menu-title">
      OVERVIEW
    </p>

    {
      hasReadAccess("Dashboard") && (
        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard"
              ? "menu-link active"
              : "menu-link"
          }
        >
          <FaTachometerAlt />
          Dashboard
        </Link>
      )
    }

    <p className="menu-title">
      MANAGEMENT
    </p>

    {
      hasReadAccess("Employees") && (
        <Link
          to="/employees"
          className={
            location.pathname.includes("/employee")
              ? "menu-link active"
              : "menu-link"
          }
        >
          <FaUsers />
          Employees
        </Link>
      )
    }

    {
      hasReadAccess("Visitors") && (
        <Link
          to="/visitors"
          className={
            location.pathname === "/visitors"
              ? "menu-link active"
              : "menu-link"
          }
        >
          <FaClipboardCheck />
          Visitors
        </Link>
      )
    }

  </nav>
</div>

<div className="sidebar-footer">

          <div className="user-card">

            <FaUserCircle
              className="user-avatar"
            />

            <div>

              <h4>
                {
                  user?.full_name ||
                  "User"
                }
              </h4>

              <p>
                {
                  user?.role_name ||
                  user?.role ||
                  "User"
                }
              </p>

            </div>

          </div>

          <Link
            to="/settings"
            className={
              location.pathname === "/settings"
                ? "menu-link active"
                : "menu-link"
            }
          >
            <FaCog />
            Settings
          </Link>

          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>

      </aside>

      <main className="content">

        <Outlet />

      </main>

    </div>

  );

}

export default MainLayout;