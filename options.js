// Saves options to chrome.storage
const saveOptions = () => {
    const darkMode = document.getElementById('darkMode').checked;
  
    chrome.storage.sync.set(
      { darkMode: darkMode },
      () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
      }
    );
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { darkMode: true },
      (items) => {
        document.getElementById('darkMode').checked = items.darkMode;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);