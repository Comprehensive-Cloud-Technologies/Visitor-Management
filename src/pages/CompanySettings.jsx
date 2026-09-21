import { useEffect, useState } from "react";

import {
  getCompanySettings,
  updateCompanySettings
} from "../services/companySettingsService";

function CompanySettings() {

  const [formData, setFormData] =
    useState({
      company_name: "",
      company_logo: "",
      address: "",
      email: "",
      mobile: ""
    });

  const [preview, setPreview] =
    useState("");

  useEffect(() => {

    const loadSettings = async () => {

      try {

        const response =
          await getCompanySettings();

        if (response.data.success) {

          setFormData({
            company_name:
              response.data.settings?.company_name || "",

            company_logo:
              response.data.settings?.company_logo || "",

            address:
              response.data.settings?.address || "",

            email:
              response.data.settings?.email || "",

            mobile:
              response.data.settings?.mobile || ""
          });

          setPreview(
            response.data.settings?.company_logo || ""
          );

        }

      }
      catch (error) {

        console.log(error);

      }

    };

    loadSettings();

  }, []);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleLogoUpload = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setPreview(
        reader.result
      );

      setFormData({

        ...formData,

        company_logo:
          reader.result

      });

    };

    reader.readAsDataURL(file);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response =
        await updateCompanySettings(
          formData
        );

      if (response.data.success) {

        alert(
          "Company Settings Updated Successfully"
        );

      }

    }
    catch (error) {

      console.log(error);

      alert(
        "Unable To Save Settings"
      );

    }

  };

  return (

    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow:
          "0 8px 25px rgba(0,0,0,0.08)"
      }}
    >

      <h1
        style={{
          marginBottom: "25px",
          color: "#0f172a"
        }}
      >
        Company Settings
      </h1>

      <form
        onSubmit={handleSubmit}
      >

        <div
          style={{
            marginBottom: "25px"
          }}
        >

          <label>
            Company Logo
          </label>

          <br />
          <br />

          {
            preview &&
            (
              <img
                src={preview}
                alt="Company Logo"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "10px",
                  background: "#fff"
                }}
              />
            )
          }

          <br />
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />

        </div>

        <div
          style={{
            display: "grid",
            gap: "15px"
          }}
        >

          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border:
                "1px solid #cbd5e1"
            }}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border:
                "1px solid #cbd5e1"
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border:
                "1px solid #cbd5e1"
            }}
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border:
                "1px solid #cbd5e1"
            }}
          />

        </div>

        <button
          type="submit"
          style={{
            marginTop: "25px",
            padding:
              "12px 30px",
            border: "none",
            borderRadius: "10px",
            background:
              "#2563eb",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Save Settings
        </button>

      </form>

    </div>

  );

}

export default CompanySettings;