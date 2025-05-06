// src/components/Modals/Modal.jsx
import React from 'react';
import './Modal.css';

const Modal = ({ toggleModal }) => {
  return (
    <div className="modal">
      <div className="modalcontent">
        <button onClick={toggleModal}>Close</button>
        <h2>Modal Content</h2>
      </div>
    </div>
  );
};

export default Modal;
