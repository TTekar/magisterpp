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

var hiddenUI = false;

const init3 = function() {

    // container1.prepend(div1);

    // div1.appendChild(iframe);

  
    
    setTimeout(() => {
      // Set custom pfp
        const divUserMenu = document.querySelector("a#user-menu");
        var pfp = divUserMenu.querySelector("figure img");

        if(pfp.getAttribute("alt") == "Aidan Schoester") {
            // pfp.setAttribute("src", "https://play-lh.googleusercontent.com/UGR4QjsBOQQV5sssh7bQtloCsMsQBBQZsnj0mvdK5XhgD-A0cCoQ1zXx1R83Qjam2vI")
            pfp.setAttribute("src", "https://thijmpie.netlify.app/img/igshtisj.png")
        }else if(pfp.getAttribute("alt") == "Joppe Tummers") {
            pfp.setAttribute("src", "https://i.kym-cdn.com/photos/images/newsfeed/002/652/421/280.jpg")
        }


        // Keuzemap button

        // Keuze page
        const mainView = document.querySelector("div.view.ng-scope")
        const coverDiv = document.createElement("div")

        coverDiv.width = "100vw"
        coverDiv.height = "100vh"
        coverDiv.id = "coverDiv"
        coverDiv.style.display = "none"
        mainView.parentElement.appendChild(coverDiv)

        const iframeKeuze = document.createElement("iframe")
        iframeKeuze.src = "https://jordanmlu.netlify.app/keuze"
        iframeKeuze.style.width = "75vw"
        iframeKeuze.style.height = "75vh"
        coverDiv.appendChild(iframeKeuze)

        // Button

        const buttonsSideList = document.querySelector("ul.main-menu");
        const newButtonList = document.createElement("li");
        buttonsSideList.appendChild(newButtonList)

        const newButton = document.createElement("a")
        newButton.innerHTML = `<i class="far ng-scope fa-question" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Keuze Plattegrond</span>`
        
        //newButton.href = "https://jordanmlu.netlify.app/keuze"
        newButton.href = "#"
        newButton.classList.add("customButton")
        newButton.onclick = function(event) {
          event.preventDefault(); // Prevent the default action (navigation)
          hiddenUI = true;
      };
      
      newButtonList.appendChild(newButton);

      const buttonsInListA = buttonsSideList.querySelectorAll("li a")

      for (const link of buttonsInListA) {
        if (!link.classList.contains("customButton")) {
          link.onclick = function(event) {
            event.preventDefault();
            hiddenUI = false;
          }
        }
        
      }

      // buttonsInListA.forEach((link, index) => {
      //   if (index < links.length - 1) { // Exclude the last <a> element
      //       link.addEventListener("click", () => {
      //         console.log("ahhh")
      //       } );
      //   }
      // });

    }, 1000);

    // setTimeout(() => {
    //     var cijfer = document.querySelector("span.cijfer.ng-binding")
    //     if (parseFloat(cijfer.innerHTML) < 8.5) {
    //         cijfer.innerHTML = "<5,5"
    //     }
    // }, 2000);
    
    
}

var checkYoBadCijfers = window.setInterval(function(){
    chrome.storage.sync.get(
        { cijfers: false },
        (items) => {
          if (items.cijfers) {
            if(window.location.href.split("?")[0] == "https://hermanjordan.magister.net/magister/#/vandaag"){
                var cijfer = document.querySelector("span.cijfer.ng-binding")

                if (cijfer.innerHTML.length > 4) {
                    return
                }

                if (parseFloat(cijfer.innerHTML) < 5.5) {
                    cijfer.innerHTML = "<5,5"
                }
                if (cijfer.innerHTML.toUpperCase().includes("Z") || cijfer.innerHTML.toUpperCase().includes("O")) {
                   cijfer.innerHTML = "< v"
                }
            }
          }
        }
      );
    

    // edit layout button remove text
    try{
      document.getElementById("edit-toggle-btn").innerHTML = '<dna-icon name="far-pencil"></dna-icon><button aria-hidden="true" style="display: none" tabindex="-1" type="button"></button>';
    }catch {
      
    }

    // Check for hidden ui shit
    const divToHide = document.querySelector("div.view.ng-scope")
    const coverDiv = document.getElementById("coverDiv")

    if (hiddenUI) {
      divToHide.style.display = "none"
      coverDiv.style.display = "block"
    }else {
      divToHide.style.display = "block"
      coverDiv.style.display = "none"
    }
  
  }, 100);


  
// var intervalId = window.setInterval(function(){
//     if(window.location.href.split("?")[0] == "https://hermanjordan.magister.net/magister/#/agenda"){
//         div1.style.display = "block";
//     }else {
//         div1.style.display = "none";
//     }
//   }, 200);

init3();