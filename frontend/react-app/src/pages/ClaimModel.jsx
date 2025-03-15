import React, { useState } from "react";
import axios from "axios";
import "./ClaimModel.css";

function ClaimModel({ claim, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState(claim.approvedAmount);
  const [status, setStatus] = useState(claim.status);
  const [insurerComments, setInsurerComments] = useState(claim.insurerComments);

  // Determine if the file is an image
  const isImage = claim.documentPath && /\.(jpg|jpeg|png|gif)$/i.test(claim.documentPath);

  // Handle updating the claim
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://aarogya-qmzf.onrender.com/api/insurer/claims/${claim._id}`, {
        approvedAmount,
        status,
        insurerComments,
      });

      if (response.status === 200) {
        onUpdate(); 
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating claim:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2>Claim Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Claim Details */}
        <div className="modal-body">
          {/* Left Section */}
          <div className="modal-left">
            <label><strong>Name:</strong></label>
            <input type="text" value={claim.name} disabled />

            <label><strong>Claimed Amount:</strong></label>
            <input type="number" value={claim.amount} disabled />

            <label><strong>Approved Amount:</strong></label>
            {isEditing ? (
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
              />
            ) : (
              <input type="number" value={claim.approvedAmount} disabled />
            )}

            <label><strong>Status:</strong></label>
            {isEditing ? (
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <input type="text" value={claim.status} disabled />
            )}
          </div>

          {/* Right Section */}
          <div className="modal-right">
            <label><strong>Email:</strong></label>
            <input type="text" value={claim.email} disabled />

            <label><strong>Submission Date:</strong></label>
            <input type="text" value={new Date(claim.submissionDate).toLocaleDateString()} disabled />

            <label><strong>Description:</strong></label>
            <textarea value={claim.description} disabled />

            <label><strong>Insurer Comments:</strong></label>
            {isEditing ? (
              <textarea value={insurerComments} onChange={(e) => setInsurerComments(e.target.value)} />
            ) : (
              <textarea value={claim.insurerComments} disabled />
            )}
          </div>
        </div>

        {/* Document Section */}
        <div className="modal-document">
          <label><strong>Document:</strong></label>
          {isImage ? (
            <div className="document-preview">
              <img src={`https://aarogya-qmzf.onrender.com/${claim.documentPath}`} alt="Uploaded Document" />
              <a href={`https://aarogya-qmzf.onrender.com/${claim.documentPath}`} download className="download-btn">
                Download Image
              </a>
            </div>
          ) : (
            <a href={`https://aarogya-qmzf.onrender.com/${claim.documentPath}`} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimModel;
