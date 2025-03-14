import React from "react";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./ClaimForm.css"; 

const ClaimForm = ({ onClose }) => {
  const { user } = useAuth0();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userID = user?.sub;
    const role = localStorage.getItem("userRole");

    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("role", role);
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("document", data.document[0]); 
    try {
      const response = await axios.post("http://localhost:5000/api/patient/submit", formData);
      if (response.status === 201) { // Check for status 201 (Created)
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
        {/* Header with Close Button */}
        <div className="modal-header">
          <h2>Submit a Claim</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Claim Amount</label>
            <input
              type="number"
              {...register("amount", { required: "Claim amount is required", min: 1 })}
            />
            {errors.amount && <p className="error">{errors.amount.message}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register("description", { required: "Description is required", minLength: 10 })}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label>Upload Document</label>
            <input
              type="file"
              {...register("document", { required: "File upload is required" })}
            />
            {errors.document && <p className="error">{errors.document.message}</p>}
          </div>

          <button type="submit" className="submit-btn">Submit Claim</button>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
