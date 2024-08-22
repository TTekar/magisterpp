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


                        chrome.scripting.getRegisteredContentScripts((scripts) => {
                            
                            const existingScript = scripts.find(script => script.id === "berichten-light-mode");
                        
                            if (existingScript) {
                                chrome.scripting.updateContentScripts([{
                                    id: "berichten-light-mode",
                                    css: ["css/lightMode.css"],
                                    matches: ["*://*.magister.net/magister-berichten*"],
                                    allFrames: true,
                                    runAt: "document_start",
                                }])
                                .then(() => console.log("registration complete"))
                                .catch((err) => console.warn("unexpected error", err))
                            }else {
                                chrome.scripting.registerContentScripts([{
                                    id: "berichten-light-mode",
                                    css: ["css/lightMode.css"],
                                    matches: ["*://*.magister.net/magister-berichten*"],
                                    allFrames: true,
                                    runAt: "document_start",
                                }])
                                .then(() => console.log("registration complete"))
                                .catch((err) => console.warn("unexpected error", err))
                            }
                        
                        
                        });
                        
                    }else {
                        chrome.scripting.getRegisteredContentScripts((scripts) => {
                            
                            const existingScript = scripts.find(script => script.id === "berichten-light-mode");
                        
                            if (existingScript) {
                                chrome.scripting.updateContentScripts([{
                                    id: "berichten-light-mode",
                                    css: ["css/darkMode.css"],
                                    matches: ["*://*.magister.net/magister-berichten*"],
                                    allFrames: true,
                                    runAt: "document_start",
                                }])
                                .then(() => console.log("registration complete"))
                                .catch((err) => console.warn("unexpected error", err))
                            }else {
                                chrome.scripting.registerContentScripts([{
                                    id: "berichten-light-mode",
                                    css: ["css/darkMode.css"],
                                    matches: ["*://*.magister.net/magister-berichten*"],
                                    allFrames: true,
                                    runAt: "document_start",
                                }])
                                .then(() => console.log("registration complete"))
                                .catch((err) => console.warn("unexpected error", err))
                            }
                        
                        
                        });
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