

const saveOptions = () => {
  const darkMode = document.getElementById('darkMode').checked
  const keuzeBtn = document.getElementById('keuzeBtn').checked
  const cijfers = document.getElementById('cijfers').checked
  const studiewijzersGrid = document.getElementById('studiewijzersGrid').checked
  const hideHelpBtn = document.getElementById('hideHelpBtn').checked
  const inlogText = document.getElementById('inlogText').value
  const hidePfp = document.getElementById('hidePfp').checked
  const customPfp = document.getElementById('customPfp').checked
  const hideBestellenBtn = document.getElementById('hideBestellenBtn').checked
  const widgetCustomHigh = document.getElementById('widgetCustomHigh').value
  const widgetCustomLow = document.getElementById('widgetCustomLow').value

  chrome.storage.sync.set(
    { darkMode: darkMode , keuzeBtn: keuzeBtn , cijfers: cijfers , studiewijzersGrid: studiewijzersGrid , hideHelpBtn: hideHelpBtn , inlogText: inlogText , hidePfp: hidePfp , customPfp: customPfp , widgetCustomHigh: widgetCustomHigh , widgetCustomLow: widgetCustomLow , hideBestellenBtn: hideBestellenBtn },
    () => {
      // do after saved
      // console.log(`darkMode: ${darkMode}\nkeuzeBtn: ${keuzeBtn}\ncijfers: ${cijfers}\nstudiewijzersGrid: ${studiewijzersGrid}\nhideHelpBtn: ${hideHelpBtn}\ninlogText: ${inlogText}\nhidePfp: ${hidePfp}\ncustomPfp:${customPfp}\nwidgetCustomHigh:${widgetCustomHigh}\nwidgetCustomLow:${widgetCustomLow}`)
    }
  )
};


const restoreOptions = () => {
  chrome.storage.sync.get(
    { darkMode: false , keuzeBtn: true , cijfers: false , studiewijzersGrid: false , hideHelpBtn: true , inlogText: "Bonjour" , hidePfp: false , customPfp: false , widgetCustomHigh: 385 , widgetCustomLow: 145 , hideBestellenBtn: false },
    (items) => {
      document.getElementById('darkMode').checked = items.darkMode;
      document.getElementById('keuzeBtn').checked = items.keuzeBtn;
      document.getElementById('cijfers').checked = items.cijfers;
      document.getElementById('studiewijzersGrid').checked = items.studiewijzersGrid;
      document.getElementById('hideHelpBtn').checked = items.hideHelpBtn; 
      document.getElementById('inlogText').value = items.inlogText; 
      document.getElementById('hidePfp').checked = items.hidePfp; 
      document.getElementById('customPfp').checked = items.customPfp; 
      document.getElementById('hideBestellenBtn').checked = items.hideBestellenBtn; 
      document.getElementById('widgetCustomHigh').value = items.widgetCustomHigh; 
      document.getElementById('widgetCustomLow').value = items.widgetCustomLow; 

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

//// document.getElementById('darkMode').addEventListener('change', saveOptions)
//// document.getElementById('keuzeBtn').addEventListener('change', saveOptions)
//// document.getElementById('cijfers').addEventListener('change', saveOptions)
//// document.getElementById('studiewijzersGrid').addEventListener('change', saveOptions)
//// document.getElementById('hideHelpBtn').addEventListener('change', saveOptions)
//// document.getElementById('inlogText').addEventListener('change', saveOptions)


document.getElementById("advancedSettingsA").onclick = function(event) {
  event.preventDefault();
  
  var advSetDiv = document.getElementById("advancedSettings")

  if (advSetDiv.style.display == "none") {
    advSetDiv.style.display = "block"
  }else {
    advSetDiv.style.display = "none"
  }
}

//~ Reset numeber inputs
document.getElementById("resetWidgetCustomHigh").addEventListener("click", () => {
  document.getElementById('widgetCustomHigh').value = 385
  saveOptions()
})

document.getElementById("resetWidgetCustomLow").addEventListener("click", () => {
  document.getElementById('widgetCustomLow').value = 145
  saveOptions()
})