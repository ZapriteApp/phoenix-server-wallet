// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import './Settings.css';
import ConfirmSeedPhraseModal from '../Modals/ConfirmSeedPhraseModal'
import SuccessPasswordSetModal from '../Modals/SuccessPasswordSetModal'
import FailedConfirmSeedModal from '../Modals/FailedConfirmSeedModal'
import UpdatePasswordModal from '../Modals/UpdatePasswordModal'
import { handleCopy, generateUniqueRandomIndexes } from '../../utils';

const Settings = () => {
  const [isConfirmSeedPhraseModalOpen, setIsConfirmSeedPhraseModalOpen] = useState(false);
  const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
  const [isSuccessPasswordSetModalOpen, setIsSuccessPasswordSetModalOpen] = useState(false);
  const [isFailedConfirmSeedModalOpen, setIsFailedConfirmSeedModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminPasswordVisible, setIsAdminPasswordVisible] = useState(false);
  const [isRestrictedPasswordVisible, setIsRestrictedPasswordVisible] = useState(false);
  const [isWalletSeedVisible, setIsWalletSeedVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [randomIndexes, setRandomIndexes] = useState([]);
  const [passwordSet, setPasswordSet] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



  const toggleAdminPassword = () => setIsAdminPasswordVisible(prev => !prev);
  const toggleRestrictedPassword = () => setIsRestrictedPasswordVisible(prev => !prev);
  const toggleWalletSeed = () => setIsWalletSeedVisible(prev => !prev);

  const [restrictedPassword, setRestrictedPassword] = useState('');
  const [walletSeedPhrase, setWalletSeedPhrase] = useState('');

  useEffect(() => {
    fetch('api/getseedphrase')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setWalletSeedPhrase(data.seed);
      })
      .catch(error => {
        console.error('Error fetching seed phrase:', error);
      });

    fetch('/api/getconfiginfo')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setAdminPassword(data.config["http-password"]);
        setRestrictedPassword(data.config["http-password-limited-access"]);
      })
      .catch(error => {
        console.error('Error fetching config info:', error);
      });

  }, []);

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


  const openConfirmSeedPhraseModal = () => {
    const nums = generateUniqueRandomIndexes()
    setRandomIndexes(nums);
    setIsConfirmSeedPhraseModalOpen(true);
  }

  const openUpdatePasswordModal = () => {
    setIsUpdatePasswordModalOpen(true);
  }
  const openSuccessPasswordSetModal = () => {
    setIsSuccessPasswordSetModalOpen(true);
  }

  const openFailedConfirmSeedModal = () => {
    setIsFailedConfirmSeedModalOpen(true);
  }

  const closeModal = () => {
    setIsConfirmSeedPhraseModalOpen(false)
    setIsUpdatePasswordModalOpen(false)
    setIsSuccessPasswordSetModalOpen(false)
    setIsFailedConfirmSeedModalOpen(false)
  }

  const handleCopyClick = (text, itemId) => {
    handleCopy(text, () => {
      setCopied(itemId);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePasswordUpdate = () => {
    if (newPassword === '') {
      setErrorMessage("Missing new password!");
      return;
    }

    if (confirmPassword === '') {
      setErrorMessage("Missing confirmed password!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const password = { password: newPassword };

    fetch('/api/savepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(password),
    })
      .then(response => response.json())
      .then(data => {
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        closeModal();
        setIsSuccessPasswordSetModalOpen(true);
        window.location.reload()
      })
      .catch(error => {
        console.error('Error saving password:', error);
        setErrorMessage("Something went wrong. Please try again.");
      });
  };


  return (
    <>
      <h2>Settings</h2>
      <div className="heading">Application password</div>
      <div className="application-password">
        <p>Set application password for login</p>
        <div className="update-password">
          <p className="passwordSet">
            {passwordSet ? (
              <>Password Set <i className="bi bi-check2" /></>
            ) : (
              <>No password set <i className="bi bi-exclamation-triangle-fill" /></>
            )}
          </p>
          <button
            id="updatePassword"
            onClick={openConfirmSeedPhraseModal}
            className="update-password-button"
          >
            Update password <i className="bi bi-arrow-right" />
          </button>

        </div>
      </div>

      <div className="heading">Wallet seed phrase</div>
      <div className="wallet-seed">
        <p>Authentication requires the password below</p>
        <p>Wallet seed phrase</p>
        <div className="stringBox">
          {walletSeedPhrase ? (
            <>
              <span className={`wallet-seed-phrase ${isWalletSeedVisible ? 'visible' : ''}`} id="wallet-seed-phrase">{JSON.stringify(walletSeedPhrase)}</span>
              <span className="icons">
                <button id="seeWalletSeedPhrase" className="copy-btn" onClick={toggleWalletSeed}><i className={`bi ${isWalletSeedVisible ? 'bi-eye-slash' : 'bi-eye'}`} /></button>
                <button id="copyWalletSeedPhrase" className="copy-btn" onClick={() => handleCopyClick(walletSeedPhrase, "copyWalletSeedPhrase")}>
                  {copied === "copyWalletSeedPhrase" ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className="bi bi-copy"></i>
                  )
                  }
                </button>
              </span>
            </>
          ) :
            (
              <>
                <span className="wallet-seed-phrase" id="wallet-seed-phrase"></span>
                <span className="icons">
                  <button id="seeWalletSeedPhrase" className="copy-btn" onClick={toggleWalletSeed}><i className="bi bi-eye" /></button>
                  <button id="copyWalletSeedPhrase" className="copy-btn"><i className="bi bi-copy" /></button>
                </span>
              </>
            )}

        </div>
      </div>

      <div className="heading">API passwords</div>
      <div className="api-passwords">
        <p>Authentication requires the password below</p>
        <p>Admin password</p>
        <div className="stringBox">
          {adminPassword ? (
            <>
              <span className={`adminPassword ${isAdminPasswordVisible ? 'visible' : ''}`} id="adminPassword">{JSON.stringify(adminPassword)}</span>
              <span className="icons">
                <button id="seeAdminPassword" className="copy-btn" onClick={toggleAdminPassword}><i className={`bi ${isAdminPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`} /></button>
                <button id="copyAdminPassword" className="copy-btn" onClick={() => handleCopyClick(adminPassword, "copyAdminPassword")}>
                  {copied === "copyAdminPassword" ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className="bi bi-copy"></i>
                  )
                  }
                </button>
              </span>
            </>
          ) : (
            <>
              <span className={`adminPassword ${isAdminPasswordVisible ? 'visible' : ''}`} id="adminPassword"></span>
              <span className="icons">
                <button id="seeAdminPassword" className="copy-btn" onClick={toggleAdminPassword}>
                </button>
                <button id="copyAdminPassword" className="copy-btn"><i className="bi bi-copy" /></button>
              </span>
            </>
          )}
        </div>

        <p>Restricted password</p>
        <div className="stringBox">
          {restrictedPassword ? (
            <>
              <span className={`restrictedPassword ${isRestrictedPasswordVisible ? 'visible' : ''}`} id="restrictedPassword">{JSON.stringify(restrictedPassword)}</span>
              <span className="icons">
                <button id="seeRestrictedPassword" className="copy-btn" onClick={toggleRestrictedPassword}><i className={`bi ${isRestrictedPasswordVisible ? 'bi-eye-slash' : 'bi-eye'}`} /></button>
                <button id="copyRestrictedPassword" className="copy-btn" onClick={() => handleCopyClick(restrictedPassword, "copyRestrictedPassword")}>
                  {copied === "copyRestrictedPassword" ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className="bi bi-copy"></i>
                  )
                  }
                </button>
              </span>
            </>
          ) : (
            <>
              <span className={`restrictedPassword ${isRestrictedPasswordVisible ? 'visible' : ''}`} id="restrictedPassword"></span>
              <span className="icons">
                <button id="seeRestrictedPassword" className="copy-btn" onClick={toggleRestrictedPassword}><i className="bi bi-eye" /></button>
                <button id="copyRestrictedPassword" className="copy-btn"><i className="bi bi-copy" /></button>
              </span>
            </>

          )}

        </div>
      </div>

      {isConfirmSeedPhraseModalOpen && (
        <ConfirmSeedPhraseModal closeModal={closeModal}
          openUpdatePasswordModal={() => setIsUpdatePasswordModalOpen(true)}
          openFailedModal={() => setIsFailedConfirmSeedModalOpen(true)}
          randomIndexes={randomIndexes} />
      )}

      {isUpdatePasswordModalOpen && (
        <UpdatePasswordModal closeModal={closeModal}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          errorMessage={errorMessage}
          onChangeNewPassword={setNewPassword}
          setErrorMessage={setErrorMessage}
          onChangeConfirmPassword={setConfirmPassword}
          onSubmit={handlePasswordUpdate} />
      )}

      {isSuccessPasswordSetModalOpen && (
        <SuccessPasswordSetModal closeModal={closeModal} />
      )}

      {isFailedConfirmSeedModalOpen && (
        <FailedConfirmSeedModal closeModal={closeModal} />
      )}

    </>

  );
};

export default Settings;
