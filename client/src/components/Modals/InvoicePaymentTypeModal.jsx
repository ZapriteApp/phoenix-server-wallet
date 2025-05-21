import React, {useState} from 'react';
import '../Modals/Modal.css'
import './InvoicePaymentTypeModal.css'

const InvoicePaymentTypeModal = ({ backToPaymentTypeModal, closeModal, openSuccessfulPaymentModal, openFailedPaymentModal }) => {
  const [invoice, setInvoice] = useState('');
  const [amountSat, setAmountSat] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [decodeInvoiceVisible, setDecodeInvoiceVisible] = useState(false);
  const [paymentFailedReason, setPaymentFailedReason] = useState('');
  const [memo, setMemo] = useState('-');
  const [amount, setAmount] = useState('-');
  const [loading, setLoading] = useState(false);
  

  const handleInvoiceInput = async (e) => {
    const value = e.target.value.trim();
    setInvoice(value);
    setDecodeInvoiceVisible(true);

    if (value !== '') {
      try {
        const response = await fetch('/api/decodeinvoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ invoice: value })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.description) {
          setMemo(truncateText(`Payment to ${data.description}`));
        } else {
          setMemo('-');
        }

        if (data.amount) {
          setAmount(`${data.amount / 1000} sats`);
        } else {
          setAmount('- sats');
        }

        setDecodeInvoiceVisible(true);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        setMemo('-');
        setAmount('-');
      }
    } else {
      setMemo('-');
      setAmount('-');
    }
  };

  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleInvoicePayment = async () => {
    setLoading(true);
    setErrorMessage('');
    const trimmedInvoice = invoice.trim();
    let amount = parseInt(amountSat, 10);

    if (trimmedInvoice === '') {
      setErrorMessage('The request invoice cannot be empty.');
      return;
    }

    try {
      const decodeResponse = await fetch('/api/decodeinvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoice: trimmedInvoice }),
      });

      if (!decodeResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const decodeData = await decodeResponse.json();

      if (decodeData.amount) {
        const payResponse = await fetch('/api/payinvoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amountSat: amount, invoice: trimmedInvoice }),
        });

        if (!payResponse.ok) {
          throw new Error('Network response was not ok ' + payResponse.statusText);
        }

        const payData = await payResponse.json();

        if (payData.reason) {
          setPaymentFailedReason(capitalizeFirstLetter(payData.reason));
          setErrorMessage(payData.reason)
          openFailedPaymentModal(payData.reason);
          return
        } else {
          openSuccessfulPaymentModal();
          setInvoice('');
          setAmountSat('');
         
        }
      } else {
        setErrorMessage('The request invoice is not decodable.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while validating the invoice.');
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <div id="invoicePaymentType" className="modal payInvoiceModal">
      <div
        className="modalcontent"
      >
        <span className="close" data-modal="invoicePaymentType" onClick={closeModal}>
          &times;
        </span>
        <h2>Send</h2>
        <h3>Pay invoice</h3>
        <form>
          <div className="form-group">
            <label htmlFor="requestInvoice">Request*</label>
            <input
              type="text"
              id="requestInvoice"
              name="requestInvoice"
              className="form-control"
              placeholder="Enter Request Invoice "
              value={invoice}
              onChange={handleInvoiceInput}
            />
          </div>
        </form>

        {errorMessage && (
          <div id="invoice-error-message" className="error-message">
            {errorMessage}
          </div>
        )}
       {decodeInvoiceVisible && (
          <div className="decode-invoice">
            <div className="decoded-invoice-item">
              <p className="memo">Memo: </p>
              <p className="memo">{memo}</p>
            </div>
            <div className="decoded-invoice-item">
              <p className="invoiceAmount">Amount:</p>
              <p className="invoiceAmount">{amount}</p>
            </div>
            <div className="decoded-invoice-item">
              <p className="fees">Fee:</p>
              <p className="fees">- sats</p>
            </div>
          </div>
        )}

        <button type="button" id="backToPaymentType" onClick={backToPaymentTypeModal}>
          <i className="bi bi-arrow-left"> </i>Back
        </button>
        <button type="button" id="submitInvoice" onClick={handleInvoicePayment}  disabled={loading}>
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

export default InvoicePaymentTypeModal;
