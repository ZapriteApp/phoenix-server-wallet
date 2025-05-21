import React, { useState } from 'react';
import '../Modals/Modal.css'
import './OfferPaymentTypeModal.css'

const OfferPaymentTypeModal = ({ backToPaymentTypeModal, closeModal, openSuccessfulPaymentModal, openFailedPaymentModal }) => {
  const [offer, setOffer] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOfferPayment = async () => {
    const trimmedOffer = offer.trim();
    const trimmedAmount = amount.trim();
    const trimmedDescription = description.trim();

    if (trimmedAmount === '') {
      setErrorMessage('Amount cannot be empty.');
      return;
    }

    if (!/^\d+$/.test(trimmedAmount)) {
      setErrorMessage('Amount should be a number.');
      return;
    }

    if (trimmedOffer === '') {
      setErrorMessage('Offer cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/decodeoffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offer: trimmedOffer }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.chain) {
        const payResponse = await fetch('/api/payoffer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountSat: trimmedAmount,
            offer: trimmedOffer,
            message: trimmedDescription,
          }),
        });

        const payData = await payResponse.json();

        if (payData.reason) {
          openFailedPaymentModal(payData.reason);
        } else {
          openSuccessfulPaymentModal();
          setOffer('');
          setAmount('');
          setDescription('');
          setErrorMessage('');
        }
      } else {
        setErrorMessage('The request offer is not decodable.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred while decoding the offer.');
    }
  };
  return (
    <div id="offerPaymentType" className="modal">
      <div className="modalcontent">
        <span className="close" data-modal="offerPaymentType" onClick={closeModal} >
          &times;
        </span>
        <h2>Send</h2>
        <h3>Pay offer</h3>
        <form>
          <div className="form-group">
            <label htmlFor="requestOffer">Enter Request Offer:</label>
            <input
              type="text"
              id="requestOffer"
              name="requestOffer"
              className="form-control"
              placeholder="Enter Request Offer"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
            <label htmlFor="offerAmount">Amount:</label>
            <input
              type="text"
              id="offerAmount"
              name="offerAmount"
              className="form-control"
              placeholder="100,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label htmlFor="offerDescription">Description:</label>
            <input
              type="text"
              id="offerDescription"
              name="offerDescription"
              className="form-control"
              placeholder="Payment to demo@zaprite.com"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
        {errorMessage && (
          <div id="offer-error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}
        <button type="button" id="backToPaymentType" onClick={backToPaymentTypeModal}>
          <i className="bi bi-arrow-left"> </i>Back
        </button>
        <button type="button" id="submitOffer" onClick={handleOfferPayment} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {' '}Sending...
            </>
          ) : (
            <>
              Send <i className="bi bi-check2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OfferPaymentTypeModal;
