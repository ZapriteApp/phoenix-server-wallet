import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import './SharePaymentRequestModal.css'
import { handleCopy } from '../../utils';


const SharePaymentRequestModal = ({
  closeModal,
  invoiceString,
  onCopyInvoice,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = (text, ItemId) => {
    handleCopy(text, () => {
      setCopied(ItemId);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div id="sharePaymentRequestModal" className="modal">
      <div className="modalcontent">
        <span
          id="xsharePaymentRequestModal"
          className="close"
          data-modal="sharePaymentRequestModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Share Payment Request</h2>

        <div id="barcodeContainer" className="barcode">
          <div id="barcode">
            <QRCode
              value={invoiceString}
              size={245}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        <div className="string-box">
          <input
            type="text"
            id="invoiceString"
            className="invoice-string"
            value={invoiceString}
            readOnly
          />
          <button className="copy-btn" type="button" onClick={() => handleCopyClick(invoiceString, "invoiceString")}>
            {copied ? (
              <i className="bi bi-check-lg"></i>
            ) : (
              <i className="bi bi-copy"></i>
            )}
          </button>
        </div>

        <button type="button" id="closeSharePaymentRequest" onClick={closeModal}>
          <i className="bi bi-x"></i>Close
        </button>
        <button type="button" id="doneSharePaymentRequest" onClick={closeModal}>
          Done <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default SharePaymentRequestModal;
