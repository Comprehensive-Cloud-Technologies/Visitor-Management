import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getEmployees,
  deleteEmployee
} from "../../services/employeeService";

import "./EmployeeList.css";
import {
  getPermissionsByRole
} from "../../services/rolePermissionService";
import "../../styles/CommonTable.css";
import * as XLSX from "xlsx";
import { importEmployees }
from "../../services/employeeService";
function EmployeeList() {

  const navigate =
    useNavigate();

  const [employees,
    setEmployees] =
    useState([]);

  const [search,
    setSearch] =
    useState("");
const [statusFilter, setStatusFilter] =
  useState("ALL");
  const fetchEmployees =
    async () => {

      try {

        const response =
          await getEmployees();

        if (
          response.data.success
        ) {

          setEmployees(
            response.data.employees
          );

        }

      }
      catch (error) {

        console.error(
          "Failed to load employees:",
          error
        );

      }

    };
const [employeePermission,
  setEmployeePermission] =
  useState(null);
  useEffect(() => {

  const loadData = async () => {

    await fetchEmployees();

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!user?.role_id)
        return;

      const response =
        await getPermissionsByRole(
          user.role_id
        );

      const permission =
        response.data.permissions.find(
          p =>
            p.module_name ===
            "Employees"
        );

      setEmployeePermission(
        permission
      );

    }
    catch (error) {

      console.log(error);

    }

  };

  loadData();

}, []);

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this employee?"
        );

      if (!confirmDelete)
        return;

      try {

        const response =
          await deleteEmployee(
            id
          );

        if (
          response.data.success
        ) {

          alert(
            "Employee Deleted Successfully"
          );

          fetchEmployees();

        }

      }
      catch (error) {

        console.log(error);

        alert(
          "Failed to delete employee"
        );

      }

    };
const handleExport = () => {

  const exportData =
    filteredEmployees.map(emp => ({
      Employee_Code: emp.employee_code,
      Employee_Name: emp.employee_name,
      Department: emp.department,
      Designation: emp.designation,
      Warehouse: emp.warehouse,
      Email: emp.email,
      Mobile: emp.mobile,
      Status: emp.status,
      Username: emp.username
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
    "Employees"
  );

  XLSX.writeFile(
  workbook,
  `Employees_${new Date()
    .toISOString()
    .split("T")[0]}.xlsx`
);

};
const handleImport = async (e) => {

  const file =
    e.target.files[0];

  if (!file)
    return;

  const reader =
    new FileReader();

  reader.onload =
    async (event) => {

      const data =
        event.target.result;

      const workbook =
        XLSX.read(data, {
          type: "binary"
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      try {

        const response =
          await importEmployees(
            jsonData
          );

        if (
          response.data.success
        ) {

          alert(
            "Employees Imported Successfully"
          );

          fetchEmployees();

        }

      }
      catch (error) {

        console.log(error);

        alert(
          "Import Failed"
        );

      }

    };

  reader.readAsBinaryString(
    file
  );

};
 const filteredEmployees =
  employees.filter((emp) => {

    const matchesSearch =

      emp.employee_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      emp.employee_code
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      emp.department
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      emp.designation
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      emp.warehouse
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesStatus =

      statusFilter === "ALL"

      ||

      emp.status ===
      statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );

  });

  return (

  <div className="employee-page">

    <div className="employee-top">

      <div>

        <h2>Employee Management</h2>

        <p>
          Manage all employees
        </p>

      </div>

    {
  employeePermission?.can_create === 1 &&
  (
    <div className="header-actions">

  <button
    className="export-btn"
    onClick={handleExport}
  >
    Export Excel
  </button>

 
  <label className="import-btn">
    Import Excel
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleImport}
      hidden
    />
  </label>

  <button
    className="add-btn"
    onClick={() =>
      navigate("/add-employee")
    }
  >
    + Add Employee
  </button>

</div>
  )
}

    </div>
<div className="employee-stats">

  <div
    className={
      statusFilter === "ALL"
        ? "stat-card active-card"
        : "stat-card"
    }
    onClick={() =>
      setStatusFilter("ALL")
    }
  >
    <h3>{employees.length}</h3>
    <p>Total Employees</p>
  </div>

  <div
    className={
      statusFilter === "Active"
        ? "stat-card active-card"
        : "stat-card"
    }
    onClick={() =>
      setStatusFilter("Active")
    }
  >
    <h3>
      {
        employees.filter(
          e => e.status === "Active"
        ).length
      }
    </h3>

    <p>Active Employees</p>
  </div>

  <div
    className={
      statusFilter === "Inactive"
        ? "stat-card active-card"
        : "stat-card"
    }
    onClick={() =>
      setStatusFilter("Inactive")
    }
  >
    <h3>
      {
        employees.filter(
          e => e.status === "Inactive"
        ).length
      }
    </h3>

    <p>Inactive Employees</p>
  </div>

</div>

    <div className="table-card">

      <div className="table-header">

        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="table-responsive">
 <table className="common-table">
        <thead>

          <tr>

            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Warehouse</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {
            filteredEmployees.length > 0
            ?

            filteredEmployees.map(
              (emp) => (

                <tr key={emp.id}>

                  <td>
                    {emp.employee_code}
                  </td>

                  <td>
                    {emp.employee_name}
                  </td>

                  <td>
                    {emp.department}
                  </td>

                  <td>
                    {emp.designation}
                  </td>

                  <td>
                    {emp.warehouse}
                  </td>

                  <td>
                    {emp.email}
                  </td>

                  <td>
                    {emp.mobile}
                  </td>

                  <td>

                    <span
                      className={
                        emp.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                      }
                    >
                      {emp.status}
                    </span>

                  </td>

                  <td>

                  {
  employeePermission?.can_update === 1 &&
  (
    <button
      className="edit-btn"
      onClick={() =>
        navigate(
          `/edit-employee/${emp.id}`
        )
      }
    >
      Edit
    </button>
  )
}
{
  employeePermission?.can_delete === 1 &&
  (
    <button
      className="delete-btn"
      onClick={() =>
        handleDelete(emp.id)
      }
    >
      Delete
    </button>
  )
}

                  </td>

                </tr>

              )
            )

            :

            <tr>

              <td
                colSpan="9"
                style={{
                  textAlign:"center"
                }}
              >
                No Employees Found
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

export default EmployeeList;