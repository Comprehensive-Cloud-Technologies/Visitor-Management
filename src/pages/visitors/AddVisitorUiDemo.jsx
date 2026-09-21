import { FaUser, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaUsers, FaLaptop, FaClipboardList, FaCalendarAlt, FaUserTie, FaCamera, FaSignature } from "react-icons/fa";
import "./AddVisitorUiDemo.css";

function AddVisitorUiDemo() {
  return (
    <div className="visitor-demo-page">
      <div className="visitor-demo-hero">
        <h1>Add Visitor UI Demo</h1>
        <p>Compact and professional preview with a 3-fields-per-row layout.</p>
      </div>

      <form className="visitor-demo-form" onSubmit={(e) => e.preventDefault()}>
        <section className="demo-section">
          <h3>
            <FaIdCard className="demo-icon" />
            Visitor Identity
          </h3>

          <div className="demo-identity-layout">
            <div className="demo-photo-panel">
              <div className="demo-photo-placeholder">
                <FaCamera />
                <span>Upload Photo</span>
              </div>
            </div>

            <div className="demo-grid demo-grid-3">
              <div className="demo-field">
                <label>ID Proof Type</label>
                <select>
                  <option>Select ID Proof</option>
                  <option>Aadhar Card</option>
                  <option>PAN Card</option>
                  <option>Driving License</option>
                  <option>Passport</option>
                </select>
              </div>

              <div className="demo-field">
                <label>ID Proof Number</label>
                <input type="text" placeholder="Enter ID Number" />
              </div>

              <div className="demo-field">
                <label>Visitor Type</label>
                <select>
                  <option>Select Visitor Type</option>
                  <option>Guest</option>
                  <option>Vendor</option>
                  <option>Interview Candidate</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h3>
            <FaUser className="demo-icon" />
            Visitor Information
          </h3>

          <div className="demo-grid demo-grid-3">
            <div className="demo-field">
              <label>
                <FaUser />
                Visitor Name
              </label>
              <input type="text" placeholder="Enter full name" />
            </div>

            <div className="demo-field">
              <label>
                <FaPhone />
                Mobile Number
              </label>
              <input type="text" placeholder="Enter mobile number" />
            </div>

            <div className="demo-field">
              <label>
                <FaEnvelope />
                Email Address
              </label>
              <input type="email" placeholder="name@company.com" />
            </div>

            <div className="demo-field">
              <label>
                <FaBuilding />
                Company
              </label>
              <input type="text" placeholder="Enter company name" />
            </div>

            <div className="demo-field">
              <label>
                <FaUserTie />
                Person to Meet
              </label>
              <select>
                <option>Select Employee</option>
                <option>John Doe - IT</option>
                <option>Sara Khan - HR</option>
              </select>
            </div>

            <div className="demo-field">
              <label>
                <FaClipboardList />
                Purpose
              </label>
              <select>
                <option>Select Purpose</option>
                <option>Meeting</option>
                <option>Interview</option>
                <option>Delivery</option>
              </select>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h3>
            <FaUsers className="demo-icon" />
            Companion Details
          </h3>

          <div className="demo-grid demo-grid-3">
            <div className="demo-field">
              <label>Is someone accompanying?</label>
              <select>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="demo-field">
              <label>Companion Name</label>
              <input type="text" placeholder="Companion full name" />
            </div>

            <div className="demo-field">
              <label>Companion Mobile</label>
              <input type="text" placeholder="Companion mobile" />
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h3>
            <FaLaptop className="demo-icon" />
            Asset Details
          </h3>

          <div className="demo-grid demo-grid-3">
            <div className="demo-field">
              <label>Carrying assets?</label>
              <select>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="demo-field">
              <label>Asset Type</label>
              <select>
                <option>Select Asset Type</option>
                <option>Laptop</option>
                <option>Mobile</option>
                <option>Tablet</option>
              </select>
            </div>

            <div className="demo-field">
              <label>Asset Name</label>
              <input type="text" placeholder="Asset name" />
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h3>
            <FaCalendarAlt className="demo-icon" />
            Visit Schedule
          </h3>

          <div className="demo-grid demo-grid-3">
            <div className="demo-field">
              <label>Visit Date</label>
              <input type="date" />
            </div>

            <div className="demo-field">
              <label>Visiting Time</label>
              <input type="time" />
            </div>

            <div className="demo-field demo-field-wide">
              <label>Remarks</label>
              <textarea rows="3" placeholder="Additional notes"></textarea>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h3>
            <FaSignature className="demo-icon" />
            Signature Preview
          </h3>
          <div className="demo-signature">Signature area preview</div>
        </section>

        <div className="demo-actions">
          <button type="button" className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Save Visitor</button>
        </div>
      </form>
    </div>
  );
}

export default AddVisitorUiDemo;
