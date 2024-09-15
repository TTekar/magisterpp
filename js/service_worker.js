chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if (changeInfo.status == "loading") {

        var splitUrl = tab.url.split(".")
        
        if (splitUrl[1] == "magister") {

            chrome.storage.sync.get(
                { darkMode: false , studiewijzersGrid: false },
                async (items) => {

                    let cssToInsert = [];

                    // Light Mode
                    if (!items.darkMode) {
                        cssToInsert.push("css/lightMode.css"); 
                    }

                    // Studiewijzers Grid
                    if (items.studiewijzersGrid) {
                        cssToInsert.push("css/studiewijzersGrid.css");
                    }


                    console.log(cssToInsert)

                    for (const cssFile of cssToInsert) {
                        await chrome.scripting.insertCSS({
                            target: { tabId: tabId },
                            files: [cssFile],
                        }).then(() => console.log(`Inserted ${cssFile}`))
                          .catch((err) => console.warn(`Error inserting ${cssFile}`, err));
                    }

                    handleBerichtenStyle(items.darkMode);
                }
            );
        }
    }
})


async function handleBerichtenStyle(isDarkMode) {
    await chrome.scripting.getRegisteredContentScripts().then(async (scripts) => {
        const existingScript = scripts.find(script => script.id === "berichten-light-mode");

        if (existingScript) {
            await chrome.scripting.updateContentScripts([{
                id: "berichten-light-mode",
                css: [isDarkMode ? "css/darkMode.css" : "css/lightMode.css"],
                matches: ["*://*.magister.net/magister-berichten*"],
                allFrames: true,
                runAt: "document_start",
            }]).then(() => console.log("Updated berichten content script"))
              .catch((err) => console.warn("Error updating content script", err));
        } else {
            await chrome.scripting.registerContentScripts([{
                id: "berichten-light-mode",
                css: [isDarkMode ? "css/darkMode.css" : "css/lightMode.css"],
                matches: ["*://*.magister.net/magister-berichten*"],
                allFrames: true,
                runAt: "document_start",
            }]).then(() => console.log("Registered berichten content script"))
              .catch((err) => console.warn("Error registering content script", err));
        }
    });
}


// Open options page when clicking on thingy
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});