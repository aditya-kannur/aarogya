import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./ClaimForm.css";

const ClaimForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    description: "",
    document: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
    // Clear error for field when modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Enter a valid amount";
    if (!formData.description || formData.description.length < 10) newErrors.description = "Description must be at least 10 characters";
    if (!formData.document) newErrors.document = "File upload is required";
    if (!user) newErrors.user = "User authentication failed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const userID = user?.sub;
    const role = localStorage.getItem("userRole");

    const data = new FormData();
    data.append("userID", userID);
    data.append("role", role);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("amount", formData.amount);
    data.append("description", formData.description);
    data.append("document", formData.document);

    try {
      const response = await axios.post("https://aarogya-qmzf.onrender.com/api/patient/submit", data);
      if (response.status === 201) {
        setIsSuccess(true);
        if (onSuccess) onSuccess(); // Refresh parent data immediately
      }
    } catch (err) {
      alert("Error submitting claim, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="modal-overlay">
        <div className="modal-content claim-modal">
          <div className="success-content">
            <div className="success-icon-container">
              <span className="success-icon">✓</span>
            </div>
            <h2>Claim Submitted!</h2>
            <p>Your claim has been successfully submitted and is now pending review.</p>
            <button className="success-close-btn" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content claim-modal">
        <div className="modal-header">
          <h2>Submit a Claim</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter patient name"
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Claim Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.amount && <p className="error">{errors.amount}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe the reason for this claim..."
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="document-upload"
                name="document"
                onChange={handleChange}
              />
              <label htmlFor="document-upload" className="file-upload-label">
                {formData.document ? (
                  <span>{formData.document.name}</span>
                ) : (
                  <span>Drag & drop or Click to Upload Image</span>
                )}
              </label>
            </div>
            {errors.document && <p className="error">{errors.document}</p>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ClaimForm;
