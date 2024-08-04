chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var tabUrl = tab.url
    var splitUrl = tab.url.split(".")

    chrome.storage.sync.get(
        { darkMode: true },
        (items) => {
          if (!items.darkMode) {
            if (changeInfo.status == "loading") {
                if (splitUrl[1] == "magister") {
                    chrome.tabs.insertCSS(tabId, {
                        file: "css/lightMode.css"
                    }, () => {
                        console.log("inserted")
                    })
                }
            }
          }
        }
      );
    
    //if (darkMode) {
        // if (changeInfo.status == "loading") {
        //     if (splitUrl[1] == "magister") {
        //         chrome.tabs.insertCSS(tabId, {
        //             file: "main.css"
        //         }, () => {
        //             console.log("inserted")
        //         })
        //     }
        // }
    //}
    
    
    //console.log(changeInfo)
})