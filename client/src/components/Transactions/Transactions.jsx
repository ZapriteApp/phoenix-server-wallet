import React, { useState, useEffect } from "react";
import './Transactions.css'
import ShowTranscationModal from '../Modals/ShowTranscationModal'
import { intlNumberFormat } from '../../utils';


const itemsPerPage = 10;
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetch(`/api/listincomingandoutgoing`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const getInvoiceDetails = async (invoice) => {
    try {
      const res = await fetch(`/api/decodeinvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice })
      });
      if (!res.ok) throw new Error('Failed to fetch invoice details');
      return await res.json();
    } catch (err) {
      console.error('Invoice details error:', err);
      return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const truncateText = (text, limit = 30) => {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  const renderTableRows = async () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageData = transactions.slice(startIndex, startIndex + itemsPerPage);

    return await Promise.all(pageData.map(async (payment, index) => {
      let invoiceDetails = null;
      if (payment.invoice) {
        invoiceDetails = await getInvoiceDetails(payment.invoice);
      }

      const invoiceAmount = invoiceDetails?.amount ? invoiceDetails.amount / 1000 : "-";
      const invoiceDescription = invoiceDetails?.description || "~";

      const icon = payment.hasOwnProperty("receivedSat") ? "bi-arrow-down-left" : "bi-arrow-up-right";

      return (
        <tr key={`${payment.paymentHash}-${index}`}>
          <td><i className={`bi ${icon}`}></i></td>
          <td>{formatTimestamp(payment.createdAt)}</td>
          <td>{payment.description ? truncateText(payment.description) : invoiceDescription}</td>
          <td>{Number.isInteger(invoiceAmount) ? intlNumberFormat(invoiceAmount) : "~"}</td>
          <td>{payment.hasOwnProperty("receivedSat") ? "Payment" : "Transfer"}</td>
          <td>{payment.isPaid ? 'Completed' : 'Uncompleted'}</td>
          <td>
            <button
              className="transaction-action-btn transaction-action-btn-icon"
              onClick={() => setSelectedTransaction({
                paymentHash: payment.paymentHash,
                preimage: payment.preimage,
                invoice: payment.invoice,
                createdAt: payment.createdAt ? formatTimestamp(payment.createdAt) : "~",
                completedAt: payment.completedAt ? formatTimestamp(payment.completedAt) : "~",
                isPaid: payment.isPaid ? "Yes" : "No" || "~",
                type: payment.hasOwnProperty("receivedSat") ? "Payment" : "Transfer",
                status: payment.isPaid ? "Completed" : "Uncompleted",
                sent: payment.sent ? (payment.sent ? intlNumberFormat(payment.sent) : "~") : null,
                //Incoming
                externalId: payment.externalId || null,
                description: payment.description || null,
                receivedSat: payment.receivedSat ? intlNumberFormat(payment.receivedSat) : "~",
              })}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
          </td>
        </tr>
      );
    }));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    (async () => {
      const rows = await renderTableRows();
      setTableRows(rows);
    })();
  }, [transactions, currentPage]);

  const handleExportCsv = () => {
    fetch(`/api/listincomingandoutgoing`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const paymentsData = data;
        const csvRows = [];
        const headers = ['Date', "Time", 'Label', 'Amount', 'Type', 'Status'];
        csvRows.push(headers.join(','));

        paymentsData.forEach((payment) => {
          const paymentITag = payment.hasOwnProperty("receivedSat") ? 'Payment' : 'Transfer';
          const status = payment.isPaid ? 'Completed' : 'Uncompleted';
          const row = [
            formatTimestamp(payment.createdAt),
            payment.hasOwnProperty("description") ? payment.description : "Label",
            payment.hasOwnProperty("receivedSat") ? payment.receivedSat : -payment.sent,
            paymentITag,
            status
          ];
          csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const date = Date.now();
        a.download = `Phoenixd transactions (${formatTimestamp(date)}).csv`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error exporting CSV:', error);
      });
  };

  return (
    <div>
      <h2>Transactions</h2>
      <h3>Activity</h3>
      <p>Your full activity history for this account.</p>

      <table id="paymentsTable">
        <thead>
          <tr>
            <th></th>
            <th>TimeStamp</th>
            <th>Label</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>

      </table>

      <div className="pagination">
        <div className="pagination-controls">
          <button id="prevPage" onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
            Previous
          </button>
          <span id="pageInfo">Page {currentPage} of {totalPages}</span>
          <button id="nextPage" onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">Next</button>
        </div>
        <button id="exportCsv" className="export-button" onClick={handleExportCsv}>Export CSV <i className="bi bi-filetype-csv"></i> </button>
      </div>

      {/* Modal */}
      {/* <div id="showTransactiontModal" className="modal">
        <div className="modal-content">
          <span
            id="xshowTransactionModal"
            className="close"
            data-modal="showTransactiontModal"
          >
            &times;
          </span>
          <h2>Transaction Details</h2>
          <div id="transactionDetailsGrid" className="transaction-grid"></div>
          <button type="button" id="doneTransactionModal">
            Done <i className="bi bi-check2"></i>
          </button>
        </div>
      </div> */}
      {/* {isShowTranscationModalOpen && (
        <ShowTranscationModal closeModal={closeModal} />
      )} */}

      {selectedTransaction && (
        <ShowTranscationModal
          closeModal={() => setSelectedTransaction(null)}
          transactionData={selectedTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;
