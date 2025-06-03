import React, { useState } from 'react';
import './UpdatePasswordModal.css'

const UpdatePasswordModal = ({  
  newPassword,
  confirmPassword,
  errorMessage,
  onChangeNewPassword,
  onChangeConfirmPassword,
  onSubmit,
  closeModal
 }) => {

  return (
    <div id="updatePasswordModal" className="modal">
      <div className="modalcontent">
        <span
          className="close"
          data-modal="updatePasswordModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Password</h2>
        <h3>Update your password</h3>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="newPassword">
              New Password <span className="required-asterisk">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-control"
              placeholder="Add a password... "
              value={newPassword}
              onChange={(e) => onChangeNewPassword(e.target.value)}
            />
            <label htmlFor="confirmPassword">
              Confirm New Password <span className="required-asterisk">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm the password... "
              value={confirmPassword}
              onChange={(e) => onChangeConfirmPassword(e.target.value)}
            />
          </div>
          {errorMessage && (
            <div id="update-password-error-message">
              {errorMessage}
            </div>
          )}
        </form>
        <button type="button" id="closeUpdatePassword" onClick={closeModal}>
          <i className="bi bi-arrow-left"> </i>Cancel
        </button>
        <button type="button" id="doneUpdatePassword" onClick={onSubmit}>
          Confirm <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
