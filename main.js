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

    
}

var intervalId = window.setInterval(function(){
    if(window.location.href == "https://hermanjordan.magister.net/magister/#/agenda"){
        div1.style.display = "block";
    }else {
        div1.style.display = "none";
    }
  }, 200);

init3();