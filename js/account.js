const init2 = function() {
    // const div = document.getElementsByClassName("app-container")[0].children[1].children[0];
    // const img = document.createElement("img");
    // img.src = 'https://tekar.netlify.app/img/hk.png';
    // img.style.width = "auto";
    // img.style.height = "100vh";
    // img.style.textAlign = "right";
    // img.style.float = "right";
    // div.appendChild(img);

    const form = document.getElementsByClassName("podium");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Bonjour";
    h1.style.marginTop = "35px";
    form[0].prepend(h1);


    var appContainer = document.querySelector('.app-container');
    var secondDiv = appContainer.children[1];
    appContainer.removeChild(secondDiv);
}

init2();