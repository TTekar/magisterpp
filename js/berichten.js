
// var berichtenInit = window.setInterval(function(){

//   chrome.storage.sync.get(
//     { darkMode: false },
//     (items) => {

//       if (!items.darkMode) {
        
//         const link = document.createElement("link")
//         link.href = chrome.runtime.getURL("css/lightMode.css")
//         link.rel = "stylesheet"
                
//         document.head.appendChild(link)

//         clearInterval(berichtenInit);
//       }
//     }
//   );

// }, 100)

// berichtenInit()