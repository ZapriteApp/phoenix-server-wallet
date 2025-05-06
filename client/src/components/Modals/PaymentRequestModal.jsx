import React, { useState } from 'react';
import './PaymentRequestModal.css'

const PaymentRequestModal = ({ closeModal, onNext, onInvoiceCreated }) => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateInvoice = async () => {
    const amountSat = parseInt(amount.trim());
    const rawAmount = amount.trim();
    const requestInvoiceName = name.trim();
    const requestInvoiceDescription = description.trim();
    const fullDescription = `${requestInvoiceName} - ${requestInvoiceDescription}`;
    const webhookUrl = '';
    const externalId = '';

    if (rawAmount === '') {
      setErrorMessage('The request amount cannot be empty.');
      return;
    }

    if (!/^\d+$/.test(rawAmount)) {
      setErrorMessage('Amount should be number.');
      return;
    }

    try {
      const response = await fetch('/api/createinvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: fullDescription, amountSat, externalId, webhookUrl })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.serialized) {
        setAmount('');
        setName('');
        setDescription('');
        setErrorMessage('');
        onInvoiceCreated(data.serialized);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while creating the invoice.');
    }
  };

  return (
    <div id="paymentRequestModal" className="modal">
      <div className="modalcontent">
        <span className="close" data-modal="paymentRequestModal" onClick={closeModal}>
          &times;
        </span>
        <h2>Receive</h2>
        <h3>Payment request</h3>
        <form>
          <div className="form-group">
            <label htmlFor="requestInvoiceAmount">Amount</label>
            <input
              type="text"
              id="requestInvoiceAmount"
              name="requestInvoiceAmount"
              className="form-control"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label htmlFor="requestInvoiceName">Your name (Optional)</label>
            <input
              type="text"
              id="requestInvoiceName"
              name="requestInvoiceName"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="requestInvoiceDescription">Description</label>
            <input
              type="text"
              id="requestInvoiceDescription"
              name="requestInvoiceDescription"
              className="form-control"
              placeholder="Sample description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
        {/* <div
          id="payment-request-error-message"
        ></div> */}
        {errorMessage && (
          <div id="payment-request-error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}

        <div>
          <button type="button" id="cancelPaymentRequest" onClick={closeModal}>
            <i className="bi bi-x"></i> Cancel
          </button>
          <button type="button" id="nextToSharePaymentRequest" onClick={handleCreateInvoice}>
            Create Invoice <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestModal;
