import React from 'react';
import "./SuccessPasswordSetModal.css"

const SuccessPasswordSetModal = ({ closeModal, onSubmit }) => {
  return (
    <div id="successPasswordSetModal" className="modal">
      <div className="modalcontent">
        <span
          className="close"
          data-modal="successPasswordSetModal"
          onClick={closeModal}
        >
          &times;
        </span>

        <h3>Success. Password Set!</h3>

        <div className="icon-container">
          <i className="bi bi-check-circle check-icon"></i>
        </div>

        <button
          type="button"
          id="submitSuccessPasswordSet"
          onClick={closeModal}
        >
          OK <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default SuccessPasswordSetModal;
