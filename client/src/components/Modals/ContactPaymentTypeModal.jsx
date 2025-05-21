import React, { useEffect, useState } from 'react';
import './ContactPaymentTypeModal.css'

const ContactPaymentTypeModal = ({
  backToPaymentTypeModal,
  closeModal,
  openSuccessfulPaymentModal,
  openFailedPaymentModal
}) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [destinationType, setDestinationType] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetch('/api/getcontacts')
      .then(response => {
        return response.json();
      })
      .then(data => {
        setContacts(data.contacts || []);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  }, []);

  const handleContactPayment = async () => {
    setError('');
    setLoading(true);


    if (!selectedContact) return setError('You have not selected a contact.');
    if (!destinationType) return setError('Choose a payment destination.');
    if (!amount) return setError('Amount cannot be empty.');
    if (!/^\d+$/.test(amount)) return setError('Amount should be a number.');

    const amountSat = parseInt(amount);
    const contact = contacts.find(c => c.id === selectedContact);

    try {
      if (destinationType === 'offer') {
        const offer = contact?.offer;
        const response = await fetch('/api/payoffer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountSat, offer, message }),
        });

        const data = await response.json();
        if (!response.ok || data.reason) {
          setError(data.reason || 'Payment failed.');
          openFailedPaymentModal(data.reason);
          return;
        }

      } else if (destinationType === 'address') {
        const lnAddress = contact?.address;
        if (!lnAddress) {
          setError('This contact has no address.');
          return;
        }

        const response = await fetch('/api/paylnaddress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amountSat, lnAddress, message }),
        });

        const data = await response.json();
        if (!response.ok || data.reason) {
          setError(data.reason || 'Payment failed.');
          openFailedPaymentModal(data.reason);
          return;
        }
      }

      openSuccessfulPaymentModal();
      setSelectedContact('');
      setDestinationType('');
      setAmount('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError('Unexpected error during payment.');
      openFailedPaymentModal();
    }
  };

  return (
    <div id="contactPaymentType" className="modal">
      <div className="modalcontent">
        <span className="close" data-modal="contactPaymentType" onClick={closeModal} >&times;</span>
        <h2>Send</h2>
        <h3>Pay contact</h3>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="paymentContact">Contact*:</label>
            <select id="paymentContact" name="paymentContact" className="form-control" defaultValue=""  value={selectedContact}
              onChange={e => setSelectedContact(e.target.value)}>
              <option value="" disabled>
                Choose contact
              </option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
            <label htmlFor="paymentContact">Choose payment destination*:</label>
            <select id="paymentDestinationType" name="paymentContact" className="form-control" defaultValue="" value={destinationType}
              onChange={e => setDestinationType(e.target.value)}>
              <option value="" disabled>Pay to contact offer or address</option>
              <option value="offer">Offer</option>
              <option value="address">Address</option>
            </select>

            <label htmlFor="contactPaymentAmount">Amount:</label>
            <input
              type="text"
              id="contactPaymentAmount"
              name="contactPaymentAmount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="form-control"
              placeholder="Add an amount in sats.."
            />

            <label htmlFor="contactPaymentDescription">Description:</label>
            <input
              type="text"
              id="contactPaymentDescription"
              name="contactPaymentDescription"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="form-control"
              placeholder="Optional"
            />
          </div>
        </form>

        {error && <div id="contact-error-message">{error}</div>}

        <button type="button" id="backToPaymentType" onClick={backToPaymentTypeModal}>
          <i className="bi bi-arrow-left"> </i>Back
        </button>
        <button type="button" id="submitContact" onClick={handleContactPayment} disabled={loading}>
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

export default ContactPaymentTypeModal;
