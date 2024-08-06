const init2 = function() {
    // const div = document.getElementsByClassName("app-container")[0].children[1].children[0];
    // const img = document.createElement("img");
    // img.src = 'https://thijmpie.netlify.app/img/hk.png';
    // img.style.width = "auto";
    // img.style.height = "100vh";
    // img.style.textAlign = "right";
    // img.style.float = "right";
    // div.appendChild(img);

    const form = document.getElementsByClassName("podium")
    const h1 = document.createElement("h1")

    chrome.storage.sync.get(
        { inlogText: "Bonjour" },
        (items) => {
            h1.innerHTML = items.inlogText;
        }
    )

    h1.style.marginTop = "35px"
    form[0].prepend(h1)

    var appContainer = document.querySelector('.app-container')
    var secondDiv = appContainer.children[1]
    appContainer.removeChild(secondDiv)
}

init2();