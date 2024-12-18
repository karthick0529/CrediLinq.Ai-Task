import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    companyUEN: "",
    companyName: "",
    fullName: "",
    position: "",
    email: "",
    reEmail: "",
    phoneNumber: "",
    files: [],
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    if (selectedFiles.length + formData.files.length > 6) {
      setErrors({ ...errors, files: "You can only upload a maximum of 6 files." });
      return;
    }
  
    setFormData({
      ...formData,
      files: [...formData.files, ...selectedFiles],
    });
  
    // Initialize status for each new file
    const newStatuses = selectedFiles.map((file) => ({
      fileName: file.name,
      status: "pending",
    }));
    setUploadStatus((prev) => [...prev, ...newStatuses]);
  
    // Clear any previous file upload error
    setErrors((prevErrors) => {
      const { files, ...rest } = prevErrors;
      return rest;
    });
  };
  

  const validateForm = () => {
    const errors = {};
    const uenRegex = /^[0-9]{8}[A-Z]$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+65)?[689][0-9]{7}$/;

    if (!uenRegex.test(formData.companyUEN)) {
      errors.companyUEN = "Invalid UEN format (e.g., 23141543L).";
    }
    if (!formData.companyName.trim()) {
      errors.companyName = "Company Name is required.";
    }
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required.";
    }
    if (!formData.position.trim()) {
      errors.position = "Position is required.";
    }
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (formData.email !== formData.reEmail) {
      errors.reEmail = "Emails do not match.";
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid Singapore phone number.";
    }
    if (formData.files.length === 0) {
      errors.files = "At least one file must be uploaded.";
    }
    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("companyUEN", formData.companyUEN);
        formDataToSend.append("companyName", formData.companyName);
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("position", formData.position);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        formDataToSend.append("termsAccepted", formData.termsAccepted);
  
        formData.files.forEach((file) => {
          formDataToSend.append("files", file);
        });
  
        // Simulate file uploads
        const newStatuses = uploadStatus.map((fileStatus) => ({
          ...fileStatus,
          status: "success", // Simulating success
        }));
  
        setUploadStatus(newStatuses);
        // await axios.post("http://localhost:5000/api/submit", formDataToSend, {

        await axios.post("https://credilinq-ai.onrender.com/api/submit", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        navigate("/submissions");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please try again later.");
      }
    }
  };
  

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="left-header">
          <h1>CrediLinq.Ai</h1>
        </div>
        <div className="right-header">
          <p>SME HealthCheck - Get Started</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <h3 className="section-header">Company Information</h3>

          {/* Company Information Form */}
          <div className="company-info-container">
            <div className="form-group">
              <input
                type="text"
                id="companyUEN"
                placeholder="Enter Company UEN"
                value={formData.companyUEN}
                onChange={(e) =>
                  setFormData({ ...formData, companyUEN: e.target.value })
                }
              />
              {errors.companyUEN && (
                <p className="error">{errors.companyUEN}</p>
              )}
            </div>

            {/* Company Name */}
            <div className="form-group">
              <input
                type="text"
                id="companyName"
                placeholder="Enter Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
              {errors.companyName && (
                <p className="error">{errors.companyName}</p>
              )}
            </div>
          </div>

          {/* Applicant Information */}
          <div className="form-section">
            <h3 className="section-header">Applicant Information</h3>

            <div className="applicant-info-container">
              {/* Full Name */}
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <p className="error">{errors.fullName}</p>}
              </div>

              {/* Position */}
              <div className="form-group">
                <input
                  type="text"
                  name="position"
                  id="position"
                  placeholder="Position within Company"
                  value={formData.position}
                  onChange={handleChange}
                />
                {errors.position && <p className="error">{errors.position}</p>}
              </div>
            </div>

            <div className="applicant-info-container">
              {/* Email */}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <p className="info-text">
                  The report will be delivered to this email address.
                </p>
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              {/* Re-enter Email */}
              <div className="form-group">
                <input
                  type="email"
                  name="reEmail"
                  id="reEmail"
                  placeholder="Re-enter Email"
                  value={formData.reEmail}
                  onChange={handleChange}
                />
                {errors.reEmail && <p className="error">{errors.reEmail}</p>}
              </div>
            </div>

            <div className="applicant-info-container">
              {/* Mobile Number */}
              <div className="form-group">
                <div className="mobile-number-container">
                  {/* Input box with country code and phone number */}
                  <div className="phone-number-input">
                    <span className="country-code">+65</span>
                    <input
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Enter Mobile Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="phone-input"
                    />
                  </div>

                  {/* Error message */}
                  {errors.phoneNumber && (
                    <p className="error">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Documents */}
          <div className="form-section">
            <h3 className="section-header">Upload Documents</h3>
            <div className="upload-container">
              {/* Left: File Upload with Uploaded Files */}
              <div className="upload-box">
                <label htmlFor="fileUpload">
                  <div className="upload-placeholder">
                    <span className="icon">&#128194;</span>
                    <p>Click to upload or drag and drop Bank Statements</p>
                  </div>
                  <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf"
                    style={{ display: "none" }}
                  />
                </label>
                {errors.files && <p className="error">{errors.files}</p>}

                {/* Uploaded Files List */}
                <div className="uploaded-files">
                  <h4>Uploaded Files:</h4>
                  <ul>
                    {formData.files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Upload Instructions */}
              <div className="upload-instructions">
                <ul>
                  <li>
                    <span className="tick">&#10003;</span> PDFs (not scanned
                    copies) of company's operating bank statements for the past
                    6 months.
                  </li>
                  <li>
                    <span className="tick">&#10003;</span> If today is 02 Dec
                    24, upload bank statements from Jun 24 to Nov 24 (both
                    months inclusive).
                  </li>
                  <li>
                    <span className="tick">&#10003;</span> If your company is
                    multi-banked, upload 6 months of bank statements for each
                    account.
                  </li>
                  <li>
                    <span className="tick">&#10003;</span> Remove password
                    protection from files before uploading to avoid submission
                    issues.
                  </li>
                  <li>
                    <span className="tick">&#10003;</span> Facing issues?
                    Contact{" "}
                    <a href="mailto:support@credlinq.ai">support@credlinq.ai</a>
                    .
                  </li>
                </ul>
              </div>
            </div>
            <div className="uploaded-files">
  {uploadStatus.map((file, index) => (
    <div
      key={index}
      className={`upload-chip ${
        file.status === "success" ? "success" : "failed"
      }`}
    >
      {file.fileName} - {file.status.toUpperCase()}
    </div>
  ))}
</div>

          </div>

          {/* Terms and Conditions Section */}
          <div className="terms-section">
            <h3 className="section-header">Terms and Conditions</h3>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="termsCheckbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label htmlFor="termsCheckbox">
                By ticking, you are confirming that you have understood and are
                agreeing to the details mentioned:
              </label>
            </div>
            <ul>
              <li>
                <span className="tick">&#10003;</span> I confirm that I am the
                authorized person to upload bank statements on behalf of my
                company.
              </li>
              <li>
                <span className="tick">&#10003;</span> I assure that the
                uploaded bank statements and provided company information match
                and are of the same company. If there is a mismatch, my report
                will not be generated.
              </li>
              <li>
                <span className="tick">&#10003;</span> I understand that this is
                a general report based on the bank statements, and Credilinq is
                not providing a solution or guiding me for my business growth.
              </li>
            </ul>
            <span className="tick">&#10003;</span>I have read and understand the{" "}
            <a href="https://smehealthcheck.credilinq.ai/terms-and-conditions">Terms & Conditions</a>.
          </div>

          <div className="button-container">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
