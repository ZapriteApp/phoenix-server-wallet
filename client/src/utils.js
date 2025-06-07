// utils.js
export const handleCopy = (text, onSuccess) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch(err => {
        console.error('Clipboard API failed:', err);
        fallbackCopy(text, onSuccess);
      });
  } else {
    fallbackCopy(text, onSuccess);
  }
};

const fallbackCopy = (text, onSuccess) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Avoid scrolling to bottom
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.setAttribute('readonly', '');

  document.body.appendChild(textarea);
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful && onSuccess) onSuccess();
    else console.warn('Fallback copy failed.');
  } catch (err) {
    console.error('Fallback copy error:', err);
  }

  document.body.removeChild(textarea);
};


export const handleBoltOfferDownload = (filename, content) => {
    return () => {
      if (!content) return;
  
      const element = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
};

export async function isOfferValid(offer) {
    try {
      let response = await fetch('/api/decodeoffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offer: offer })
      });
  
      if (!response.ok) {
        return false
      }
      let data = await response.json();
      return data.chain ? true : false;
    } catch (error) {
      console.error('Error checking offer validity:', error);
      return false;
    }
  }
  
  export const generateUniqueRandomIndexes = () => {
    const set = new Set();
    while (set.size < 4) {
      set.add(Math.floor(Math.random() * 12) + 1);
    }
    return Array.from(set).sort((a, b) => a - b);
  };

  export function intlNumberFormat(value) {
    const number = Number(value);
    // if (isNaN(number)) return "~";
  
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    return formatter.format(number);
  }
  

  export const validateOffer = async (offer) => {
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
  
  