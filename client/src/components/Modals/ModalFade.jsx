import React,{ useEffect, useState } from 'react';
import './ModalFade.css'

const ModalFade = ({ isOpen, children }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300); // match fade duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return shouldRender ? (
    <div className={`modal-fade ${isOpen ? 'show' : ''}`}>
      {children}
    </div>
  ) : null;
};

export default ModalFade