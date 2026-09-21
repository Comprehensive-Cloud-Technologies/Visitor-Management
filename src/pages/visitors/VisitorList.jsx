import { useState, useEffect } from "react";

import {
  getVisitors,
  deleteVisitor,
  checkOutVisitor
}
from "../../services/visitorService";

import {
  useNavigate
}
from "react-router-dom";

import {
  FaUsers,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
 FaSearch
    
} from "react-icons/fa";

import "./VisitorList.css";
import * as XLSX from "xlsx";
import { updateVisitorStatusBulk } from "../../services/visitorService";
import {
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";
function VisitorList() {

  const navigate = useNavigate();

  const [search, ] =
    useState("");

  const [visitors,setVisitors] =
  useState([]);
  
  const [searchTerm, setSearchTerm] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState("");

const [purposeFilter, setPurposeFilter] =
  useState("");
  
const [selectedVisitors, setSelectedVisitors] = useState([]);
const fetchVisitors =
  async ()=>{

    try{

      const response =
        await getVisitors();

      if(
        response.data.success
      ){

        setVisitors(
          response.data.visitors
        );

      }

    }
    catch(error){

      console.log(error);

    }

  };
useEffect(()=>{

  const loadData =
    async ()=>{

      await fetchVisitors();

    };

  loadData();

},[]);
const handleDelete =
  async(id)=>{

    const confirmDelete =
      window.confirm(
        "Delete this visitor?"
      );

    if(!confirmDelete)
      return;

    try{

      const response =
        await deleteVisitor(id);

      if(
        response.data.success
      ){

        alert(
          "Visitor Deleted Successfully"
        );

        fetchVisitors();

      }

    }
    catch(error){

      console.log(error);

      alert(
        "Failed to delete visitor"
      );

    }

  };
  const handleExport = () => {

  const exportData =
    filteredVisitors.map(visitor => ({

      Visitor_Name:
        visitor.visitor_name,

      Mobile:
        visitor.mobile,

      Email:
        visitor.email,

      Company:
        visitor.company_name,

      Purpose:
        visitor.purpose,

      Person_To_Meet:
        visitor.employee_name,

      Visit_Date:
        visitor.visit_date,

      Check_In:
        visitor.check_in,

      Check_Out:
        visitor.check_out || "",

      Status:
        visitor.status,

      Remarks:
        visitor.remarks || ""

    }));

  const worksheet =
    XLSX.utils.json_to_sheet(
      exportData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Visitors"
  );

  XLSX.writeFile(
    workbook,
    `Visitors_${
      new Date()
        .toISOString()
        .split("T")[0]
    }.xlsx`
  );

};
const filteredVisitors =
  visitors.filter((visitor) => {

    const matchesSearch =
      !search ||
      visitor.visitor_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      visitor.company_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      visitor.employee_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesVisitorSearch =
      !searchTerm ||
      visitor.visitor_name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesStatus =
      !statusFilter ||
      visitor.status
        ?.trim()
        .toLowerCase() ===
      statusFilter
        .trim()
        .toLowerCase();

    const matchesPurpose =
      !purposeFilter ||
      visitor.purpose
        ?.trim()
        .toLowerCase() ===
      purposeFilter
        .trim()
        .toLowerCase();

    return (
      matchesSearch &&
      matchesVisitorSearch &&
      matchesStatus &&
      matchesPurpose
    );

  });
const toggleSelectVisitor = (id) => {
  setSelectedVisitors((prev) =>
    prev.includes(id)
      ? prev.filter((v) => v !== id)
      : [...prev, id]
  );
};

const selectAllVisitors = (checked) => {
  if (checked) {
    setSelectedVisitors(filteredVisitors.map(v => v.id));
  } else {
    setSelectedVisitors([]);
  }
};

const updateStatusLocal = async (status) => {
  try {
    if (selectedVisitors.length === 0) return;

    const response = await updateVisitorStatusBulk({
      ids: selectedVisitors,
      status
    });

    if (response.data.success) {
      alert(`Visitors marked as ${status}`);
      setSelectedVisitors([]);
      fetchVisitors();
    }

  } catch (error) {
    console.log(error);
    alert("Status update failed");
  }
};

 return (

<div className="visitor-page">

  {/* PAGE HEADER */}

  <div className="page-header">

    <div>

      <h1>
        Visitor Management
      </h1>

      <p>
        Monitor and manage all visitor activities
      </p>

    </div>

    <div className="visitor-actions">

  <button
    className="export-btn"
    onClick={handleExport}
  >
    Export Excel
  </button>

  <button
    className="add-visitor-btn"
    onClick={() =>
      navigate("/add-visitor")
    }
  >
    + Add Visitor
  </button>

</div>

  </div>

  {/* STATS */}

  <div className="stats-grid">

  <div
    className={`stat-card ${
      statusFilter === ""
        ? "active-card"
        : ""
    }`}
    onClick={() =>
      setStatusFilter("")
    }
  >
    <div>
      <p>Total Visitors</p>
      <h2>{visitors.length}</h2>
    </div>

    <FaUsers className="stat-icon" />
  </div>

  <div
    className={`stat-card success ${
      statusFilter === "CHECKED IN"
        ? "active-card"
        : ""
    }`}
    onClick={() =>
      setStatusFilter(
        "CHECKED IN"
      )
    }
  >
    <div>
      <p>Checked In</p>

      <h2>
        {
          visitors.filter(
            v =>
              v.status ===
              "CHECKED IN"
          ).length
        }
      </h2>
    </div>

    <FaSignInAlt className="stat-icon" />
  </div>

  <div
    className={`stat-card warning ${
      statusFilter === "CHECKED OUT"
        ? "active-card"
        : ""
    }`}
    onClick={() =>
      setStatusFilter(
        "CHECKED OUT"
      )
    }
  >
    <div>
      <p>Checked Out</p>

      <h2>
        {
          visitors.filter(
            v =>
              v.status ===
              "CHECKED OUT"
          ).length
        }
      </h2>
    </div>

    <FaSignOutAlt className="stat-icon" />
  </div>

  <div
    className={`stat-card purple ${
      statusFilter === "PENDING"
        ? "active-card"
        : ""
    }`}
    onClick={() =>
      setStatusFilter(
        "PENDING"
      )
    }
  >
    <div>
      <p>Pending Approval</p>

      <h2>
        {
          visitors.filter(
            v =>
              v.status ===
              "PENDING"
          ).length
        }
      </h2>
    </div>

    <FaClock className="stat-icon" />
  </div>
<div
  className={`stat-card approved-card ${
    statusFilter === "APPROVED"
      ? "active-card"
      : ""
  }`}
  onClick={() =>
    setStatusFilter(
      "APPROVED"
    )
  }
>
  <div>
    <p>APPROVED</p>

    <h2>
      {
        visitors.filter(
          v =>
            v.status ===
            "APPROVED"
        ).length
      }
    </h2>
  </div>

  <FaCheckCircle className="stat-icon" />
</div>
<div
  className={`stat-card rejected-card ${
    statusFilter === "REJECTED"
      ? "active-card"
      : ""
  }`}
  onClick={() =>
    setStatusFilter(
      "REJECTED"
    )
  }
>
  <div>
    <p>REJECTED</p>

    <h2>
      {
        visitors.filter(
          v =>
            v.status ===
            "REJECTED"
        ).length
      }
    </h2>
  </div>

 <FaTimesCircle className="stat-icon" />
</div>
</div>

  {/* FILTER BAR */}

  {/* <div className="filter-card">

    <div className="search-box">

      <FaSearch />

      <input
        type="text"
        placeholder="Search visitor, company or host..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

    </div>

  </div> */}
  

<div className="visitor-filters">

    <div className="filter-search">

        <FaSearch />

        <input
            type="text"
            placeholder="Search visitor, company, mobile..."
            value={searchTerm}
            onChange={(e)=>
                setSearchTerm(e.target.value)
            }
        />

    </div>

    <select
        value={statusFilter}
        onChange={(e)=>
            setStatusFilter(e.target.value)
        }
    >

        <option value="">All Status</option>

        <option value="CHECKED IN">
            Checked In
        </option>

        <option value="CHECKED OUT">
            Checked Out
        </option>

        <option value="APPROVED">
            Approved
        </option>

        <option value="REJECTED">
            Rejected
        </option>

        <option value="PENDING">
            Pending
        </option>

    </select>

    <select
        value={purposeFilter}
        onChange={(e)=>
            setPurposeFilter(e.target.value)
        }
    >

        <option value="">
            All Purpose
        </option>

        {
            [...new Set(visitors.map(v=>v.purpose))]
            .map((purpose,index)=>(
                <option
                    key={index}
                    value={purpose}
                >
                    {purpose}
                </option>
            ))
        }

    </select>

    {
        selectedVisitors.length>0 &&
        filteredVisitors.some(
            visitor=>
            selectedVisitors.includes(visitor.id) &&
            visitor.status==="PENDING"
        ) &&

        <div className="bulk-actions-bar">

            <span>

                {selectedVisitors.length}
                {" "}Selected

            </span>

            <button
                className="approve-btn"
                onClick={()=>
                    updateStatusLocal("APPROVED")
                }
            >
                ✓ Approve
            </button>

            <button
                className="reject-btn"
                onClick={()=>
                    updateStatusLocal("REJECTED")
                }
            >
                ✕ Reject
            </button>

        </div>
    }

</div>


  <div className="table-card">

    <div className="table-top">

      <h3>
        Visitor Records
      </h3>

      <span>
        Total Records :
        {" "}
        {filteredVisitors.length}
      </span>

    </div>

    <div className="table-responsive">

      <table className="visitor-table">

        <thead>

          <tr>
<th>
  <input
    type="checkbox"
    onChange={(e) => selectAllVisitors(e.target.checked)}
    checked={
      selectedVisitors.length === filteredVisitors.length &&
      filteredVisitors.length > 0
    }
  />
</th>
            <th>Visitor</th>
            <th>Company</th>
            <th>Host</th>
            <th>Purpose</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

{
filteredVisitors.length > 0 ?

filteredVisitors.map((visitor) => {

    const status =
        (visitor.status || "").toUpperCase();

    return (

        <tr key={visitor.id}>

            <td>
                <input
                    type="checkbox"
                    checked={selectedVisitors.includes(visitor.id)}
                    disabled={status !== "PENDING"}
                    onChange={() => toggleSelectVisitor(visitor.id)}
                />
            </td>

            <td>
                <div className="visitor-info">

                    <div className="avatar">
                        {visitor.visitor_name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                        <strong>{visitor.visitor_name}</strong>
                    </div>

                </div>
            </td>

            <td>{visitor.company_name}</td>

            <td>{visitor.employee_name}</td>

            <td>
                <span className="purpose-badge">
                    {visitor.purpose}
                </span>
            </td>

            <td>
                {new Date(visitor.visit_date).toLocaleDateString("en-IN")}
            </td>

            <td>{visitor.check_in}</td>

            <td>

                <span
                    className={
                        status === "CHECKED IN"
                            ? "status-in"
                            : status === "CHECKED OUT"
                            ? "status-out"
                            : status === "APPROVED"
                            ? "status-approved"
                            : status === "REJECTED"
                            ? "status-rejected"
                            : "status-PENDING"
                    }
                >
                    {status}
                </span>

            </td>

            <td>

                <div className="action-buttons">

                    <button
                        className="view-btn"
                        onClick={() =>
                            navigate(`/view-visitor/${visitor.id}`)
                        }
                    >
                        <FaEye />
                    </button>

                    <button
                        className="edit-btn"
                        onClick={() =>
                            navigate(`/edit-visitor/${visitor.id}`)
                        }
                    >
                        <FaEdit />
                    </button>

                    <button
                        className="print-btn"
                        onClick={() =>
                            navigate(`/print-visitor-pass/${visitor.id}`)
                        }
                    >
                        🖨️
                    </button>

                    <button
                        className="checkout-btn"
                        disabled={
                            status === "CHECKED OUT" ||
                            status === "PENDING"
                        }
                        onClick={async () => {

                            const confirmCheckout =
                                window.confirm("Check out this visitor?");

                            if (!confirmCheckout) return;

                            try {

                                const response =
                                    await checkOutVisitor(visitor.id);

                                if (response.data.success) {

                                    alert("Visitor Checked Out");

                                    fetchVisitors();

                                }

                            }
                            catch (error) {

                                console.log(error);

                            }

                        }}
                    >
                        <FaSignOutAlt />
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() =>
                            handleDelete(visitor.id)
                        }
                    >
                        <FaTrash />
                    </button>

                </div>

            </td>

        </tr>

    );

})

:

<tr>

    <td
        colSpan="9"
        className="no-data"
    >
        No Visitors Found
    </td>

</tr>

}

</tbody>
      </table>

    </div>

  </div>

</div>

);
}

export default VisitorList;