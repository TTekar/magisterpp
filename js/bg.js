chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    var splitUrl = tab.url.split(".")

    chrome.storage.sync.get(
        { darkMode: false },
        (items) => {
          if (!items.darkMode) {
            if (changeInfo.status == "loading") {
                if (splitUrl[1] == "magister") {
                    chrome.tabs.insertCSS(tabId, {
                        file: "css/lightMode.css"
                    }, () => {
                        console.log("inserted light mode stylesheet")
                    })
                }
            }
          }
        }
      );
    
})