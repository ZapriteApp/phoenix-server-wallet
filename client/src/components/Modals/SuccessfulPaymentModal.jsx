import React from 'react';
import '../Modals/Modal.css'
import './SuccessfulPaymentModal.css'

const SuccessfulPaymentModal = ({closeModal}) => {
  return (
    <div id="successfulPaymentModal" className="modal">
      <div className="modalcontent">
        <span className="close" data-modal="successfulPaymentModal">
          &times;
        </span>
        <h3>Success</h3>
        <div className="icon-container">
          <i className="bi bi-check-circle check-icon"></i>
        </div>
        <button type="button" id="submitPaymentSuccess" onClick={closeModal}>
          OK <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default SuccessfulPaymentModal;
