
const cAppearance = document.getElementById("c-appearance")
const cLayout = document.getElementById("c-layout")
const cLogin = document.getElementById("c-login")
const cExperimental = document.getElementById("c-experimental")

const sbAppearance = document.getElementById("sb-appearance")
const sbLayout = document.getElementById("sb-layout")
const sbLogin = document.getElementById("sb-login")
const sbExperimental = document.getElementById("sb-experimental")



sbAppearance.onclick = () => {
  cAppearance.style.display = "block"
  cLayout.style.display = "none"
  cLogin.style.display = "none"
  cExperimental.style.display = "none"
  
  sbAppearance.classList.add("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.remove("selected")
}

sbLayout.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "block"
  cLogin.style.display = "none"
  cExperimental.style.display = "none"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.add("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.remove("selected")
}

sbLogin.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "none"
  cLogin.style.display = "block"
  cExperimental.style.display = "none"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.add("selected")
  sbExperimental.classList.remove("selected")
}

sbExperimental.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "none"
  cLogin.style.display = "none"
  cExperimental.style.display = "block"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.add("selected")
}





const saveOptions = () => {
  const darkMode = document.getElementById('dark').checked

  const keuzeBtn = document.getElementById('keuzeBtn').checked
  const cijfers = document.getElementById('cijfers').checked
  const inlogText = document.getElementById('inlogText').value
  const widgetCustomHigh = document.getElementById('widgetCustomHigh').value
  const widgetCustomLow = document.getElementById('widgetCustomLow').value
  const autoLogin = document.getElementById('autoLogin').checked
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  
  
  const pfpDefault = document.getElementById('pfp-default').checked
  const pfpCustom = document.getElementById('pfp-custom').checked
  const pfpHidden = document.getElementById('pfp-hidden').checked
  
  const studiewijzersGrid = document.getElementById('sw-grid').checked
  
  const hideBestellenBtn = document.getElementById('bs-hidden').checked
  const hideHelpBtn = document.getElementById('h-hidden').checked

  const widgetDrag = document.getElementById('widgetDrag').checked

  var hidePfp
  var customPfp

  if (pfpDefault) {
    hidePfp = false
    customPfp = false
  }else if(pfpCustom) {
    hidePfp = false
    customPfp = true
  }else if(pfpHidden) {
    hidePfp = true
    customPfp = false
  }

  chrome.storage.sync.set(
    { darkMode: darkMode , keuzeBtn: keuzeBtn , cijfers: cijfers , studiewijzersGrid: studiewijzersGrid , hideHelpBtn: hideHelpBtn , inlogText: inlogText , hidePfp: hidePfp , customPfp: customPfp , widgetCustomHigh: widgetCustomHigh , widgetCustomLow: widgetCustomLow , hideBestellenBtn: hideBestellenBtn , autoLogin: autoLogin , username: username , password: password , widgetDrag: widgetDrag },
    () => {
      // do after saved
      // console.log(`darkMode: ${darkMode}\nkeuzeBtn: ${keuzeBtn}\ncijfers: ${cijfers}\nstudiewijzersGrid: ${studiewijzersGrid}\nhideHelpBtn: ${hideHelpBtn}\ninlogText: ${inlogText}\nhidePfp: ${hidePfp}\ncustomPfp:${customPfp}\nwidgetCustomHigh:${widgetCustomHigh}\nwidgetCustomLow:${widgetCustomLow}`)
      updateAutoLogin()
      updateFileUpload()
    }
  )
};


const restoreOptions = () => {
  chrome.storage.sync.get(
    { darkMode: false , keuzeBtn: true , cijfers: false , studiewijzersGrid: false , hideHelpBtn: true , inlogText: "Bonjour" , hidePfp: false , customPfp: false , widgetCustomHigh: 385 , widgetCustomLow: 145 , hideBestellenBtn: false , autoLogin: false , username: "" , password: "" , widgetDrag: true },
    (items) => {
      document.getElementById('dark').checked = items.darkMode;
      document.getElementById('light').checked = !items.darkMode;

      
      document.getElementById('keuzeBtn').checked = items.keuzeBtn;
      document.getElementById('cijfers').checked = items.cijfers;
      document.getElementById('inlogText').value = items.inlogText;
      document.getElementById('widgetCustomHigh').value = items.widgetCustomHigh;
      document.getElementById('widgetCustomLow').value = items.widgetCustomLow;
      document.getElementById('autoLogin').checked = items.autoLogin;
      document.getElementById('username').value = items.username;
      document.getElementById('password').value = items.password;
      
      document.getElementById('sw-list').checked = !items.studiewijzersGrid;
      document.getElementById('sw-grid').checked = items.studiewijzersGrid;
      
      document.getElementById('bs-hidden').checked = items.hideBestellenBtn;
      document.getElementById('bs-visible').checked = !items.hideBestellenBtn;

      document.getElementById('h-hidden').checked = items.hideHelpBtn;
      document.getElementById('h-visible').checked = !items.hideHelpBtn;

      document.getElementById('widgetDrag').checked = items.widgetDrag;

      

      if (!items.hidePfp && !items.customPfp) {
        document.getElementById('pfp-default').checked = true
      }else if (!items.hidePfp && items.customPfp) {
        document.getElementById('pfp-custom').checked = true
      }else if (items.hidePfp && !items.customPfp){
        document.getElementById('pfp-hidden').checked = true
      }


      changeStyleMode()
      updateAutoLogin()
      updateFileUpload()
    }
  )
};


const changeStyleMode = () => {
  if (document.getElementById('dark').checked) {
    document.getElementById("lightModeStylesheet").disabled = true
  }else if (document.getElementById('light').checked) {
    document.getElementById("lightModeStylesheet").disabled = false
  }
}

const updateAutoLogin = () => {
  if (document.getElementById("autoLogin").checked) {
    document.getElementById("l-username").style.opacity = "1"
    document.getElementById("l-password").style.opacity = "1"
  }else {
    document.getElementById("l-username").style.opacity = ".35"
    document.getElementById("l-password").style.opacity = ".35"
  }
}

const updateFileUpload = () => {
  if (document.getElementById("pfp-custom").checked) {
    document.getElementById("l-imageUpload").style.display = "block"
  }else {
    document.getElementById("l-imageUpload").style.display = "none"
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions)

document.getElementById('dark').addEventListener('change', changeStyleMode)
document.getElementById('light').addEventListener('change', changeStyleMode)


document.querySelectorAll("#main label input").forEach((input) => {
  input.addEventListener('change', saveOptions)
})


//~ Reset numeber inputs
document.getElementById("resetWidgetCustomHigh").addEventListener("click", () => {
  document.getElementById('widgetCustomHigh').value = 385
  saveOptions()
})

document.getElementById("resetWidgetCustomLow").addEventListener("click", () => {
  document.getElementById('widgetCustomLow').value = 145
  saveOptions()
})


//~ IMAGE STORAGE

document.getElementById("upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const maxSize = 128;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageURL = canvas.toDataURL("image/png");

        chrome.storage.local.set(
          { userImage: resizedImageURL },
          () => {
            console.log("Image had been saved")
            console.log(resizedImageURL)
          }
        )
      };
    };

    reader.readAsDataURL(file);
  }

});