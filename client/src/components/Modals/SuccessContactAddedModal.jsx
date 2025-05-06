import React from 'react';
import '../Modals/Modal.css'
import './SuccessContactAddedModal.css'

const SuccessContactAddedModal = ({closeModal}) => {
  return (
    <div id="successContacAddedModal" className="modal">
      <div className="modalcontent">
        <span className="close" onClick={closeModal} data-modal="successContactAddedModal">
          &times;
        </span>
        <h3>Contact Added Successfully</h3>
        <div className="icon-container">
          <i className="bi bi-check-circle check-icon"></i>
        </div>
        <button type="button" id="submitSuccessContactAddedModal" onClick={closeModal}>
          OK <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default SuccessContactAddedModal;