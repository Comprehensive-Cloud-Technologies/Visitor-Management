import { useState, useEffect } from "react";
import { addEmployee } from "../services/employeeService";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../services/roleService";
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

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_code: "",
    employee_name: "",
    department: "",
    designation: "",
    email: "",
    mobile: "",
    warehouse: "",
    status: "Active",
    role_id: "",
username: "",
password: "",
    reports_to: "",
    mobile_access: false,
    
  });

  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [emailError, setEmailError] = useState("");
const [nameError, setNameError] = useState("");
useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await getRoles();

     

      setRoles(response.data.roles || []);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRoles([]);
    }
  };

  fetchRoles();
}, []);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value
  });

  // Email validation
  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value && !emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }
  if (name === "employee_name") {
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!value.trim()) {
    setNameError("Name is required");
  } else if (value.trim().length < 3) {
    setNameError("Name must be at least 3 characters");
  } else if (!nameRegex.test(value)) {
    setNameError("Name can contain only letters and spaces");
  } else {
    setNameError("");
  }
}
};

  const inputStyle = (field) => ({
    ...S.input,
    borderColor: focusedField === field ? "#1e3a5f" : "#e2e8f0",
    background: focusedField === field ? "#ffffff" : "#f8fafc",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
   if (
   !formData.employee_code.trim() ||
  !formData.employee_name.trim() ||
  !formData.email.trim() ||
  !formData.mobile.trim() ||
  !formData.username.trim() ||
  !formData.password.trim() ||
  !formData.role_id
) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(formData.email)) {
  setError("Please enter a valid email address.");
  return;
}
 if (emailError) {

    setError(emailError);

    return;

  }

  if (nameError) {

    setError(nameError);

    return;

  }
    setLoading(true);
    try {
    const response = await addEmployee(
  formData
);

if (response.data.success) {

  alert(
    response.data.message ||
    "Employee Added Successfully"
  );

  navigate("/employees");

}
    } catch (err) {

  console.error(
    "Add employee error:",
    err
  );

  const message =
    err.message ||
    "Something went wrong";

  alert(message);

  setError(message);

} finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.overlay}>
      <div style={S.modal}>
        <h2 style={S.title}>Add Employee</h2>

        {error && <div style={S.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div style={S.fullRow}>
            <Field label="Full Name" required>
  <>
    <input
      style={inputStyle("employee_name")}
      type="text"
      name="employee_name"
      value={formData.employee_name}
      placeholder="e.g. Ahmed Hassan"
      onChange={handleChange}
      onFocus={() => setFocusedField("employee_name")}
      onBlur={() => setFocusedField("")}
      autoComplete="off"
    />

    {nameError && (
      <div
        style={{
          color: "#211ec0",
          fontSize: "12px",
          marginTop: "5px"
        }}
      >
        {nameError}
      </div>
    )}
  </>
</Field>
          </div>

          <div style={S.row}>
          <Field label="Email Address" required>
  <>
    <input
      style={inputStyle("email")}
      type="email"
      name="email"
      value={formData.email}
      placeholder="ahmed@company.com"
      onChange={handleChange}
      onFocus={() => setFocusedField("email")}
      onBlur={() => setFocusedField("")}
      autoComplete="off"
    />

    {emailError && (
      <div
        style={{
          color: "#6e3edf",
          fontSize: "12px",
          marginTop: "5px"
        }}
      >
        {emailError}
      </div>
    )}
  </>
</Field>
            <Field label="Phone">
              <input
                style={inputStyle("mobile")}
                type="text"
                name="mobile"
                placeholder="+971 50 000 0000"
                onChange={handleChange}
                onFocus={() => setFocusedField("mobile")}
                onBlur={() => setFocusedField("")}
              />
            </Field>
          </div>

          <div style={S.row}>
            <Field label="Designation / Job Title">
              <input
                style={inputStyle("designation")}
                type="text"
                name="designation"
                placeholder="e.g. Senior Technician"
                onChange={handleChange}
                onFocus={() => setFocusedField("designation")}
                onBlur={() => setFocusedField("")}
              />
            </Field>
            <Field label="Status">
              <select
                style={S.select}
                name="status"
                onChange={handleChange}
                defaultValue="Active"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          <div style={S.row}>
            <Field label="Employee Code" required>
              <input
                style={inputStyle("employee_code")}
                type="text"
                name="employee_code"
                placeholder="e.g. EMP-001"
                onChange={handleChange}
                onFocus={() => setFocusedField("employee_code")}
                onBlur={() => setFocusedField("")}
              />
            </Field>
            <Field label="Department">
              <input
                style={inputStyle("department")}
                type="text"
                name="department"
                placeholder="e.g. Operations"
                onChange={handleChange}
                onFocus={() => setFocusedField("department")}
                onBlur={() => setFocusedField("")}
              />
            </Field>
          </div>

          <div style={S.fullRow}>
            <Field label="Warehouse">
              <input
                style={inputStyle("warehouse")}
                type="text"
                name="warehouse"
                placeholder="Warehouse location"
                onChange={handleChange}
                onFocus={() => setFocusedField("warehouse")}
                onBlur={() => setFocusedField("")}
              />
            </Field>
          </div>
<div style={S.row}>
  <Field label="Username" required>
    <input
      style={inputStyle("username")}
      type="text"
      name="username"
      placeholder="Enter Username"
      value={formData.username}
      onChange={handleChange}
      onFocus={() => setFocusedField("username")}
      onBlur={() => setFocusedField("")}
    />
  </Field>

  <Field label="Password" required>
    <input
      style={inputStyle("password")}
      type="password"
      name="password"
      placeholder="Enter Password"
      value={formData.password}
      onChange={handleChange}
      onFocus={() => setFocusedField("password")}
      onBlur={() => setFocusedField("")}
    />
  </Field>
</div>
          <div style={S.fullRow}>
            <Field label="Role" required>
              <select
                style={S.select}
                name="role_id"
                value={formData.role_id || ""}
                onChange={handleChange}
              >
                <option value="">
                  Select Role
                </option>

                {
                  Array.isArray(roles) &&
roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                    >
                      {role.role_name}
                    </option>
                  ))
                }
              </select>
            </Field>
          </div>
          <div style={S.btnRow}>
            <button
              type="button"
              style={S.cancelBtn}
              onClick={() => navigate("/employees")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={S.submitBtn(loading)}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddEmployee;