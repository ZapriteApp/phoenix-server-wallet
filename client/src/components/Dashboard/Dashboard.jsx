// src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Home from '../Home/Home'
import Transactions from '../Transactions/Transactions'
import Contacts from '../Contacts/Contacts'
import Settings from '../Settings/Settings'
import './Dashboard.css';


const Dashboard = ({ setAuthenticated}) => {
  const [selectedSection, setSelectedSection] = useState('home');
  const [passwordSet, setPasswordSet] = useState(false);
  const handleMenuClick = (section) => {
    setSelectedSection(section);
  };

  const handleLogOutClick = () => {
    fetch('api/logout', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
        setAuthenticated(false)
        }
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  };


  const handleGitHubClick = () => {
    window.open("https://github.com/ZapriteApp/phoenix-server-wallet.git", "_blank");
  };

  const checkIfPasswordIsSet = () => {
    fetch('api/ispasswordset')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          setPasswordSet(true);
        } else {
          setPasswordSet(false);
        }
      })
      .catch(error => {
        console.error('Error checking password:', error);
      });
  };

  useEffect(() => {
    checkIfPasswordIsSet();
  }, []);

  return (
    <div className="container-fluid" id="home-page">
      <div className="row">
        {/* Side Panel */}
        <div className="col-md-3 side-panel">
          <div className="app-name">
            <h2>Phoenixd Wallet</h2>
          </div>
          <div className="menu">
            <button className={`menu-item ${selectedSection === 'home' ? 'selected' : ''}`} id="home" onClick={() => handleMenuClick('home')}>
              <i className="bi bi-grid"></i> Dashboard
            </button>
            <button className={`menu-item ${selectedSection === 'transactions' ? 'selected' : ''}`} id="transactions" onClick={() => handleMenuClick('transactions')}>
              <i className="bi bi-lightning-charge"></i> Transactions
            </button>
            <button className={`menu-item ${selectedSection === 'contacts' ? 'selected' : ''}`} id="contacts" onClick={() => handleMenuClick('contacts')}>
              <i className="bi bi-person-lines-fill"></i> Contacts
            </button>
            <button className={`menu-item ${selectedSection === 'settings' ? 'selected' : ''}`} id="settings" onClick={() => handleMenuClick('settings')}>
              <i className="bi bi-gear"></i> Settings
            </button>
          </div>


          <div className="footer">
            {passwordSet && (
              <div className="footer-item" id="log-out" onClick={handleLogOutClick}>
                <i className="bi bi-box-arrow-right footer-icon"></i>
                <button id="home" onClick={handleLogOutClick}>
                  <span className="footer-text">Log Out</span>
                </button>
              </div>
            )}
            <div className="footer-item" id="github-link" onClick={handleGitHubClick}>
              <button id="home" onClick={handleGitHubClick}>
                <span className="footer-text">Version 0.1.7-beta</span>
              </button>
              <i className="bi bi-github footer-icon-right"></i>
            </div>
          </div>
        </div>

        {/* <!-- Main Content --> */}
        <div className="col-md-9 main-content" id="rightPanel">
          {selectedSection === 'home' && <Home />}
          {selectedSection === 'transactions' && <Transactions />}
          {selectedSection === 'contacts' && <Contacts />}
          {selectedSection === 'settings' && <Settings />}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
