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

function getWeekNumber(date = new Date()) {
  const inputDate = new Date(date);
  if (isNaN(inputDate)) {
      return "Invalid date";
  }

  const startDate = new Date(inputDate.getFullYear(), 0, 1);
  const dayOfYear = Math.ceil((inputDate - startDate + 1) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(dayOfYear / 7);
  
  return weekNumber;
}

const init3 = function() {

    // container1.prepend(div1);

    // div1.appendChild(iframe);

  
    
    setTimeout(() => {
      // Set custom pfp
        const divUserMenu = document.querySelector("a#user-menu");
        var pfp = divUserMenu.querySelector("figure img");

        if(pfp.getAttribute("alt") == "Aidan Schoester") {
            // pfp.setAttribute("src", "https://play-lh.googleusercontent.com/UGR4QjsBOQQV5sssh7bQtloCsMsQBBQZsnj0mvdK5XhgD-A0cCoQ1zXx1R83Qjam2vI")
            pfp.setAttribute("src", `https://thijmpie.netlify.app/img/adanPfp/${getWeekNumber()}.jpg`)
        }else if(pfp.getAttribute("alt") == "Joppe Tummers") {
            pfp.setAttribute("src", "https://i.kym-cdn.com/photos/images/newsfeed/002/652/421/280.jpg")
        }

        // Keuzemap button

        // Keuze page
        const mainView = document.querySelector("div.view.ng-scope")
        const coverDiv = document.createElement("div")

        coverDiv.id = "coverDiv"
        coverDiv.style.position = "relative"
        coverDiv.style.width = "100%"
        coverDiv.style.height = "100%"
        coverDiv.style.display = "none"
        coverDiv.style.justifyContent = "center"
        coverDiv.style.alignItems = "center"
        mainView.parentElement.appendChild(coverDiv)

        

        // Button

        const buttonsSideList = document.querySelector("ul.main-menu");
        const newButtonList = document.createElement("li");
        buttonsSideList.appendChild(newButtonList)

        const newButton = document.createElement("a")
        newButton.innerHTML = `<i class="far ng-scope fa-question" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Keuze Plattegrond</span>`
        
        newButton.href = "#"
        newButton.classList.add("customButton")
        newButton.onclick = function(event) {
          event.preventDefault();
          hiddenUI = true;

          if (document.getElementById("iframeKeuze") != null) {
              
          } else {
            const iframeKeuze = document.createElement("iframe")
            iframeKeuze.src = "https://jordanmlu.netlify.app/keuze"
            iframeKeuze.id = "iframeKeuze"
            iframeKeuze.style.width = "100%"
            iframeKeuze.style.height = "100%"
            coverDiv.appendChild(iframeKeuze)
          }
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

    }, 1000);  
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
      coverDiv.style.display = "flex"
    }else {
      divToHide.style.display = "block"
      coverDiv.style.display = "none"
    }
  

    const studiewijzersListItems = document.querySelectorAll('div.studiewijzer-list.normaal > ul > li');
    
    //const colors = ['#FFA3A3', '#F2DC9B', '#D1FFA3', '#A3FFBA', '#A3FFFF', '#A3BAFF', '#CC9BF2'];
    //const colors = ['#0e4772', '#023660'];
    const colors = ['#131519'];
    const opacity = 0.75;

    function hexToRgba(hex, alpha) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

    studiewijzersListItems.forEach((li, index) => {
        const spans = li.querySelectorAll('a span');
        if (spans.length > 1) {
            spans[1].remove();
        }

        const colorIndex = index % colors.length;
        const rgbaColor = hexToRgba(colors[colorIndex], opacity);
        li.style.backgroundColor = rgbaColor;
    });

    const asideHeadBar = document.querySelector('aside.ng-isolate-scope > div.head-bar');
    const asideTabs = asideHeadBar.querySelector('ul.tabs');
    const asideSheets = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets');
    const asideSpan = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets .block h3 span');

    if (asideTabs.childElementCount == 1) {
      asideHeadBar.style.display = "none";
      asideSheets.style.padding = "0px"
    }

    try {
      asideSpan.remove();
    }catch {
      
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
