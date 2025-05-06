import React from 'react';
import './FailedConfirmSeedModal.css'

const FailedConfirmSeedModal = ({ closeModal}) => {
  return (
    <div id="failedConfirmSeedModal" className="modal">
      <div className="modalcontent">
        <span
          className="close"
          data-modal="failedConfirmSeedModal"
          onClick={closeModal}
        >
          &times;
        </span>

        <h3>Seed Words Mismatch</h3>

        <div className="icon-container">
          <i className="bi bi-exclamation-diamond-fill check-icon"></i>
        </div>

        <button
          type="button"
          id="okFailedConfirmSeed"
          onClick={closeModal}
        >
          OK <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default FailedConfirmSeedModal;
