import { useEffect, useState } from "react";

import {
useNavigate,
useParams
} from "react-router-dom";

import {
getEmployeeById,
updateEmployee
} from "../../services/employeeService";
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "660px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "32px 32px 24px",
    position: "relative",
    boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 24px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },
  fullRow: {
    marginBottom: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  required: {
    color: "#dc2626",
    marginLeft: "2px",
  },
  input: {
    height: "44px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0 14px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s, background 0.15s",
  },
  select: {
    height: "44px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "0 14px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "auto",
    transition: "border-color 0.15s",
  },
  rolesBox: {
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "12px 14px",
    background: "#f8fafc",
    minHeight: "44px",
  },
  rolesPlaceholder: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: "10px",
  },
  roleChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  chip: (active) => ({
    padding: "6px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    border: active ? "2px solid #1e3a5f" : "1.5px solid #cbd5e1",
    background: active ? "#1e3a5f" : "#ffffff",
    color: active ? "#ffffff" : "#374151",
    transition: "all 0.15s",
  }),
  reportsBox: {
    border: "1.5px solid #bbf7d0",
    borderRadius: "12px",
    padding: "16px",
    background: "#f0fdf4",
    marginBottom: "18px",
  },
  reportsTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#15803d",
    marginBottom: "4px",
  },
  reportsSubtitle: {
    fontSize: "12px",
    color: "#4ade80",
    marginBottom: "10px",
    fontWeight: "400",
  },
  reportsSelect: {
    height: "44px",
    border: "1.5px solid #86efac",
    borderRadius: "10px",
    padding: "0 14px",
    fontSize: "14px",
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
    appearance: "auto",
  },
  mobileBox: {
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
    background: "#fafafa",
  },
  mobileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  mobileCheckbox: {
    width: "18px",
    height: "18px",
    accentColor: "#1e3a5f",
    cursor: "pointer",
  },
  mobileTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
  },
  mobileSub: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "14px",
    marginLeft: "28px",
  },
  mobileFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginLeft: "0",
  },
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingTop: "4px",
    borderTop: "1px solid #f1f5f9",
  },
  cancelBtn: {
    height: "42px",
    padding: "0 22px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  submitBtn: (loading) => ({
    height: "42px",
    padding: "0 24px",
    border: "none",
    borderRadius: "10px",
    background: loading ? "#2d5a8e" : "#1e3a5f",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background 0.15s",
  }),
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#991b1b",
    marginBottom: "18px",
  },
};

function Field({ label, required, children }) {
  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>
        {label}
        {required && <span style={S.required}>*</span>}
      </label>
      {children}
    </div>
  );
}

function EditEmployee() {

const navigate = useNavigate();

const { id } = useParams();

const [loading, setLoading] =
useState(true);

const [saving, setSaving] =
useState(false);

const [error, setError] =
useState("");

const [formData, setFormData] =
useState({


  employee_code: "",
  employee_name: "",
  department: "",
  designation: "",
  email: "",
  mobile: "",
  warehouse: "",
  status: "Active",
  username: "",
  role_id: "",
  password: ""

});

const [focusedField,
setFocusedField] =
useState("");

useEffect(() => {


const loadEmployee =
  async () => {

    try {

      const response =
        await getEmployeeById(id);

      if (
        response.data.success
      ) {

        setFormData({
          employee_code:
            response.data.employee.employee_code || "",

          employee_name:
            response.data.employee.employee_name || "",

          department:
            response.data.employee.department || "",

          designation:
            response.data.employee.designation || "",

          email:
            response.data.employee.email || "",

          mobile:
            response.data.employee.mobile || "",

          warehouse:
            response.data.employee.warehouse || "",

          status:
            response.data.employee.status || "Active",
          username:
            response.data.employee.username || "",
          role_id:
            response.data.employee.role_id || "",
          password:
            response.data.employee.password || ""
        });

      }

    }
    catch (error) {

      console.log(error);

      setError(
        "Failed to load employee"
      );

    }
    finally {

      setLoading(false);

    }

  };

loadEmployee();


}, [id]);

const handleChange =
(e) => {


  const {
    name,
    value
  } = e.target;

  setFormData({

    ...formData,

    [name]: value

  });

};


const handleSubmit =
async (e) => {

  e.preventDefault();

  setSaving(true);

  try {

    const response =
      await updateEmployee(
        id,
        formData
      );

    if (
      response.data.success
    ) {

      alert(
        "Employee Updated Successfully"
      );

      navigate(
        "/employees"
      );

    }

  }
  catch (error) {

    console.log(error);

    setError(
      error.response?.data?.message ||
      "Failed to update employee"
    );

  }
  finally {

    setSaving(false);

  }

};


const inputStyle = (field) => ({
    ...S.input,
    borderColor: focusedField === field ? "#1e3a5f" : "#e2e8f0",
    background: focusedField === field ? "#ffffff" : "#f8fafc",
  });

if (loading) {


return (

  <div style={S.overlay}>

    <div style={S.modal}>

      <h2>
        Loading Employee...
      </h2>

    </div>

  </div>

);


}

return (


<div style={S.overlay}>

  <div style={S.modal}>

    <h2 style={S.title}>
      Edit Employee
    </h2>

    {error && (

      <div style={S.errorBox}>
        {error}
      </div>

    )}

    <form onSubmit={handleSubmit}>

      <div style={S.row}>

        <Field label="Employee Code"
          required
        >

          <input
            style={inputStyle("employee_code")}
            type="text"
            name="employee_code"
            value={formData.employee_code}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "employee_code"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

        <Field
          label="Employee Name"
          required
        >

          <input
            style={inputStyle("employee_name")}
            type="text"
            name="employee_name"
            value={formData.employee_name}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "employee_name"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

      </div>

      <div style={S.row}>

        <Field label="Department">

          <input
            style={inputStyle("department")}
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "department"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

        <Field label="Designation">

          <input
            style={inputStyle("designation")}
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "designation"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

      </div>

      <div style={S.row}>

        <Field label="Email">

          <input
            style={inputStyle("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "email"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

        <Field label="Mobile">

          <input
            style={inputStyle("mobile")}
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "mobile"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

      </div>

      <div style={S.row}>

        <Field label="Warehouse">

          <input
            style={inputStyle("warehouse")}
            type="text"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            onFocus={() =>
              setFocusedField(
                "warehouse"
              )
            }
            onBlur={() =>
              setFocusedField("")
            }
          />

        </Field>

        <Field label="Status">

          <select
            style={S.select}
            name="status"
            value={formData.status}
            onChange={handleChange}
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>
<Field label="Username" required>
  <input
    style={inputStyle("username")}
    type="text"
    name="username"
    value={formData.username}
    onChange={handleChange}
  />
</Field>
<Field label="Password" required>
  <input
    style={inputStyle("password")}
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
  />
</Field>
        </Field>

      </div>

      <div style={S.btnRow}>

        <button
          type="button"
          style={S.cancelBtn}
          onClick={() =>
            navigate(
              "/employees"
            )
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          style={S.submitBtn(saving)}
          disabled={saving}
        >
          {
            saving
              ? "Updating..."
              : "Update Employee"
          }
        </button>

      </div>

    </form>

  </div>

</div>


);

}

export default EditEmployee;
