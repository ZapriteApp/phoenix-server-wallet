// src/components/SidePanel/SidePanel.jsx
import React from 'react';
import './SidePanel.css';

const SidePanel = ({ setActiveSection }) => {
  return (
    <div className="side-panel">
      <button onClick={() => setActiveSection('home')}>Home</button>
      <button onClick={() => setActiveSection('transactions')}>Transactions</button>
      <button onClick={() => setActiveSection('contacts')}>Contacts</button>
      <button onClick={() => setActiveSection('settings')}>Settings</button>
    </div>
  );
};

export default SidePanel;
