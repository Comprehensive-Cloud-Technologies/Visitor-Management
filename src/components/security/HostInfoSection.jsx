import "./HostInfoSection.css";

function HostInfoSection({ visitor }) {

    if (!visitor) return null;

    return (

      <div className="host-section">

    <h3>Host Information</h3>

    <div className="host-grid">

        <div className="host-box">

            <label>Host Name</label>

            <span>{visitor.employee_name || "-"}</span>

        </div>

        <div className="host-box">

            <label>Department</label>

            <span>{visitor.department || "-"}</span>

        </div>

        <div className="host-box">

            <label>Designation</label>

            <span>{visitor.designation || "-"}</span>

        </div>

        <div className="host-box">

            <label>Mobile</label>

            <span>{visitor.employee_mobile || "-"}</span>

        </div>

    </div>

</div>

    );

}

export default HostInfoSection;