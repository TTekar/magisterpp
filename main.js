const div1 = document.createElement("div");

const init3 = function() {
    var container1 = document.querySelector("body .container");

    
    div1.style.width = "25vw";
    div1.style.height = "77vh";
    div1.style.backgroundColor = "transparent";
    div1.style.position = "absolute";
    div1.style.marginBottom = "25px"
    div1.style.left = "52vw";
    div1.style.top = "154px";
    div1.style.display = "inline-block";
    div1.style.zIndex = "100";
    
    container1.prepend(div1);
    
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.jordanmlu.nl/agenda/";
    iframe.width = "100%";
    iframe.height = "100%";
    
    div1.appendChild(iframe);

    setTimeout(() => {
        const divUserMenu = document.querySelector("a#user-menu");
        var pfp = divUserMenu.querySelector("figure img");

        if(pfp.getAttribute("alt") == "Aidan Schoester") {
            pfp.setAttribute("src", "https://play-lh.googleusercontent.com/UGR4QjsBOQQV5sssh7bQtloCsMsQBBQZsnj0mvdK5XhgD-A0cCoQ1zXx1R83Qjam2vI")
        }else if(pfp.getAttribute("alt") == "Joppe Tummers" || pfp.getAttribute("alt") == "Senna Meijer") {
            pfp.setAttribute("src", "https://www.kerst-feestwinkel.nl/img/large/pluche-beer-met-piercings-22-cm/10039/802.gif")
        }
    }, 1500);
}

var intervalId = window.setInterval(function(){
    if(window.location.href == "https://hermanjordan.magister.net/magister/#/agenda"){
        div1.style.display = "block";
    }else {
        div1.style.display = "none";
    }
  }, 200);

init3();