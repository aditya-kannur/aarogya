import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./ClaimForm.css"; 

const ClaimForm = ({ onClose }) => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    description: "",
    document: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
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
      const response = await axios.post("http://localhost:5000/api/patient/submit", data);
      if (response.status === 201) {
        alert("Claim submitted successfully!");
        onClose();
      }
    } catch (err) {
      alert("Error submitting claim, please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Submit a Claim</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Claim Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
            {errors.amount && <p className="error">{errors.amount}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <input type="file" name="document" onChange={handleChange} />
            {errors.document && <p className="error">{errors.document}</p>}
          </div>

          <button type="submit" className="submit-btn">Submit Claim</button>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
