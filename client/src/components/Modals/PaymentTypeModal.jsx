import React from 'react';
import '../Modals/Modal.css'
import './PaymentTypeModal.css'
const PaymentTypeModal = ({ closeModal, openContactTypePaymentModal, openInvoiceTypePaymentModal, openOfferTypePaymentModal }) => {
    return (
        <>
          <div id="" className="modal">

                <div className="modalcontent">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Send</h2>
                    <h3>Payment type</h3>
                    <form id="paymentForm">
                        <div className="payment-button-group">
                            <button type="button" className="paymentOption" onClick={openContactTypePaymentModal} data-value="contact" id="contactPaymentOption">Contact
                                <i className="bi bi-arrow-right"></i></button>
                            <button type="button" className="paymentOption" onClick={openInvoiceTypePaymentModal} data-value="invoice" id="invoicePaymentOption">Invoice
                                <i className="bi bi-arrow-right"></i></button>
                            <button type="button" className="paymentOption" onClick={openOfferTypePaymentModal} data-value="offer" id="offerPaymentOption">Offer <i
                                className="bi bi-arrow-right"></i></button>
                        </div>
                        <button type="button" id="cancelSendRequest" onClick={closeModal}>Cancel <i className="bi bi-x"></i></button>
                    </form>
                </div>
            </div>

        </>

    );
};

export default PaymentTypeModal;
