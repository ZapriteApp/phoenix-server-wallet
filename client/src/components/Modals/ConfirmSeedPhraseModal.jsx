
import React, {useState, useEffect} from 'react';
import './ConfirmSeedPhraseModal.css'

const ConfirmSeedPhraseModal = ({ closeModal,openUpdatePasswordModal, openFailedModal, randomIndexes }) => {
  const [inputs, setInputs] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = value.trim();
    setInputs(newInputs);
  };

  const handleConfirm = async () => {
    if (inputs.some((input) => input === "")) {
      setError("All fields are required. Please fill out all seeds.");
      return;
    }

    try {
      const res = await fetch("api/getseedphrase");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      const seedWords = data.seed.split(" ");
      const confirmedWords = randomIndexes.map(i => seedWords[i - 1]);

      const allMatch = inputs.every((val, i) => val === confirmedWords[i]);

      if (allMatch) {
        closeModal();
        openUpdatePasswordModal();
      } else {
        closeModal();
        openFailedModal();
      }

    } catch (err) {
      console.error("Seed fetch failed", err);
      setError("Error validating seed phrase.");
    }
  };

  useEffect(() => {
    setInputs(["", "", "", ""]);
    setError("");
  }, [randomIndexes]);
  return (
    <div id="confirmSeedPhraseModal" className="modal">
      <div className="modalcontent">
        <span
          className="close"
          data-modal="confirmSeedPhraseModal"
          onClick={closeModal}
        >
          &times;
        </span>
        <h2>Confirm</h2>
        <h3>Confirm your wallet seed before setting password</h3>
        <form>
          <div className="form-group seed-form">
          {randomIndexes.map((rand, i) => (
              <div key={i}>
                <label htmlFor={`seed${i}`}>Seed Word {rand}:</label>
                <input
                  type="text"
                  id={`seed${i}`}
                  className="form-control"
                  value={inputs[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                />
              </div>
            ))}
          
          </div>
        </form>

        {error && <div id="seed-error-message" >{error}</div>}

        <button type="button" id="cancelConfirmSeed" onClick={closeModal}>
          <i className="bi bi-x"> </i>Close
        </button>
        <button type="button" id="doneConfirmSeed" onClick={handleConfirm}>
          Confirm <i className="bi bi-check2"></i>
        </button>
      </div>
    </div>
  );
};

export default ConfirmSeedPhraseModal;
