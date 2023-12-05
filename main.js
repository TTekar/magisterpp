const div1 = document.createElement("div");

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

const iframe = document.createElement("iframe");
iframe.src = "https://www.jordanmlu.nl/agenda/";
iframe.width = "100%";
iframe.height = "100%";



const init3 = function() {

    // container1.prepend(div1);

    // div1.appendChild(iframe);

    
    
    setTimeout(() => {
        const divUserMenu = document.querySelector("a#user-menu");
        var pfp = divUserMenu.querySelector("figure img");

        if(pfp.getAttribute("alt") == "Aidan Schoester") {
            pfp.setAttribute("src", "https://play-lh.googleusercontent.com/UGR4QjsBOQQV5sssh7bQtloCsMsQBBQZsnj0mvdK5XhgD-A0cCoQ1zXx1R83Qjam2vI")
        }else if(pfp.getAttribute("alt") == "Joppe Tummers") {
            pfp.setAttribute("src", "https://i.kym-cdn.com/photos/images/newsfeed/002/652/421/280.jpg")
        }
    }, 1000);

    setTimeout(() => {
        var cijfer = document.querySelector("span.cijfer.ng-binding")
        if (parseFloat(cijfer.innerHTML) < 5.5) {
            cijfer.innerHTML = ":("
        }
    }, 2000);
    
    
}

// var intervalId = window.setInterval(function(){
//     if(window.location.href.split("?")[0] == "https://hermanjordan.magister.net/magister/#/agenda"){
//         div1.style.display = "block";
//     }else {
//         div1.style.display = "none";
//     }
//   }, 200);

init3();