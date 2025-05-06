import React, { useState, useEffect } from "react";
import './Contacts.css'
import '../Modals/Modal.css'
import AddContactModal from '../Modals/AddContactModal'
import ImportContactModal from '../Modals/ImportContactModal'
import ShowContactActionModal from '../Modals/ShowContactActionModal'
import SuccessContactAddedModal from "../Modals/SuccessContactAddedModal";

const Contacts = () => {
  const [isAddContactModalModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isImportContactModalModalOpen, setIsImportContactModalOpen] = useState(false);
  const [isShowContactActionModalOpen, setIsShowContactActionModalOpen] = useState(false);
  const [isSuccessContactAddedModalOpen, setIsSuccessContactAddedModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  


  const itemsPerPage = 8;
  const [contactsData, setContactsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/getcontacts');
      const data = await response.json();
      setContactsData(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contactsData.map(({ name, offer, address }) => ({
    name,
    offer,
    address
  }));

  const contactsJson = JSON.stringify(filteredContacts);

  const truncateText = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const totalPages = Math.ceil(contactsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = contactsData.slice(startIndex, startIndex + itemsPerPage);

  const [formValues, setFormValues] = useState({
    addContactName: '',
    addContactOffer: '',
    addContactAddress: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const openAddContactModal = () => {
    setFormValues({ addContactName: '', addContactOffer: '', addContactAddress: '' });
    setErrorMessage('');
    setIsAddContactModalOpen(true);
  };

  const closeModal = () => {
    setIsAddContactModalOpen(false);
    setIsImportContactModalOpen(false);
    setIsShowContactActionModalOpen(false);
    setIsSuccessContactAddedModalOpen(false)
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const validateOffer = async (offer) => {
    try {
      const res = await fetch('api/decodeoffer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer })
      });
      const result = await res.json();
      return result.chain ? true : false;
    } catch (err) {
      console.error('Error validating offer:', err);
      return false;
    }
  };

  const handleAddContact = async () => {
    const { addContactName, addContactOffer, addContactAddress } = formValues;

    if (addContactName.trim() === '') {
      setErrorMessage('The contact name cannot be empty.');
      return;
    }

    if (addContactOffer.trim() === '') {
      setErrorMessage('The contact offer cannot be empty.');
      return;
    }

    const isValid = await validateOffer(addContactOffer);
    if (!isValid) {
      setErrorMessage('The contact offer is invalid.');
      return;
    }

    const contactData = {
      name: addContactName.trim(),
      offer: addContactOffer.trim(),
      address: addContactAddress.trim()
    };

    try {
      const response = await fetch('/api/savecontact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) throw new Error('Failed to save contact');
      const data = await response.json();
      closeModal();
      fetchContacts();
      openSuccessContactAddedModal()
    } catch (err) {
      console.error('Error saving contact:', err);
      setErrorMessage('An error occurred while saving the contact.');
    }
  };

  const openImportContactModal = () => {
    setIsImportContactModalOpen(true);
  }

  const openShowContactActionModal = () => {
    setIsShowContactActionModalOpen(true);
  }

  const openSuccessContactAddedModal = () => {
    setIsSuccessContactAddedModalOpen(true);
  }

  return (
    <div>
      <h2>Contacts</h2>

      <div className="contacts-header">
        <h3>Address Book</h3>
        {/* <button id="importContact" className="import-button" onClick={openImportContactModal}>
          Import <i className="bi bi-file-earmark-arrow-down"></i>
        </button> */}
      </div>

      <p>Manage your contacts</p>

      <table id="contactsTable">
        <thead>
          <tr>
            <th>Date Added</th>
            <th>Label</th>
            <th>Offer</th>
            <th>Lightning Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr><td colSpan="6">No contacts found.</td></tr>
          ) : (
            currentData.map((contact, index) => (
              <tr key={`${contact.id}-${index}`}>
                <td>{formatDate(contact.dateAdded)}</td>
                <td>{truncateText(contact.name, 15)}</td>
                <td>{truncateText(contact.offer, 20)}</td>
                <td>{truncateText(contact.address, 20)}</td>
                <td>Active</td>
                <td>
                  <button
                    className="contact-action-btn contact-action-btn-icon"
                    onClick={ () => setSelectedContact({
                      id: contact.id,
                      name: contact.name,
                      offer: contact.offer,
                      address: contact.address,
                      dateAdded: formatDate(contact.dateAdded)
                    })}

                  >
                    <i className="bi bi-three-dots-vertical" onClick={openShowContactActionModal}></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <div className="pagination-controls">
          <button id="prevPage" className="pagination-button" disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}>
            Previous
          </button>
          <span id="pageInfo">Page {currentPage} of {totalPages}</span>
          <button id="nextPage" className="pagination-button" disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
        </div>
        <button id="newContact" className="new-contact-button" onClick={openAddContactModal}>
          Add Contact <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      {/* Add Contact Modal */}
      {isAddContactModalModalOpen && (
        <AddContactModal closeModal={closeModal}
          onAddContact={handleAddContact}
          onCancel={closeModal}
          onChange={handleChange}
          errorMessage={errorMessage} />
      )}


      {/* Import Contact Modal */}
      {isImportContactModalModalOpen && (
        <ImportContactModal closeModal={closeModal}
        contactsString={contactsJson} />
      )}

      {isSuccessContactAddedModalOpen && (
        <SuccessContactAddedModal closeModal={closeModal} />
      )}

      {/* Show Contact Modal */}
      {selectedContact && (
        <ShowContactActionModal closeModal={() => setSelectedContact(null)}
          contactData={selectedContact} />
      )}

    </div>
  );
};

export default Contacts;
