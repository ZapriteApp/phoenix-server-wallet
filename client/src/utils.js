// utils.js
export const handleCopy = (text, onSuccess) => {
    navigator.clipboard.writeText(text)
    .then(() => {
      if (onSuccess) onSuccess();
    })
    .catch(err => {
      console.error('Copy failed:', err);
    })
  
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
  
  
  