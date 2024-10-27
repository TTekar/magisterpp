
var keuzeUI = false;

var madeKeuzeIframe = false;


const weekToPensum = { // schooljaar 2024-2025
  1: "",
  2: " - 2.8",
  3: " - LB-2 / SE-2",
  4: " - 3.1",
  5: " - 3.2",
  6: " - 3.3",
  7: " - 3.4",
  8: " - 3.5",
  9: "",
  10: " - 3.6",
  11: " - 3.7 / SE-3A",
  12: " - Projectweek",
  13: " - 3.8",
  14: " - LB-3 / SE-3B",
  15: " - 4.1",
  16: " - 4.2",
  17: "",
  18: "",
  19: " - 4.3",
  20: " - 4.4",
  21: " - 4.5",
  22: " - 4.6",
  23: " - 4.7 / SE-4",
  24: " - 4.8",
  25: " - 4.9",
  26: " - 4.10",
  27: " - LB-4",
  28: "",
  29: "",
  30: "",
  31: "",
  32: "",
  33: "",
  34: "",
  35: " - 1.1",
  36: " - 1.2",
  37: " - 1.3",
  38: " - 1.4",
  39: " - 1.5",
  40: " - 1.6",
  41: " - 1.7",
  42: " - 1.8",
  43: " - LB-1 / SE-1",
  44: "",
  45: " - 2.1",
  46: " - 2.2",
  47: " - 2.3",
  48: " - 2.4",
  49: " - 2.5",
  50: " - 2.6",
  51: " - 2.7",
  52: "",
  53: ""
}


const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length > 0) {
              if (document.querySelector('[id^="drag-"].vandaag-drag-hint')) document.querySelector('[id^="drag-"].vandaag-drag-hint').remove()
            }
        }
    }
}

const observer = new MutationObserver(callback)
var observing = false


function getWeekNumber(date = new Date()) {
  const inputDate = new Date(date)
  if (isNaN(inputDate)) {
      return "Invalid date"
  }

  const startDate = new Date(inputDate.getFullYear(), 0, 1)
  const dayOfYear = Math.ceil((inputDate - startDate + 1) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(dayOfYear / 7)
  
  return weekNumber
}

function getISOWeekNumber(date = new Date()) {
  const inputDate = new Date(date);
  if (isNaN(inputDate)) {
      return "Invalid date"
  }

  const day = inputDate.getUTCDay()
  const nearestThursday = new Date(inputDate)
  nearestThursday.setUTCDate(inputDate.getUTCDate() + 4 - (day === 0 ? 7 : day))

  const yearStart = new Date(Date.UTC(nearestThursday.getUTCFullYear(), 0, 1))

  const weekNumber = Math.ceil(((nearestThursday - yearStart) / (24 * 60 * 60 * 1000) + 1) / 7)

  return weekNumber
}


var update100ms = window.setInterval(function(){

  const currentLocationSplit = (window.location.href.split("?")[0]).substring((window.location.href.split("?")[0]).indexOf(".") + 1) // eg. magister.net/magister/#/vandaag


  //~ Keuze plattegrond

  if (!madeKeuzeIframe) {
    chrome.storage.sync.get(
      { keuzeBtn: true, darkMode: false },
      (items) => {

        //~ Keuze Plattegrond 
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

          if (mainView) mainView.parentElement.appendChild(coverDivKeuze)
          else return

          

          /// Define button
          const buttonsSideList = document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-container > ul.main-menu");
          const newButtonList = document.createElement("li");
          buttonsSideList.appendChild(newButtonList)

          const newButton = document.createElement("a")
          newButton.innerHTML = `<i class="far ng-scope fa-regular fa-compass" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Keuzes</span>`
              
          newButton.id = "customButtonKeuze"
          newButton.classList.add("customButton")
          newButton.style.borderRadius = "6px"

          /// Keuze plattegrond button onclick
          newButton.onclick = function(event) {

            /// Make the iframe if its not there yet
            if (!document.getElementById("iframeKeuze")) {
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

          document.getElementById("menu-berichten-new").onclick = function(event) {
            keuzeUI = false;
            document.querySelector("body > div.container").style.paddingRight = "8px"
            document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
          }

          madeKeuzeIframe = true

        }

      }
    );
  }


  /// Chrome storage
  chrome.storage.sync.get(
      { cijfers: false , hideHelpBtn: true , hidePfp: false , widgetCustomHigh: 385 , widgetCustomLow: 145 , darkMode: false , hideBestellenBtn: false , customPfp: false , widgetDrag: true },
      (items) => {

        //~ Set custom pfp
        if (items.customPfp) {

          chrome.storage.local.get(
            {  userImage: "" },
            (items) => {
              document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {

                if(document.querySelector("#user-menu > figure > img").getAttribute("alt") == "Aidan Schoester") {

                  img.setAttribute("src", `https://thijmpie.netlify.app/img/adanPfp/${getWeekNumber()}.jpg`)

                }else {

                  img.setAttribute("src", items.userImage)

                }
              })
            }
          );
        }


        //~ Custom widget height

        if (currentLocationSplit === "magister.net/magister/#/vandaag") {

          const vandaagWidgets = document.querySelectorAll("#vandaag-container > .main > .content-container > div > .ng-scope > div > div > .widget")

          vandaagWidgets.forEach((widget) => {
            const contentDiv = widget.querySelector(".content")
          
            if (widget.classList.contains("widget-high")) {
              contentDiv.style.height = `${items.widgetCustomHigh}px`
            }else {
              if (items.widgetCustomLow == 0) {
                const calcLow = (items.widgetCustomHigh - 92) / 2
                contentDiv.style.height = `${calcLow}px`
              }else {
                contentDiv.style.height = `${items.widgetCustomLow}px`
              }
            }
          
          })

        }
        


        //~ Bad cijfer hide
        if (items.cijfers && currentLocationSplit === "magister.net/magister/#/vandaag") {
          
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



        //~ Hide help button
        if (items.hideHelpBtn) {
          document.getElementById("help-menu").parentElement.style.display = "none"
        }else {
          document.getElementById("help-menu").parentElement.style.display = "block"
        }



        //~ Hide bestellen button
        if (items.hideBestellenBtn) {
          document.getElementById("menu-bestellen").parentElement.style.display = "none"
        }else {
          document.getElementById("menu-bestellen").parentElement.style.display = "block"
        }


        
        //~ Hide pfp
        if (items.hidePfp){
          document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {
            img.style.display = "none"
          })
        }else {
          document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {
            img.style.display = "block"
          })
        }


        //~ Hide widget drag  

        if (!items.widgetDrag && !observing) {
          observer.observe(document.body, { childList: true, subtree: true })
          observing = true
        }else if(items.widgetDrag) {
          observer.disconnect()
          observing = false
        }



        //~ Aantekeningen text color

        if (currentLocationSplit.includes("magister.net/magister/#/agenda")) {
          const iframe = document.querySelector("#idAantekeningen > div > .widget > .block > .content.aantekeningen > .widget table > tbody > tr > td.k-editable-area > iframe")

          if (iframe) {
            const iframeDocument = iframe.contentWindow.document
            if (items.darkMode) {
              iframeDocument.body.style.color = "#fff"
            }else {
              iframeDocument.body.style.color = "#000"
            }
          }

          const iframeAgenda = document.querySelector("#agenda-afspraak-bewerken-container > section > div > div.widget.wide.wysiwyg.k-content > table > tbody > tr > td > iframe")

          if (iframeAgenda) {
            const iframeDocument = iframeAgenda.contentWindow.document
            if (items.darkMode) {
              iframeDocument.body.style.color = "#fff"
            }else {
              iframeDocument.body.style.color = "#000"
            }
          }
        }

        

      }
  );
  

  /// Edit layout button 
  if(currentLocationSplit === "magister.net/magister/#/vandaag"){
    if (document.getElementById("edit-toggle-btn") && document.getElementById("edit-toggle-btn").offsetWidth > 32 ) {
      document.getElementById("edit-toggle-btn").innerHTML = '<dna-icon name="far-pencil"></dna-icon><button aria-hidden="true" style="display: none" tabindex="-1" type="button"></button>'
    }
  }


  /// Cijfers lijst wel knop donker
  if((currentLocationSplit == "magister.net/magister/#/cijfers/cijferoverzicht" || currentLocationSplit == "magister.net/magister/#/cijfers") && document.getElementById("menu-cijfers")) {
    document.getElementById("menu-cijfers").parentElement.classList.add("active")
  }else if (document.getElementById("menu-cijfers")) {
    document.getElementById("menu-cijfers").parentElement.classList.remove("active")
  }
  
  

  /// Check for hidden ui shit
  const divToHide = document.querySelector("div.view.ng-scope")
  const coverDivKeuze = document.getElementById("coverDivKeuze")

  if (divToHide && coverDivKeuze) {
    if (keuzeUI) {
      divToHide.style.display = "none"
      coverDivKeuze.style.display = "flex"
    } else {
      divToHide.style.display = "block"
      coverDivKeuze.style.display = "none"
    }
  }
  

  /// Studiewijzers grid multi color bs
  // const studiewijzersListItems = document.querySelectorAll('div.studiewijzer-list.normaal > ul > li');
  
  // ////const colors = ['#FFA3A3', '#F2DC9B', '#D1FFA3', '#A3FFBA', '#A3FFFF', '#A3BAFF', '#CC9BF2'];
  // ////const colors = ['#0e4772', '#023660'];
  // const colors = ['#020203'];
  // const opacity = 0.18;

  // function hexToRgba(hex, alpha) {
  //   const bigint = parseInt(hex.slice(1), 16);
  //   const r = (bigint >> 16) & 255;
  //   const g = (bigint >> 8) & 255;
  //   const b = bigint & 255;
  //   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  // }

  // studiewijzersListItems.forEach((li, index) => {
  //     const spans = li.querySelectorAll('a span');
  //     if (spans.length > 1) {
  //         spans[1].remove();
  //     }

  //     const colorIndex = index % colors.length;
  //     const rgbaColor = hexToRgba(colors[colorIndex], opacity);
  //     li.style.backgroundColor = rgbaColor;
  // });


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


  /// Absentie color

  if (currentLocationSplit === "magister.net/magister/#/att-absence") {
    const attAbsenceRoot = document.querySelector('html div.container > div.view.ng-scope > mg-att-absence > att-absence-root')

    if (attAbsenceRoot && attAbsenceRoot.shadowRoot) {

      const shadowRoot = attAbsenceRoot.shadowRoot

      const dashboard = shadowRoot.querySelector("#outlet > att-absence-dashboard")

      if (dashboard && dashboard.shadowRoot) {

        const shadowRoot = dashboard.shadowRoot

        const wrapperLink = shadowRoot.querySelector("div.wrapper > dna-link-card")

        wrapperLink.style.color = "var(--mooie-text-color)"

      }
    }
  }
  


  /// Activiteiten warning

  const attentionAlert = document.querySelector("#activiteit-detail-container > dna-alert")

  if (attentionAlert && attentionAlert.shadowRoot) {

    attentionAlert.shadowRoot.querySelectorAll(".text").forEach((text) => {
      text.style.color = "var(--mooie-text-color)"
    })

  }

  /// Dialog

  const dialog = document.querySelector("html dna-overlay-container > dna-overlay > dna-message-dialog")

  if (dialog && dialog.shadowRoot) {

    dialog.shadowRoot.querySelector("dna-dialog-title").style.color = "var(--mooie-text-color)"

    dialog.shadowRoot.querySelector("dna-button-bar > dna-button:nth-child(1):hover").style.backgroundColor = "var(--mooie-bg-color-hover)"

  }


  /// Datum week

  if (currentLocationSplit === "magister.net/magister/#/vandaag") {
    const week = "1.3"

    const pageHeader = document.querySelector("#vandaag-container > dna-page-header")

    if (pageHeader && pageHeader.shadowRoot) {

      if (!pageHeader.shadowRoot.getElementById("mpp-week-style")) {
        const style = document.createElement('style');
        style.id = "mpp-week-style"
        style.textContent = `
          div.container > div > div.title::after {
            content: "${weekToPensum[getISOWeekNumber()]}";
            color: var(--mid-gray);
          }
        `;

        pageHeader.shadowRoot.querySelector("div.container > div > div.title").style.userSelect = "none"

        pageHeader.shadowRoot.appendChild(style);
      
      }
    }
  }  

  /// Keuze button small hover text 

  const span = document.querySelector("#customButtonKeuze > span")

  if (span) {
    if ( window.getComputedStyle(span, '::after').content !== "none" && window.getComputedStyle(span, '::after').content !== "" ) {
      const fauxLabel = document.getElementById("faux-label")
      fauxLabel.style.display = "block"
      fauxLabel.innerHTML = "Keuzes"
  
      const menuContainerTop = document.querySelector("body > div.container > div.menu-host.loading.collapsed-menu > nav > div.menu-container").getBoundingClientRect().top
  
      const spanRect = span.getBoundingClientRect()
      const spanCenterY = spanRect.top + (spanRect.height / 2) - menuContainerTop - 12
  
      fauxLabel.style.top = `${spanCenterY}px`
    }
  }
  



  //~ Absentie

  if (currentLocationSplit === "magister.net/magister/#/att-absence") {

    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsDashDOM = attAbs.shadowRoot.querySelector("#outlet > att-absence-dashboard").shadowRoot

    const pageHeader = attAbsDashDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"


    attAbsDashDOM.querySelector(".wrapper > dna-link-card").shadowRoot.querySelectorAll(".arrow").forEach((item) => {
      item.style.color = "var(--mooie-bg-color)"
    })

  }

  if (currentLocationSplit === "magister.net/magister/#/att-absence/absence-overview-student") {
    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsOverDOM = attAbs.shadowRoot.querySelector("#outlet > att-absence-overview-student").shadowRoot

    attAbs.shadowRoot.querySelector("#outlet > att-absence-overview-student").style.backgroundColor = "var(--mooie-bg-color)"

    const scrollbarStyle = document.createElement("style")
    scrollbarStyle.id = "scrollbarStyle"

    scrollbarStyle.textContent = `
    *::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
    }

    *::-webkit-scrollbar-track {
      border-radius: 10px !important;
      background-color: var(--mooie-bg-color) !important;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--primary-background) !important; 
      border-radius: 5px !important;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: var(--primary-background) !important; 
    }`

    if (!attAbs.shadowRoot.getElementById("scrollbarStyle")) attAbs.shadowRoot.appendChild(scrollbarStyle)

    const pageHeader = attAbsOverDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"


    const dnaTabs = attAbsOverDOM.querySelector("dna-tabs")
    dnaTabs.style.backgroundColor = "var(--mooie-bg-color)"
    
    dnaTabs.querySelector("dna-tab > .page-content > att-lesson-registrations").style.backgroundColor = "var(--mooie-bg-color)"
    dnaTabs.querySelector("dna-tab > .page-content > att-lesson-registrations").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").style.backgroundColor = "var(--mooie-bg-color)"
    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab-bar").style.backgroundColor = "var(--mooie-bg-color)"

    dnaTabs.querySelectorAll("dna-tab-bar > dna-tab-button").forEach((btn) => { btn.style.color = "var(--mooie-text-color)" })

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.querySelector("ul").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.querySelector("ul > li").setAttribute("style", "")

    const hoverStyle = document.createElement("style")
    hoverStyle.id = "hoverStyle"

    hoverStyle.textContent = `
    ul > li:hover {
      background-color: var(--mooie-bg-color-hover);
    }`

    if (!dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.getElementById("hoverStyle")) dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.appendChild(hoverStyle)

  }

  if (currentLocationSplit.replace(/\/[^\/]+$/,"") == "magister.net/magister/#/att-absence/details") {
    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsOverDOM = attAbs.shadowRoot.querySelector("#outlet > att-parent-student-absence-details").shadowRoot

    attAbs.shadowRoot.querySelector("#outlet > att-parent-student-absence-details").style.backgroundColor = "var(--mooie-bg-color)"

    const scrollbarStyle = document.createElement("style")
    scrollbarStyle.id = "scrollbarStyle"

    scrollbarStyle.textContent = `
    *::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
    }

    *::-webkit-scrollbar-track {
      border-radius: 10px !important;
      background-color: var(--mooie-bg-color) !important;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--primary-background) !important; 
      border-radius: 5px !important;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: var(--primary-background) !important; 
    }`

    if (!attAbs.shadowRoot.getElementById("scrollbarStyle")) attAbs.shadowRoot.appendChild(scrollbarStyle)

    const pageHeader = attAbsOverDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"



    const cardStyle = document.createElement("style")
    cardStyle.id = "cardStyle"

    cardStyle.textContent = `
    .page-content > dna-card {
      background: var(--mooie-bg-color-mid);
      border-color: transparent;
      color: var(--mooie-text-color);
      --dna-control-border: var(--mid-gray);
    }`

    if (!attAbsOverDOM.getElementById("cardStyle")) attAbsOverDOM.appendChild(cardStyle)

    
  }
  

  //~ Cijfers list new
  if (currentLocationSplit === "magister.net/magister/#/cijfers") {
    
    const cijferTrs = document.querySelectorAll("#cijfers-laatst-behaalde-resultaten-container > section.main > div.content-container > div.wide-widget > div.table-block > div.content > table.data-overview > tbody > tr")

    cijferTrs.forEach((tr) => {
      if (!tr.classList.contains("customCijfersItem")) {
        const vak = tr.querySelector(`td[data-ng-bind="cijfer.vak.omschrijving"]`).innerHTML
        const dag = tr.querySelector(`td[data-ng-bind^="cijfer.ingevoerdOp"]`).innerHTML
        const wat = tr.querySelector(`td[data-ng-bind="cijfer.omschrijving"]`).innerHTML
        const cijfer = tr.querySelector(`td[data-ng-bind="cijfer.waarde"]`).innerHTML
        const weging = tr.children.item(4).innerHTML

        // Clear shit
        tr.innerHTML = ""

        // Make better shit

        // part 0

        const dagTd = document.createElement("td")
        dagTd.classList.add("c-dag")
        dagTd.innerHTML = dag

        // part 1

        const vakSpan = document.createElement("td")
        vakSpan.classList.add("c-vak")
        vakSpan.innerHTML = vak

        const watSpan = document.createElement("td")
        watSpan.classList.add("c-wat")
        watSpan.innerHTML = wat

        tr.appendChild(dagTd)
        tr.appendChild(vakSpan)
        tr.appendChild(watSpan)

        // part 2

        const backTd = document.createElement("td")
        backTd.classList.add("c-back-td")

        const cijferSpan = document.createElement("span")
        cijferSpan.classList.add("c-cijfer")
        cijferSpan.innerHTML = cijfer

        const wegingSpan = document.createElement("span")
        wegingSpan.classList.add("c-weging")
        wegingSpan.innerHTML = weging

        
        tr.appendChild(backTd)
        backTd.appendChild(wegingSpan)
        backTd.appendChild(cijferSpan)

        const endTd = document.createElement("td")
        endTd.classList.add("c-end")
        
        tr.appendChild(endTd)

        tr.classList.add("customCijfersItem")

      }
    })

  }

  //~ Opdrachten list new
  if (currentLocationSplit === "magister.net/magister/#/elo/opdrachten") {
    
    const opdrachtenTrs = document.querySelectorAll("#opdrachten-container > section > div > div > div.scroll-table.opdrachten-list.normaal > table > tbody > tr")

    opdrachtenTrs.forEach((tr) => {
      if (!tr.classList.contains("customOpdrachtenItem")) {
        const vak = tr.querySelector(`td[data-ng-bind="opdracht.Vak"]`).innerHTML
        const titel = tr.querySelector(`td[data-ng-bind="opdracht.Titel"]`).innerHTML
        const inleverenVoor = tr.querySelector(`td[data-ng-bind^="opdracht.InleverenVoor"]`).innerHTML
        const status = tr.querySelector(`td > div > span`).innerHTML
        const beoordeling = tr.querySelector(`td[data-ng-bind="getBeoordeling(opdracht)"]`).innerHTML

        tr.innerHTML = ""

        const inleverenVoorTd = document.createElement("td")
        inleverenVoorTd.classList.add("o-inleveren")
        const formatDate = inleverenVoor.split("-")[0] + "-" + inleverenVoor.split("-")[1] + "-" + "20" + inleverenVoor.split("-")[2]
        inleverenVoorTd.innerHTML = formatDate

        const vakTd = document.createElement("td")
        vakTd.classList.add("o-vak")
        vakTd.innerHTML = vak

        const titelTd = document.createElement("td")
        titelTd.classList.add("o-titel")
        titelTd.innerHTML = titel

        const beoordelingTd = document.createElement("td")
        beoordelingTd.classList.add("o-beoordeling")
        beoordelingTd.innerHTML = beoordeling

        const statusTd = document.createElement("td")
        statusTd.classList.add("o-status")
        statusTd.innerHTML = status

        tr.appendChild(inleverenVoorTd)
        tr.appendChild(vakTd)
        tr.appendChild(titelTd)
        tr.appendChild(statusTd)
        tr.appendChild(beoordelingTd)

        const endTd = document.createElement("td")
        endTd.classList.add("o-end")

        tr.appendChild(endTd)

        tr.classList.add("customOpdrachtenItem")
      }
    })

  }

  //~ Leermiddelen list new
  if (currentLocationSplit === "magister.net/magister/#/leermiddelen") {
    
    const leermiddelenTrs = document.querySelectorAll("#leermiddelen-container table.data-overview > tbody > tr")

    leermiddelenTrs.forEach((tr) => {
      if (!tr.classList.contains("customLeermiddelenItem")) {
        const soort = tr.querySelector(`td[data-on="leermiddel.Soort"] span`)
        const soorten = {
          "School": "S",
          "Huur": "H",
          "Koop": "K",
          "Digitaal": "D"
        }

        soort.innerHTML = soorten[soort.innerHTML]

        const endTd = document.createElement("td")
        endTd.classList.add("l-end")
        
        tr.appendChild(endTd)

        tr.classList.add("customLeermiddelenItem")

      }
    })

  }
  
  //~ Agenda list new
  if (currentLocationSplit === "magister.net/magister/#/agenda") {
    
    document.querySelectorAll("#afsprakenLijst .inhoud-opmerking").forEach((span) => {
      span.innerHTML = span.innerHTML.replace(/&amp;nbsp;*$/, "")
    })

    const agendaTrs = document.querySelectorAll("#afsprakenLijst > div.k-grid-content > table > tbody > tr")

    agendaTrs.forEach((tr) => {
      if (!tr.classList.contains("customOpdrachtenItem")) {
        if (tr.classList.contains("k-grouping-row")) { /// dagen

          tr.querySelector("td > p > a.k-i-collapse").remove()
          tr.querySelector("td > p > span > span.iconic").remove()

          const dagText = tr.querySelector("td > p > span > strong")

          dagText.innerHTML = dagText.innerHTML.charAt(0).toUpperCase() + dagText.innerHTML.slice(1);


        }else {  /// afspraken

          const tijd = tr.querySelector(`td:nth-child(2) > span > span`).innerHTML

          var uur = ""

          try {
            uur = tr.querySelector(`td:nth-child(3) > span > span[ng-bind="dataItem.lesuur"]`).innerHTML
          }catch {

          }

          const les = tr.querySelector(`td:nth-child(3) > span > span[data-ng-bind-template]`).innerHTML

          var locatie = ""

          try {
            locatie = tr.querySelector(`td:nth-child(3) > span > span:nth-child(3)`).innerHTML
          }catch {

          }

          var opmerking = ""

          try {
            opmerking = tr.querySelector(`td:nth-child(4) > span > span.inhoud-opmerking`).innerHTML
          }catch {

          }

          var iconText = ""

          try {
            iconText = tr.querySelector(`td:nth-child(6) > span.agenda-text-icon`).innerHTML
          }catch {

          }
          
          // console.log(tijd, uur, les, locatie, opmerking, iconText)
        


          tr.innerHTML = ""

          const tijdTd = document.createElement("td")
          tijdTd.classList.add("a-tijd")
          
          var formatTime1 = ""
          var formatTime2 = ""

          if (tijd === "hele dag") {
            formatTime1 = "hele"
            formatTime2 = "dag"
          }else {
            formatTime1 = tijd.split("-")[0].slice(0, -1)
            formatTime2 = tijd.split("-")[1].substring(1)
          }

          const tijdSpan1 = document.createElement("span")
          const tijdSpan2 = document.createElement("span")
          
          tijdSpan1.innerHTML = formatTime1
          tijdSpan2.innerHTML = formatTime2

          tr.appendChild(tijdTd)
          tijdTd.appendChild(tijdSpan1)
          tijdTd.appendChild(tijdSpan2)



          const uurTd = document.createElement("td")
          uurTd.classList.add("a-uur")
          uurTd.innerHTML = uur

          const lesTd = document.createElement("td")
          lesTd.classList.add("a-les")
          lesTd.innerHTML = les


          
          const divTd = document.createElement("td")
          divTd.classList.add("a-div")
          divTd.innerHTML = "—"


          const locatieTd = document.createElement("td")
          locatieTd.classList.add("a-locatie")
          locatieTd.innerHTML = locatie.replace(/^\((.*)\)$/, '$1');


          const opmerkingTd = document.createElement("td")
          opmerkingTd.classList.add("a-opmerking")
          opmerkingTd.innerHTML = opmerking

          const iconTd = document.createElement("td")
          iconTd.classList.add("a-icon")
          iconTd.innerHTML = iconText

          const endTd = document.createElement("td")
          endTd.classList.add("a-end")


          tr.appendChild(uurTd)
          tr.appendChild(lesTd)
          tr.appendChild(divTd)
          tr.appendChild(locatieTd)
          tr.appendChild(iconTd)
          tr.appendChild(opmerkingTd)
          tr.appendChild(endTd)

        }
        

        tr.classList.add("customOpdrachtenItem")

      }
    })

  }

}, 100);


function getDayStartAndEnd(dateString) {
  const [day, month, year] = dateString.split("-").map(Number)

  const start = new Date(year, month - 1, day, 0, 0, 0, 0)
  const end = new Date(year, month - 1, day, 23, 59, 59, 999)

  return { start, end }
}


const asyncFunc = async () => {
  const { start, end } = getDayStartAndEnd("02-10-2024")

  const events = await MagisterApi.events(start, end)

  const filteredEvents = events.filter(event => {
    const eventStart = new Date(event.Start)

    return eventStart >= start && eventStart <= end
  });

  console.log(filteredEvents)

  const msg = await MagisterApi.messages()
  console.log(msg)

  const ex = await MagisterApi.accountInfo()
  console.log(ex)

  const st = await MagisterApi.messageContent(2901245)
  console.log(st)
}

asyncFunc()