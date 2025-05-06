import React from 'react';
import QRCode from 'react-qr-code';
import './OfferQRCodeModal.css'
const OfferQRModal = ({ closeModal, bolt12String }) => {
  
  return (
    <div id="offerQRModal" className="modal">
      <div className="modalcontent">
        <span id="xShowPaymentOffer" className="close" data-modal="offerQRModal" onClick={closeModal}>
          &times;
        </span>
        <h2>Bolt12 Offer QR-Code</h2>
        <div id="barcodeContainer" className="barcode">
          <div id="offerQRBarcode">
            <QRCode 
              value={bolt12String}
              size={245}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        <button type="button" id="closeShowPaymentOffer" onClick={closeModal}>
          <i className="bi bi-x"></i>Close
        </button>
        <button type="button" id="doneShowPaymentOffer" onClick={closeModal}>
          Done <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default OfferQRModal;
