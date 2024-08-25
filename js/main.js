
var keuzeUI = false;

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
  
  setTimeout(() => {
    
    
    //~ Keuze plattegrond
    chrome.storage.sync.get(
      { keuzeBtn: true, darkMode: false, customPfp: false },
      (items) => {

        //~ Set custom pfp
        if (items.customPfp) {
          const divUserMenu = document.querySelector("a#user-menu");
          var pfp = divUserMenu.querySelector("figure img");
  
          if(pfp.getAttribute("alt") == "Aidan Schoester") {
              // pfp.setAttribute("src", "https://play-lh.googleusercontent.com/UGR4QjsBOQQV5sssh7bQtloCsMsQBBQZsnj0mvdK5XhgD-A0cCoQ1zXx1R83Qjam2vI")
              pfp.setAttribute("src", `https://thijmpie.netlify.app/img/adanPfp/${getWeekNumber()}.jpg`)
          }else if(pfp.getAttribute("alt") == "Joppe Tummers") {
              pfp.setAttribute("src", "https://i.kym-cdn.com/photos/images/newsfeed/002/652/421/280.jpg")
          }
        }


        if (items.keuzeBtn) {
          
          /// Keuze page
          const mainView = document.querySelector("div.view.ng-scope")
          const coverDivKeuze = document.createElement("div")

          coverDivKeuze.id = "coverDivKeuze"
          coverDivKeuze.style.position = "relative"
          coverDivKeuze.style.width = "100%"
          coverDivKeuze.style.height = "100%"
          coverDivKeuze.style.display = "none"
          coverDivKeuze.style.justifyContent = "center"
          coverDivKeuze.style.alignItems = "center"
          mainView.parentElement.appendChild(coverDivKeuze)

              

          /// Define button
          const buttonsSideList = document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-container > ul.main-menu");
          const newButtonList = document.createElement("li");
          buttonsSideList.appendChild(newButtonList)

          const newButton = document.createElement("a")
          newButton.innerHTML = `<i class="far ng-scope fa-regular fa-compass" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Keuze Plattegrond</span>`
              
          newButton.id = "customButtonKeuze"
          newButton.classList.add("customButton")
          newButton.style.borderRadius = "6px"

          /// Keuze plattegrond button onclick
          newButton.onclick = function(event) {

            /// Make the iframe if its not there yet
            if (document.getElementById("iframeKeuze") != null) {
              // do absolutely nothing                  
            } else {
              const iframeKeuze = document.createElement("iframe")

              if (items.darkMode) {
                iframeKeuze.src = "https://jordanmlu.netlify.app/keuze?style=magDark&sidebar=1"
              }else {
                iframeKeuze.src = "https://jordanmlu.netlify.app/keuze?style=magLight&sidebar=1"
              }

              iframeKeuze.id = "iframeKeuze"
              iframeKeuze.style.width = "100%"
              iframeKeuze.style.height = "100%"
              coverDivKeuze.appendChild(iframeKeuze)
            }

            /// Show UI
            event.preventDefault();
            keuzeUI = true;

            document.querySelector("body > div.container").style.paddingRight = "0"
            
            /// Button darker
            this.classList.add("customButtonClicked")

            /// All other buttons lighter
            const sideButtons = document.querySelectorAll(".main-menu>li>a")

            sideButtons.forEach(button => {
              if (!button.classList.contains("customButton")) {
                button.classList.add("nonCustomButtonNotClicked")
              }
            })
            
          };
          
          /// Append button
          newButtonList.appendChild(newButton);

          /// Do things when pressing other buttons (ie revert some shit and change dark button)
          const buttonsInListA = buttonsSideList.querySelectorAll("li a")

          for (const link of buttonsInListA) {
            if (!link.classList.contains("customButton")) {
              link.onclick = function(event) {
                event.preventDefault();
                keuzeUI = false;
                link.classList.remove("nonCustomButtonNotClicked")
                document.querySelector("body > div.container").style.paddingRight = "8px"
                document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
              }
            }
            
          }
        }

      }
    );
      
    

  }, 1000);  
}

var update100ms = window.setInterval(function(){

  const currentLocationSplit = (window.location.href.split("?")[0]).substring((window.location.href.split("?")[0]).indexOf(".") + 1) // eg. magister.net/magister/#/vandaag

  /// Chrome storage
  chrome.storage.sync.get(
      { cijfers: false , hideHelpBtn: true , hidePfp: false },
      (items) => {


        /// Bad cijfer hide
        if (items.cijfers) {
          if(currentLocationSplit == "magister.net/magister/#/vandaag"){
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

        /// Hide help button
        if (items.hideHelpBtn) {
          document.getElementById("help-menu").parentElement.style.display = "none"
        }else {
          document.getElementById("help-menu").parentElement.style.display = "block"
        }
        
        /// Hide pfp

        if (items.hidePfp){
          document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {
            img.style.width = "0"
          })
        }

      }
  );
  

  /// Edit layout button 
  if(currentLocationSplit == "magister.net/magister/#/vandaag"){
    if (document.getElementById("edit-toggle-btn").offsetWidth > 32 ) {
      document.getElementById("edit-toggle-btn").innerHTML = '<dna-icon name="far-pencil"></dna-icon><button aria-hidden="true" style="display: none" tabindex="-1" type="button"></button>'
    }
  }


  /// Cijcers lijst wel knop donker
  if(currentLocationSplit == "magister.net/magister/#/cijfers/cijferoverzicht" || currentLocationSplit == "magister.net/magister/#/cijfers"){
    document.getElementById("menu-cijfers").parentElement.classList.add("active")
  }else {
    document.getElementById("menu-cijfers").parentElement.classList.remove("active")
  }
  
  

  /// Check for hidden ui shit
  const divToHide = document.querySelector("div.view.ng-scope")
  const coverDivKeuze = document.getElementById("coverDivKeuze")
  const coverDivSheets = document.getElementById("coverDivSheets")

  if (keuzeUI) {
    divToHide.style.display = "none"
    coverDivKeuze.style.display = "flex"
  } else {
    divToHide.style.display = "block"
    coverDivKeuze.style.display = "none"
  }

  /// Studiewijzers grid
  const studiewijzersListItems = document.querySelectorAll('div.studiewijzer-list.normaal > ul > li');
  
  ////const colors = ['#FFA3A3', '#F2DC9B', '#D1FFA3', '#A3FFBA', '#A3FFFF', '#A3BAFF', '#CC9BF2'];
  ////const colors = ['#0e4772', '#023660'];
  const colors = ['#020203'];
  const opacity = 0.18;

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


  /// Remove aside tabs if == 1
  

  try {
    const asideHeadBar = document.querySelector('aside.ng-isolate-scope > div.head-bar');
    const asideTabs = asideHeadBar.querySelector('ul.tabs');
    const asideSheets = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets');
    const asideSpan = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets .block h3 span');

    if (asideTabs.childElementCount == 1) {
      asideHeadBar.style.display = "none";
      asideSheets.style.padding = "0px"
    }
    
    asideSpan.remove();
  }catch {
    
  }


  

}, 100);



init3();
