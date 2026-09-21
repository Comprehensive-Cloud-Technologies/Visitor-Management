import { useState } from "react";
import { addVisitor } from "../../services/visitorService";

function VisitorRequest() {

  const [form, setForm] = useState({
    visitor_name: "",
    mobile: "",
    email: "",
    company_name: "",
    purpose: "",
    person_to_meet: "",
    visit_date: "",
    remarks: "",
    id_proof: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await addVisitor({
        ...form,

        // IMPORTANT: DO NOT SEND THESE
        visitor_photo: null,
        signature: null
      });

      setSubmitted(true);

    } catch (error) {
      console.log(error);
    }
  };

  if (submitted) {
    return (
      <div className="thank-you">
        <h2>✅ Thank You</h2>
        <p>Your visitor request has been submitted successfully.</p>
        <p>Status: Pending Approval</p>
      </div>
    );
  }

  return (
    <div className="form-container">

      <h2>Visitor Request Form</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="visitor_name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="company_name"
          placeholder="Company Name"
          onChange={handleChange}
        />

        <input
          name="person_to_meet"
          placeholder="Person to Meet"
          onChange={handleChange}
        />

        <input
          name="purpose"
          placeholder="Purpose of Visit"
          onChange={handleChange}
        />

        <input
          type="date"
          name="visit_date"
          onChange={handleChange}
          required
        />

        <textarea
          name="remarks"
          placeholder="Remarks (optional)"
          onChange={handleChange}
        />

        <input
          name="id_proof"
          placeholder="ID Proof Type (Aadhar/Driving License)"
          onChange={handleChange}
        />

        <button type="submit">
          Submit Request
        </button>

      </form>

    </div>
  );
}

export default VisitorRequest;