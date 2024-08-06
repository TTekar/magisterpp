// Saves options to chrome.storage
const saveOptions = () => {
  const darkMode = document.getElementById('darkMode').checked
  const keuzeBtn = document.getElementById('keuzeBtn').checked
  const cijfers = document.getElementById('cijfers').checked
  const studiewijzersGrid = document.getElementById('studiewijzersGrid').checked
  const hideHelpBtn = document.getElementById('hideHelpBtn').checked
  const inlogText = document.getElementById('inlogText').value

  chrome.storage.sync.set(
    { darkMode: darkMode , keuzeBtn: keuzeBtn , cijfers: cijfers , studiewijzersGrid: studiewijzersGrid , hideHelpBtn: hideHelpBtn , inlogText: inlogText },
    () => {
      // do after saved
      console.log(`darkMode: ${darkMode}\nkeuzeBtn: ${keuzeBtn}\ncijfers: ${cijfers}\nstudiewijzersGrid: ${studiewijzersGrid}\nhideHelpBtn: ${hideHelpBtn}\ninlogText: ${inlogText}`)
    }
  )
};


const restoreOptions = () => {
  chrome.storage.sync.get(
    { darkMode: false , keuzeBtn: true , cijfers: false , studiewijzersGrid: false , hideHelpBtn: true , inlogText: "Bonjour" },
    (items) => {
      document.getElementById('darkMode').checked = items.darkMode;
      document.getElementById('keuzeBtn').checked = items.keuzeBtn;
      document.getElementById('cijfers').checked = items.cijfers;
      document.getElementById('studiewijzersGrid').checked = items.studiewijzersGrid;
      document.getElementById('hideHelpBtn').checked = items.hideHelpBtn; 
      document.getElementById('inlogText').value = items.inlogText; 
    }
  )
};


document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('darkMode').addEventListener('change', saveOptions)
document.getElementById('keuzeBtn').addEventListener('change', saveOptions)
document.getElementById('cijfers').addEventListener('change', saveOptions)
document.getElementById('studiewijzersGrid').addEventListener('change', saveOptions)
document.getElementById('hideHelpBtn').addEventListener('change', saveOptions)
document.getElementById('inlogText').addEventListener('change', saveOptions)

var darkOrLightMode = window.setInterval(function(){
  const body = document.getElementById("optionsBody")
  const darkLabel = document.getElementById("darkModeLabel")
  const keuzeBtnLabel = document.getElementById("keuzeBtnLabel")
  const cijferLabel = document.getElementById("cijfersLabel")
  const studiewijzersGridLabel = document.getElementById("studiewijzersGridLabel")
  const hideHelpBtnLabel = document.getElementById("hideHelpBtnLabel")
  const inlogTextLabel = document.getElementById("inlogTextLabel")

  chrome.storage.sync.get(
    { darkMode: false },
    (items) => {
      if (items.darkMode) {       // dark mode ui
        
        body.style.backgroundColor = "#1F2228"

        darkLabel.style.color = "#FFFFFF"
        keuzeBtnLabel.style.color = "#FFFFFF"
        cijferLabel.style.color = "#FFFFFF"
        studiewijzersGridLabel.style.color = "#FFFFFF"
        hideHelpBtnLabel.style.color = "#FFFFFF"
        inlogTextLabel.style.color = "#FFFFFF"

      }else {                     // light mode ui

        body.style.backgroundColor = "#FFFFFF"

        darkLabel.style.color = "#000000"
        keuzeBtnLabel.style.color = "#000000"
        cijferLabel.style.color = "#000000"
        studiewijzersGridLabel.style.color = "#000000"
        hideHelpBtnLabel.style.color = "#000000"
        inlogTextLabel.style.color = "#000000"

      }
    }
  );
}, 100);