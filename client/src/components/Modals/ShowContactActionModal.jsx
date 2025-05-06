import React from 'react';
import './ShowContactActionModal.css'

const ShowContactActionModal = ({ closeModal, contactData }) => {
  return (
    <div id="showContactActionModal" className="modal">
      <div className="modalcontent">
        <span
          id="closeContactActionModal"
          className="close"
          data-modal="closeContactActionModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Contact Details</h2>
        <div id="contactDetailsGrid" className="contacts-grid">
          {Object.entries(contactData).map(([key, value]) => (
            value !== undefined && value !== null && (
              <React.Fragment key={key}>
                <div className='showContactModalKey'>{key}</div>
                <div>{value === '' ? "~" : value}</div>
              </React.Fragment>
            )
          ))}


        </div>
        <button type="button" id="doneContactActionModal" onClick={closeModal}>
          Done <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default ShowContactActionModal;
