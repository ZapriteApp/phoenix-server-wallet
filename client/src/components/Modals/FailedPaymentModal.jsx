import React from 'react';
import '../Modals/Modal.css'
import './FailedPaymentModal.css'


const FailedPaymentModal = ({closeModal, errorMessage}) => {
  return (
    <div id="failedPaymentModal" className="modal">
      <div className="modalcontent">
        <span className="close" data-modal="failedPaymentModal" onClick={closeModal}>
          &times;
        </span>
        <h3>Failed Transaction</h3>
        <div id="failed-payment-error-message"><p>{errorMessage || 'An unknown error occurred.'}</p></div>
        <div className="icon-container">
          <i className="bi bi-exclamation-diamond-fill check-icon"></i>
        </div>
        <button type="button" id="okFailedPayment" onClick={closeModal}>
          OK <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default FailedPaymentModal;
