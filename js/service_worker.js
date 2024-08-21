chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status == "loading") {

        var splitUrl = tab.url.split(".")
        
        if (splitUrl[1] == "magister") {

            chrome.storage.sync.get(
                { darkMode: false , studiewijzersGrid: false },
                (items) => {

                    let cssToInsert = [];

                    // Dark Mode
                    if (!items.darkMode) {
                        cssToInsert.push("css/lightMode.css");
                    }

                    // Studiewijzers Grid
                    if (items.studiewijzersGrid) {
                        cssToInsert.push("css/studiewijzersGrid.css");
                    } else {
                        cssToInsert.push("css/studiewijzersList.css");
                    }


                    cssToInsert.forEach((cssFile) => {
                        chrome.scripting.insertCSS({
                            target: { tabId: tabId },
                            files: [cssFile]
                        }, () => {
                            console.log(`Inserted ${cssFile}`);
                        });
                    });
                }
            );
        }
    }
})

// Open options page when clicking on thingy
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});