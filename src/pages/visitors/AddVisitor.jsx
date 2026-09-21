import { useState, useRef,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

import { addVisitor } from "../../services/visitorService";

import "./AddVisitor.css";
import { useLocation } from "react-router-dom";
import {
  getEmployees
} from "../../services/employeeService";
import {
FaUser,
FaIdCard,

FaUsers,
FaLaptop,
FaClipboardList,
FaSignature,
FaCalendarAlt,
FaBuilding,
FaPhone,
FaEnvelope,
FaUserTie,
FaCamera,
FaPlus,
FaTrash,
FaEdit,
FaBoxOpen
} from "react-icons/fa";
function AddVisitor() {

  const navigate = useNavigate();

  const sigCanvas = useRef(null);

  const [photoPreview, setPhotoPreview] =
    useState(null);

 const [formData, setFormData] =
useState({

  visitor_name: "",
  mobile: "",
  email: "",
  company_name: "",

  visitor_type: "",      // NEW
 visitor_type_other: "",

  purpose: "",
  purpose_other: "",
  has_companion: "0",
companion_name: "",
companion_mobile: "",
companion_relationship: "",


has_asset: 0,

asset_type: "",

asset_name: "",



asset_remarks: "",
  visit_date: "",

  check_in: "",

  remarks: "",

  id_proof: "",

  visitor_photo: "",

  employee_id:"",

  id_proof_number: ""

});
const [assets, setAssets] = useState([]);
const [showAssetForm, setShowAssetForm] =
useState(false);

const [editingAsset, setEditingAsset] =
useState(null);
const emptyAsset = {

    asset_type: "",

    asset_name: "",

    serial_number: "",

    asset_remarks: "",

    asset_photo: ""

};

const [assetForm,setAssetForm] =
useState(emptyAsset);
const [employees, setEmployees] =
  useState([]);
  useEffect(() => {

  const loadEmployees = async () => {

    try {

      const response =
        await getEmployees();

      if(response.data.success){

        setEmployees(
          response.data.employees
        );

      }

    }
    catch(error){

      console.log(error);

    }

  };

  loadEmployees();

}, []);
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

const handleAssetInput = (e) => {

    if (e.target.name === "asset_photo") {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {

            setAssetForm({

                ...assetForm,

                asset_photo: reader.result

            });

        };

        reader.readAsDataURL(file);

    }

    else {

        setAssetForm({

            ...assetForm,

            [e.target.name]: e.target.value

        });

    }

};
const saveAsset = () => {

    const errors = [];

    if (!assetForm.asset_type.trim()) {

        errors.push("•  Please Select Asset Type");

    }

    if (!assetForm.asset_name.trim()) {

        errors.push("• Asset Name");

    }

   if (!assetForm.serial_number.trim()) {

    errors.push("• Serial Number");

}

    if (errors.length > 0) {

        alert(
            "Please fill the following fields:\n\n" +
            errors.join("\n")
        );

        return;

    }

    if (editingAsset !== null) {

        const updated = [...assets];

        updated[editingAsset] = assetForm;

        setAssets(updated);

    } else {

        setAssets([
            ...assets,
            assetForm
        ]);

    }

    setAssetForm(emptyAsset);

    setEditingAsset(null);

    setShowAssetForm(false);

};
const editAsset = (index) => {

    setEditingAsset(index);

    setAssetForm(
        assets[index]
    );

    setShowAssetForm(true);

};
const deleteAsset = (index) => {

    setAssets(

        assets.filter(
            (_,i)=>
            i!==index
        )

    );

};

const handlePhotoUpload = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {

    setPhotoPreview(reader.result);

    setFormData(prev => ({
      ...prev,
      visitor_photo: reader.result
    }));

  };

  reader.readAsDataURL(file);

};
const location = useLocation();
const isRequestMode = location.state?.mode === "request";
  const handleSubmit = async (e) => {
  e.preventDefault();

  const signature =
    sigCanvas.current?.isEmpty()
      ? ""
      : sigCanvas.current.getCanvas().toDataURL("image/png");
if (
    formData.mobile &&
    formData.mobile.length !== 10
) {

    alert("Please enter a valid mobile number.");

    return;

}

if (
    formData.companion_mobile &&
    formData.companion_mobile.length !== 10
) {

    alert("Please enter a valid companion mobile number.");

    return;

}

if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
) {

    alert("Please enter a valid email address.");

    return;

}

const today = new Date().toISOString().split("T")[0];

if (
    formData.visit_date < today
) {

    alert("Visit date cannot be in the past.");

    return;

}
 const visitorData = {

...formData,

assets,

signature,

status: isRequestMode
? "Pending"
: "Approved"

};

  try {
   
    

    const response = await addVisitor(visitorData);

    if (response.data.success) {
      alert(
        isRequestMode
          ? "Visitor Request Sent for Approval"
          : "Visitor Added Successfully"
      );

      navigate("/visitor-thank-you");
    }
  } catch (error) {
    console.log(error);
    alert("Failed to process visitor");
  }
};
  return (

    <div className="visitor-page">

      <div className="visitor-hero">
        <h1>Add Visitor</h1>
      
      </div>

     

      <form
        onSubmit={handleSubmit}
        className="visitor-main-form"
      >

        {/* VISITOR IDENTITY */}

        <div className="form-section">

        <h3>
<FaIdCard className="section-icon"/>
Visitor Identity
</h3>

          <div className="identity-grid">

            <div className="photo-box">

              {
                photoPreview
                ?
                <img
                  src={photoPreview}
                  alt="Visitor"
                />
                :
                <div className="photo-placeholder">
                  <FaCamera
size={40}
/>

<p>

Upload Photo

</p>
                </div>
              }

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />

            </div>

            <div className="id-proof-box">

              <div className="id-proof-field">
                <label>
                  ID Proof Type
                </label>

                <select
                  name="id_proof"
                  value={formData.id_proof}
                  onChange={handleChange}
                >

                  <option value="">
                    Select ID Proof
                  </option>

                  <option value="Aadhar">
                    Aadhar Card
                  </option>

                  <option value="PAN">
                    PAN Card
                  </option>

                  <option value="Driving License">
                    Driving License
                  </option>

                  <option value="Passport">
                    Passport
                  </option>

                </select>
              </div>

              <div className="id-proof-field">

    <label>

        {formData.id_proof || "ID"} Number

    </label>

    <input
        type="text"
        name="id_proof_number"
        value={formData.id_proof_number}
        onChange={handleChange}
        placeholder={`Enter ${formData.id_proof || "ID"} Number`}
    />

</div>
                
              

              <div className="id-proof-field">
                <label>
                  <FaIdCard />
                  Visitor Type
                </label>

                <select
                  name="visitor_type"
                  value={formData.visitor_type}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Visitor Type
                  </option>

                  <option value="Guest">Guest</option>

                  <option value="Vendor">Vendor</option>

                  <option value="Interview">Interview Candidate</option>

                  <option value="Contractor">Contractor</option>

                  <option value="Delivery">Delivery</option>

                  <option value="Consultant">Consultant</option>

                  <option value="Government">Government Officer</option>

                  <option value="Auditor">Auditor</option>

                  <option value="Other">Other</option>

                </select>
              </div>
                 {
        formData.visitor_type === "Other" && (

            <div className="id-proof-field visitor-type-other">

                <label>
                    Specify Visitor Type
                </label>

                <input
                    type="text"
                    name="visitor_type_other"
                    value={formData.visitor_type_other}
                    onChange={handleChange}
                    placeholder="Enter Visitor Type"
                />

            </div>

        )
    }
            </div>

          </div>

        </div>

        {/* VISITOR INFORMATION */}

      {/* ================= Visitor Information ================= */}
{/* ================= Visitor Information ================= */}

<div className="form-section">

    <h3>
        <FaUser className="section-icon" />
        Visitor Information
    </h3>

    <div className="form-grid">

        {/* Visitor Name */}

        <div className="form-group">

            <label>
                <FaUser />
                Visitor Name
            </label>

            <input
                type="text"
                name="visitor_name"
                value={formData.visitor_name}
                onChange={handleChange}
                placeholder="Enter Visitor Name"
                required
            />

        </div>

        {/* Mobile */}

        <div className="form-group">

            <label>
                <FaPhone />
                Mobile Number
            </label>

           <input
    type="tel"
    name="mobile"
    value={formData.mobile}
    onChange={(e) => {

        const value = e.target.value.replace(/\D/g, "");

        if (value.length <= 10) {

            setFormData({
                ...formData,
                mobile: value
            });

        }

    }}
    placeholder="Enter Mobile Number"
    required
/>

{
    formData.mobile &&
    formData.mobile.length !== 10 && (

        <span className="error-text">
            Please enter a valid 10 digit mobile number.
        </span>

    )
}

        </div>

        {/* Email */}

        <div className="form-group">

            <label>
                <FaEnvelope />
                Email Address
            </label>

           <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter Email Address"
/>

{
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (

        <span className="error-text">
            Please enter a valid email address.
        </span>

    )
}

        </div>

        {/* Company */}

        <div className="form-group">

            <label>
                <FaBuilding />
                Company
            </label>

            <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Enter Company Name"
            />

        </div>

        {/* Person To Meet */}

        <div className="form-group">

            <label>
                <FaUserTie />
                Person To Meet
            </label>

            <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
            >

                <option value="">
                    Select Employee
                </option>

                {employees.map((emp) => (

                    <option
                        key={emp.id}
                        value={emp.id}
                    >
                        {emp.employee_name} - {emp.department}
                    </option>

                ))}

            </select>

        </div>

        {/* Purpose */}

        <div className="form-group">

            <label>
                <FaClipboardList />
                Purpose
            </label>

            <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
            >

                <option value="">
                    Select Purpose
                </option>

                <option value="Meeting">Meeting</option>

                <option value="Interview">Interview</option>

                <option value="Delivery">Delivery</option>

                <option value="Vendor Visit">Vendor Visit</option>

                <option value="Training">Training</option>

                <option value="Maintenance">Maintenance</option>

                <option value="Audit">Audit</option>

                <option value="Other">Other</option>

            </select>

        </div>

        {/* Purpose Other */}

        {formData.purpose === "Other" && (

            <div className="form-group">

                <label>
                    Specify Purpose
                </label>

                <input
                    type="text"
                    name="purpose_other"
                    value={formData.purpose_other}
                    onChange={handleChange}
                    placeholder="Enter Purpose"
                />

            </div>

        )}

    </div>

</div>
<div className="form-section">

    <h3>
        <FaUsers className="section-icon" />
        Companion Details
    </h3>

    <div className="form-grid">

        {/* Has Companion */}

        <div className="form-group">

            <label>
                Is someone accompanying?
            </label>

            <select
                name="has_companion"
                value={formData.has_companion}
                onChange={handleChange}
            >

                <option value="0">
                    No
                </option>

                <option value="1">
                    Yes
                </option>

            </select>

        </div>

        {
            formData.has_companion === "1" && (
                <>
                    <div className="form-group">

                        <label>
                            Companion Name
                        </label>

                        <input
                            type="text"
                            name="companion_name"
                            value={formData.companion_name}
                            onChange={handleChange}
                            placeholder="Enter Companion Name"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Companion Mobile
                        </label>

                        <input
    type="tel"
    name="companion_mobile"
    value={formData.companion_mobile}
    onChange={(e) => {

        const value = e.target.value.replace(/\D/g, "");

        if (value.length <= 10) {

            setFormData({
                ...formData,
                companion_mobile: value
            });

        }

    }}
    placeholder="Enter Companion Mobile"
/>

{
    formData.companion_mobile &&
    formData.companion_mobile.length !== 10 && (

        <span className="error-text">
            Please enter a valid 10 digit mobile number.
        </span>

    )
}

                    </div>
                </>
            )
        }

    </div>

</div>

{/* ===================== ASSET INFORMATION ===================== */}

<div className="form-section">

    <div className="section-header">

        <h3>
            <FaLaptop className="section-icon" />
            Asset Information
        </h3>

        {
            Number(formData.has_asset) === 1 && (

                <button
                    type="button"
                    className="add-asset-btn"
                    onClick={() => {

                        setEditingAsset(null);

                        setAssetForm(emptyAsset);

                        setShowAssetForm(true);

                    }}
                >

                    <FaPlus />

                    Add Asset

                </button>

            )
        }

    </div>

    <div className="form-grid">

        <div className="form-group">

            <label>

                Are you carrying any assets inside the premises?

            </label>

            <select
                name="has_asset"
                value={formData.has_asset}
                onChange={handleChange}
            >

                <option value={0}>
                    No
                </option>

                <option value={1}>
                    Yes
                </option>

            </select>

        </div>

    </div>

    {

        Number(formData.has_asset) === 1 && (

            <>

                <div className="asset-list">

                    {

                        assets.length === 0 ?

                            <p className="no-asset">

                                No assets have been added yet.

                                <br />

                                Click <strong>Add Asset</strong> to continue.

                            </p>

                            :

                            assets.map((asset, index) => (

                                <div
                                    className="asset-card"
                                    key={index}
                                >

                                    <div className="asset-image">

                                        {

                                            asset.asset_photo ?

                                                <img
                                                    src={asset.asset_photo}
                                                    alt=""
                                                />

                                                :

                                                <div className="no-image">

                                                    <FaBoxOpen size={28} />

                                                    <p>

                                                        No Photo

                                                    </p>

                                                </div>

                                        }

                                    </div>

                                    <div className="asset-info">

                                        <h4>

                                            {asset.asset_type}

                                        </h4>

                                        <p>

                                            {asset.asset_name}

                                        </p>

                                        <small>
                                            Serial Number: {asset.serial_number || "-"}

                                        </small>

                                        {

                                            asset.asset_remarks && (

                                                <div className="asset-remarks">

                                                    {asset.asset_remarks}

                                                </div>

                                            )

                                        }

                                    </div>

                                    <div className="asset-actions">

                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => editAsset(index)}
                                        >

                                            <FaEdit />

                                        </button>

                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => deleteAsset(index)}
                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                </div>

                            ))

                    }

                </div>

            </>

        )

    }

</div>

{

showAssetForm && (

<div className="asset-popup-overlay">

<div className="asset-popup">

<h3>

{

editingAsset !== null

?

"Edit Asset"

:

"Add New Asset"

}

</h3>

<div className="form-grid">

<div className="form-group">

<label>

Asset Type

</label>

<select
required
name="asset_type"
value={assetForm.asset_type}
onChange={handleAssetInput}
>

<option value="">

Select Asset

</option>

<option value="Laptop">

Laptop

</option>

<option value="Mobile">

Mobile

</option>

<option value="Tablet">

Tablet

</option>

<option value="Camera">

Camera

</option>

<option value="Pendrive">

Pendrive

</option>

<option value="Hard Disk">

Hard Disk

</option>

<option value="Other">

Other

</option>

</select>

</div>

<div className="form-group">

<label>

Asset Name

</label>

<input
required
type="text"
required
name="asset_name"
value={assetForm.asset_name}
onChange={handleAssetInput}
placeholder="Enter Asset Name"
/>

</div>

<div className="form-group">

<label>

Serial Number

</label>

<input
type="text"
name="serial_number"
value={assetForm.serial_number}
onChange={handleAssetInput}
placeholder="Enter Serial Number"
/>

</div>

<div className="form-group">

<label>

Asset Photo

</label>

<input
type="file"
accept="image/*"
name="asset_photo"
onChange={handleAssetInput}
/>

{

assetForm.asset_photo && (

<img
src={assetForm.asset_photo}
alt=""
className="asset-preview"
/>

)

}

</div>

<div className="form-group full-width">

<label>

Remarks

</label>

<textarea
rows="3"
name="asset_remarks"
value={assetForm.asset_remarks}
onChange={handleAssetInput}
placeholder="Additional Remarks"
/>

</div>

</div>

<div className="popup-buttons">

<button
type="button"
onClick={saveAsset}
>

Save Asset

</button>

<button
type="button"
onClick={() => setShowAssetForm(false)}
>

Cancel

</button>

</div>

</div>

</div>

)

}
       <div className="form-section">

    <h3>
        <FaCalendarAlt className="section-icon" />
        Visit Schedule
    </h3>

    <div className="form-grid visit-grid">

        <div className="form-group">

            <label>
                Visit Date
            </label>

           <input
    type="date"
    name="visit_date"
    value={formData.visit_date}
    min={new Date().toISOString().split("T")[0]}
    onChange={handleChange}
    required
/>

        </div>

        <div className="form-group">

            <label>
                Visiting Time
            </label>

            <input
                type="time"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                required
            />

        </div>

        <div className="form-group remarks-group">

            <label>
                Remarks
            </label>

            <textarea
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Additional notes"
            />

        </div>

    </div>

</div>

        {/* SIGNATURE */}

       <div className="signature-section">

    <h3>
        <FaSignature className="section-icon" />
        Visitor Signature
    </h3>

    <div className="signature-box">

        <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
                className: "signature-canvas"
            }}
        />

    </div>

    <button
        type="button"
        className="clear-sign-btn"
        onClick={() => sigCanvas.current.clear()}
    >
        Clear Signature
    </button>

</div>

        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/visitors")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            Save Visitor
          </button>

        </div>

      </form>

    </div>

  );

}

export default AddVisitor;