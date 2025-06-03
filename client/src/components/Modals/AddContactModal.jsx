import React from 'react';
import '../Modals/Modal.css'
import './AddContactModal.css'
const AddContactModal = ({
  closeModal,
  onAddContact,
  onCancel,
  onChange,
  errorMessage
}) => {
  return (
    <div id="addContactModal" className="modal">
      <div className="modalcontent">
        <span
          className="close"
          data-modal="addContactModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>New Contact</h2>
        <h3>Contact Information</h3>
        <form>
          <div className="form-group">
            <label htmlFor="addContactName">Name*:</label>
            <input
              type="text"
              id="addContactName"
              name="addContactName"
              className="form-control"
              placeholder="Satoshi Nakamoto"
              // value={formValues.addContactName}
              onChange={onChange}
            />

            <label htmlFor="addContactOffer">Offer:</label>
            <input
              type="text"
              id="addContactOffer"
              name="addContactOffer"
              className="form-control"
              placeholder="lno1zrxq8pjw7qjlm68mtp7e3yvxee4y5xrgj"
              // value={formValues.addContactOffer}
              onChange={onChange}
            />

            <label htmlFor="addContactAddress">Lightning Address:</label>
            <input
              type="text"
              id="addContactAddress"
              name="addContactAddress"
              className="form-control"
              placeholder="Paste a lightning address"
              // value={formValues.addContactAddress}
              onChange={onChange}
            />
          </div>

          {errorMessage && (
            <div
              id="add-contact-error-message"
            >
              {errorMessage}
            </div>
          )}
        </form>

        <button type="button" id="cancelAddContact" onClick={onCancel}>
          <i className="bi bi-arrow-left" /> Cancel
        </button>
        <button type="button" id="addContact" onClick={onAddContact}>
          Add Contact <i className="bi bi-check2" />
        </button>
      </div>
    </div>
  );
};

export default AddContactModal;
