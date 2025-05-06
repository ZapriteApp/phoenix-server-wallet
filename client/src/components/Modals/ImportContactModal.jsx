import React from 'react';
import QRCode from 'react-qr-code';
import './ImportContactModal.css'

const ImportContactModal = ({ closeModal, contactsString}) => {
  return (
    <div id="importContactModal" className="modal">
      <div className="modalcontent">
        <span
          id="ximportContactModal"
          className="close"
          data-modal="importContactModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Import Contacts</h2>
        <h3>Scan the QR code to import wallet contacts</h3>
        <div id="barcodeContainer" className="barcode">
          <div id="importContactQRCode">
          <QRCode 
              value={contactsString}
              size={245}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>
        <button type="button" id="closeContactModal" onClick={closeModal}>
          <i className="bi bi-x"></i> Close
        </button>
        <button type="button" id="doneImportContactModal" onClick={closeModal}>
          Done <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default ImportContactModal;
