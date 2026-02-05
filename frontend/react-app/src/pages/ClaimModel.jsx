import React, { useState } from "react";
import axios from "axios";
import "./ClaimModel.css";

function ClaimModel({ claim, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // Mutable State for all fields
  const [name, setName] = useState(claim.name);
  const [email, setEmail] = useState(claim.email);
  const [amount, setAmount] = useState(claim.amount);
  const [description, setDescription] = useState(claim.description);

  const [approvedAmount, setApprovedAmount] = useState(claim.approvedAmount);
  const [status, setStatus] = useState(claim.status);
  const [insurerComments, setInsurerComments] = useState(claim.insurerComments || "");

  // Fix Image URL Logic for Cloudinary
  const isCloudinary = claim.documentPath && claim.documentPath.startsWith("http");
  const documentUrl = claim.documentPath
    ? (isCloudinary ? claim.documentPath : `https://aarogya-qmzf.onrender.com/${claim.documentPath}`)
    : null;

  const isImage = claim.documentPath && /\.(jpg|jpeg|png|gif)$/i.test(claim.documentPath);


  // Handle updating the claim
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://aarogya-qmzf.onrender.com/api/insurer/claims/${claim._id}`, {
        name,
        email,
        amount,
        description,
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
      <div className="modal-content insurer-claim-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>Claim Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Claim Details Body */}
        <div className="modal-body">
          {/* Left Section */}
          <div className="modal-left">
            <div className="field-group">
              <label>Patient Name</label>
              {isEditing ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <div className="static-value">{name}</div>
              )}
            </div>

            <div className="field-group">
              <label>Email Address</label>
              {isEditing ? (
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              ) : (
                <div className="static-value">{email}</div>
              )}
            </div>

            <div className="field-group">
              <label>Submission Date</label>
              <div className="static-value">{new Date(claim.submissionDate).toLocaleDateString()}</div>
            </div>

            <div className="field-group">
              <label>Claimed Amount</label>
              {isEditing ? (
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              ) : (
                <div className="static-value">${amount}</div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="modal-right">
            <div className="field-group">
              <label>Status</label>
              {isEditing ? (
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <div className="static-value" style={{ color: status === "Approved" ? "#4caf50" : status === "Rejected" ? "#ff6b6b" : "orange" }}>
                  {status}
                </div>
              )}
            </div>

            <div className="field-group">
              <label>Approved Amount ($)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                />
              ) : (
                <div className="static-value">${approvedAmount}</div>
              )}
            </div>

            <div className="field-group">
              <label>Insurer Comments</label>
              {isEditing ? (
                <textarea value={insurerComments} onChange={(e) => setInsurerComments(e.target.value)} placeholder="Add comments..." />
              ) : (
                <div className="static-value" style={{ height: "auto", minHeight: "80px" }}>{insurerComments || "No comments provided."}</div>
              )}
            </div>

            <div className="field-group">
              <label>Patient Description</label>
              {isEditing ? (
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ height: "100px" }} />
              ) : (
                <div className="static-value" style={{ height: "auto", minHeight: "60px", color: "rgba(255,255,255,0.7)" }}>
                  {description}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Section */}
        <div className="modal-document">
          <label>Attached Document</label>
          {documentUrl ? (
            <div className="document-preview">
              {isImage || isCloudinary ? ( // Assume Cloudinary handles images nicely or browser can try to render
                <>
                  <img
                    src={documentUrl}
                    alt="Uploaded Document"
                    className="doc-img"
                    onClick={() => window.open(documentUrl, "_blank")}
                  />
                  <div className="doc-actions">
                    <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      View Full Image
                    </a>
                    <a href={documentUrl} download className="btn-secondary">
                      Download
                    </a>
                  </div>
                </>
              ) : (
                <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  View Document (PDF/File)
                </a>
              )}
            </div>
          ) : (
            <div className="static-value">No document attached.</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="action-btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="action-btn save" onClick={handleUpdate}>Save Changes</button>
            </>
          ) : (
            <button className="action-btn edit" onClick={() => setIsEditing(true)}>Edit Claim</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimModel;
