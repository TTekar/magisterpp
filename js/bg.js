chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    
    var splitUrl = tab.url.split(".")

    chrome.storage.sync.get(
        { darkMode: false , studiewijzersGrid: false},
        (items) => {

            // Dark mode
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

            // Studiewijzers
            if (items.studiewijzersGrid) {
                if (changeInfo.status == "loading") {
                    if (splitUrl[1] == "magister") {
                        chrome.tabs.insertCSS(tabId, {
                            file: "css/studiewijzersGrid.css"
                        }, () => {
                            console.log("inserted studiewijzers grid stylesheet")
                        })
                    }
                }
            }else {
                if (changeInfo.status == "loading") {
                    if (splitUrl[1] == "magister") {
                        chrome.tabs.insertCSS(tabId, {
                            file: "css/studiewijzersList.css"
                        }, () => {
                            console.log("inserted studiewijzers list stylesheet")
                        })
                    }
                }
            }
        }
    );
    
})