import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import {
  FaUsers,
  FaUserCheck,
  FaIdBadge,
  FaCalendarDay
} from "react-icons/fa";

import { getDashboardStats } from "../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [loading, setLoading] =
    useState(true);

  const [dashboardData, setDashboardData] =
    useState({
      stats: {},
      recentVisitors: [],
      purposeStats: [],
      statusStats: []
    });

  const [monthlyVisitors,
    setMonthlyVisitors] =
    useState([]);

  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          const response =
            await getDashboardStats();

          if (
            response?.data?.success
          ) {

            setDashboardData({
              stats:
                response.data.stats || {},
              recentVisitors:
                response.data.recentVisitors || [],
              purposeStats:
                response.data.purposeStats || [],
              statusStats:
                response.data.statusStats || []
            });

            const monthly =
              Array.isArray(
                response?.data?.monthlyVisitors
              )
                ? response.data.monthlyVisitors
                : [];

            const formattedMonthly =
              monthly.map((item) => ({
                month:
                  item.month || "N/A",
                total:
                  item.total ??
                  item.count ??
                  0
              }));

            setMonthlyVisitors(
              formattedMonthly
            );
          }

        }
        catch (error) {

          console.log(
            "Dashboard load error:",
            error
          );

        }
        finally {

          setLoading(false);

        }

      };

    loadDashboard();

  }, []);

  const colors = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444"
  ];

  if (loading) {

    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );

  }

  const {
    stats,
    recentVisitors,
    purposeStats,
    statusStats
  } = dashboardData;

  return (

    <div className="dashboard">

      {/* HERO SECTION */}

      <div className="dashboard-hero">

        <div>

          <h1>
            Welcome Back,
            {" "}
            {user?.full_name}
          </h1>

          <p>
            Manage Employees,
            Visitors,
            Security Check-ins
            and Reports from
            one place.
          </p>

        </div>

        <div className="hero-date">

          {
            new Date()
              .toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }
              )
          }

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">

          <FaUsers
            className="stat-icon"
          />

          <h4>
            Total Employees
          </h4>

          <h2>
            {stats.totalEmployees || 0}
          </h2>

        </div>

        <div className="stat-card">

          <FaUserCheck
            className="stat-icon"
          />

          <h4>
            Active Employees
          </h4>

          <h2>
            {stats.activeEmployees || 0}
          </h2>

        </div>

        <div className="stat-card">

          <FaIdBadge
            className="stat-icon"
          />

          <h4>
            Checked-In Visitors
          </h4>

          <h2>
            {stats.checkedInVisitors || 0}
          </h2>

        </div>

        <div className="stat-card">

          <FaCalendarDay
            className="stat-icon"
          />

          <h4>
            Today's Visitors
          </h4>

          <h2>
            {stats.todayVisitors || 0}
          </h2>

        </div>

      </div>

      {/* CHARTS */}

      {/* DASHBOARD OVERVIEW */}

<div className="charts-grid">

  {/* VISITOR TREND */}

  <div className="chart-card">

    <h3>Visitor Overview</h3>

    <ResponsiveContainer
      width="100%"
      height={280}
    >

      <BarChart
        data={monthlyVisitors}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="month"
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="total"
          fill="#2563eb"
          radius={[8,8,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* PURPOSE PIE */}

  <div className="chart-card">

    <h3>
      Visitors by Purpose
    </h3>

    <ResponsiveContainer
      width="100%"
      height={280}
    >

      <PieChart>

        <Pie
          data={purposeStats}
          dataKey="total"
          nameKey="purpose"
          outerRadius={90}
          innerRadius={45}
          label
        >

          {purposeStats.map(
            (_, index) => (

              <Cell
                key={index}
                fill={
                  colors[
                    index %
                    colors.length
                  ]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>

{/* SECOND ROW */}

<div className="charts-grid">

  {/* CHECKIN STATUS */}

  <div className="chart-card">

    <h3>
      Visitor Status
    </h3>

    <ResponsiveContainer
      width="100%"
      height={280}
    >

      <PieChart>

        <Pie
          data={statusStats}
          dataKey="total"
          nameKey="status"
          outerRadius={90}
          innerRadius={45}
          label
        >

          {statusStats.map(
            (_, index) => (

              <Cell
                key={index}
                fill={
                  colors[
                    index %
                    colors.length
                  ]
                }
              />

            )
          )}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

  {/* TODAY SUMMARY */}

  <div className="chart-card">

    <h3>
      Today's Summary
    </h3>

    <div className="mini-stats">

      <div>
        <strong>
          {stats.todayVisitors || 0}
        </strong>
        <p>Visitors</p>
      </div>

      <div>
        <strong>
          {stats.checkedInVisitors || 0}
        </strong>
        <p>Checked In</p>
      </div>

      <div>
        <strong>
          {stats.activeEmployees || 0}
        </strong>
        <p>Employees</p>
      </div>

    </div>

  </div>

</div>
      {/* TABLE + ACTIONS */}

      <div className="dashboard-row">

        <div className="dashboard-box">

          <h3>
            Recent Visitors
          </h3>

          <table>

            <thead>

    

            </thead>

            <tbody>

             <div className="recent-visitors-list">

  {recentVisitors.length > 0 ? (

    recentVisitors.map((visitor,index) => (

      <div
        className="visitor-card"
        key={index}
      >

        <div className="visitor-left">

          {
            visitor.visitor_photo
            ? (
              <img
                src={visitor.visitor_photo}
                alt="visitor"
                className="visitor-avatar"
              />
            )
            : (
              <div className="visitor-avatar-placeholder">
                {
                  visitor.visitor_name
                  ?.charAt(0)
                  ?.toUpperCase()
                }
              </div>
            )
          }

          <div>

            <div className="visitor-name">
              {visitor.visitor_name}
            </div>

            <div className="visitor-subtitle">
              {visitor.company_name}
            </div>

          </div>

        </div>

        <div className="visitor-purpose">
          {visitor.purpose}
        </div>

        <div>

          <span
            className={`status-badge ${
              visitor.status === "CHECKED IN"
              ? "checkedin"
              : visitor.status === "Approved"
              ? "approved"
              : visitor.status === "REJECTED"
              ? "rejected"
              : "pending"
            }`}
          >
            {visitor.status}
          </span>

        </div>

      </div>

    ))

  ) : (

    <div className="empty-visitors">
      No Visitors Found
    </div>

  )}

</div>
            </tbody>

          </table>

        </div>

        <div className="dashboard-box">

          <h3>
            Quick Actions
          </h3>

          <button
            onClick={() =>
              navigate(
                "/add-employee"
              )
            }
          >
            Add Employee
          </button>

          <button
            onClick={() =>
              navigate(
                "/add-visitor"
              )
            }
          >
            Add Visitor
          </button>

          <button
            onClick={() =>
              navigate(
                "/employees"
              )
            }
          >
            Employees
          </button>

          <button
            onClick={() =>
              navigate(
                "/visitors"
              )
            }
          >
            Visitors
          </button>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;