

const saveOptions = () => {
  const darkMode = document.getElementById('darkMode').checked
  const keuzeBtn = document.getElementById('keuzeBtn').checked
  const cijfers = document.getElementById('cijfers').checked
  const studiewijzersGrid = document.getElementById('studiewijzersGrid').checked
  const hideHelpBtn = document.getElementById('hideHelpBtn').checked
  const inlogText = document.getElementById('inlogText').value
  const hidePfp = document.getElementById('hidePfp').checked
  const sheets = document.getElementById('sheets').checked

  chrome.storage.sync.set(
    { darkMode: darkMode , keuzeBtn: keuzeBtn , cijfers: cijfers , studiewijzersGrid: studiewijzersGrid , hideHelpBtn: hideHelpBtn , inlogText: inlogText , hidePfp: hidePfp , sheets: sheets },
    () => {
      // do after saved
      console.log(`darkMode: ${darkMode}\nkeuzeBtn: ${keuzeBtn}\ncijfers: ${cijfers}\nstudiewijzersGrid: ${studiewijzersGrid}\nhideHelpBtn: ${hideHelpBtn}\ninlogText: ${inlogText}\nhidePfp: ${hidePfp}\nsheets ${sheets}`)
    }
  )
};


const restoreOptions = () => {
  chrome.storage.sync.get(
    { darkMode: false , keuzeBtn: true , cijfers: false , studiewijzersGrid: false , hideHelpBtn: true , inlogText: "Bonjour" , hidePfp: false , sheets: false },
    (items) => {
      document.getElementById('darkMode').checked = items.darkMode;
      document.getElementById('keuzeBtn').checked = items.keuzeBtn;
      document.getElementById('cijfers').checked = items.cijfers;
      document.getElementById('studiewijzersGrid').checked = items.studiewijzersGrid;
      document.getElementById('hideHelpBtn').checked = items.hideHelpBtn; 
      document.getElementById('inlogText').value = items.inlogText; 
      document.getElementById('hidePfp').checked = items.hidePfp; 
      document.getElementById('sheets').checked = items.sheets; 

      changeStyleMode()
    }
  )
};


const changeStyleMode = () => {
  if (document.getElementById('darkMode').checked) {
    document.getElementById("lightModeStylesheet").disabled = true
  }else {
    document.getElementById("lightModeStylesheet").disabled = false
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions)

document.getElementById('darkMode').addEventListener('change', changeStyleMode)


document.querySelectorAll("#main label input").forEach((input) => {
  input.addEventListener('change', saveOptions)
})

// document.getElementById('darkMode').addEventListener('change', saveOptions)
// document.getElementById('keuzeBtn').addEventListener('change', saveOptions)
// document.getElementById('cijfers').addEventListener('change', saveOptions)
// document.getElementById('studiewijzersGrid').addEventListener('change', saveOptions)
// document.getElementById('hideHelpBtn').addEventListener('change', saveOptions)
// document.getElementById('inlogText').addEventListener('change', saveOptions)


document.getElementById("advancedSettingsA").onclick = function(event) {
  event.preventDefault();
  
  var advSetDiv = document.getElementById("advancedSettings")

  if (advSetDiv.style.display == "none") {
    advSetDiv.style.display = "block"
  }else {
    advSetDiv.style.display = "none"
  }
}