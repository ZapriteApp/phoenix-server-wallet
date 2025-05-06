import React from 'react';
import './ShowTranscationModal.css'

const ShowTransactionModal = ({ closeModal, transactionData }) => {
  return (
    <div id="showTransactiontModal" className="modal">
      <div className="modalcontent">
        <span
          id="xshowTransactionModal"
          className="close"
          data-modal="showTransactiontModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Transaction Details</h2>
        <div id="transactionDetailsGrid" className="transaction-grid">
          {transactionData && Object.entries(transactionData).map(([key, value]) => {
            if (value !== undefined && value !== null) {
              return (
                  <>
                    <div className='showTransctionModalKey'>{key}</div>
                    <div>{value}</div>
                  </> 
              );
            }
            return null;
          })}
        </div>
        <button
          type="button"
          id="doneTransactionModal"
          onClick={closeModal}
        >
          Done <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default ShowTransactionModal;
