
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

const keysPressed = new Set()

var selectedSearchIndex = 0

var setBerichtenIframeUp = true
var setBerichtenIframeDown = true

var zoekenActive = false

var currentCijferId = 0

var currentDag = 0

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
  const inputDate = new Date(date)
  if (isNaN(inputDate)) {
    return "Invalid date"
  }

  const day = inputDate.getDay() || 7

  const nearestThursday = new Date(inputDate);
  nearestThursday.setDate(inputDate.getDate() + 4 - day);

  const yearStart = new Date(nearestThursday.getFullYear(), 0, 1);

  const weekNumber = Math.ceil(((nearestThursday - yearStart) / (24 * 60 * 60 * 1000) + 1) / 7);

  return weekNumber;
}

function formatYMDtoDmY(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}


var update100ms = window.setInterval(function(){

  const currentLocationSplit = (window.location.href.split("?")[0]).substring((window.location.href.split("?")[0]).indexOf(".") + 1) // eg. magister.net/magister/#/vandaag

  if (window.location.href.includes("?keuzes")) keuzeUI = true
  else keuzeUI = false

  //~ Keuze plattegrond

  if (!document.getElementById("coverDivKeuze")) {
    chrome.storage.sync.get(
      { keuzeBtn: true, darkMode: false , keuzeMode: "table" },
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

              let options = []

              if (items.darkMode) options.push("style=magDark")
              else options.push("style=magLight")
              
              if (items.keuzeMode === "options" || items.keuzeMode === "both") options.push("sidebar=1")
              if (items.keuzeMode === "table" || items.keuzeMode === "both") options.push("table=1")

              iframeKeuze.src = `https://jmlu.tekar.dev/keuze?${options.join("&")}`

              iframeKeuze.id = "iframeKeuze"
              iframeKeuze.style.width = "100%"
              iframeKeuze.style.height = "100%"
              coverDivKeuze.appendChild(iframeKeuze)
            }

            /// Show UI
            event.preventDefault();
            keuzeUI = true;

            window.location.href = `${window.location.href.split("?")[0]}?keuzes`
            

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

            
            setKeuzeIframeDown = true
            setKeuzeIframeUp = true
            
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
                window.location.href = `${window.location.href.split("?")[0]}`
                link.classList.remove("nonCustomButtonNotClicked")
                document.querySelector("body > div.container").style.paddingRight = "8px"
                document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
              }
            } 
          }

          document.getElementById("menu-berichten-new").onclick = function(event) {
            keuzeUI = false;
            window.location.href = `${window.location.href.split("?")[0]}`
            document.querySelector("body > div.container").style.paddingRight = "8px"
            document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
          }

          madeKeuzeIframe = true

          if (keuzeUI) document.getElementById("customButtonKeuze").click()

        }

      }
    );
  }


  /// Chrome storage
  chrome.storage.sync.get(
      { cijfers: false , hideHelpBtn: true , hidePfp: false , widgetCustomHigh: 385 , widgetCustomLow: 145 , darkMode: false , hideBestellenBtn: false , customPfp: false , widgetDrag: true , hideZoekenBtn: true , customVandaag: false , maxLaatsteCijfers: 10 },
      (items) => {

        zoekenActive = !items.hideZoekenBtn

        //~ Set custom pfp
        if (items.customPfp) {

          chrome.storage.local.get(
            {  userImage: "" },
            (items) => {
              document.querySelectorAll('img[mg-http-src$="/foto"]').forEach((img) => {

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

        //~ Zoeken btn hidden/shown
        if (items.hideZoekenBtn) {
          document.getElementById("searchButton").style.display = "none"
        }else {
          document.getElementById("searchButton").style.display = "block"
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

        // ~~ CUSTOM VANDAAG

        if (items.customVandaag) {
          const vandaagContainer = document.getElementById("vandaag-container")

          if (vandaagContainer) {
            const main = vandaagContainer.querySelector("section.main")

            if (main) vandaagContainer.innerHTML = ""

            //~ Date and Time

            const date = new Date()

            const [day, month, year] = getCurrentDateFormatted(currentDag).split("-").map(Number);

            const modDate = new Date(year, month - 1, day);

            const timeString = date.toLocaleTimeString("nl-NL", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })

            // console.log(timeString)

            const dateString = modDate.toLocaleDateString("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })

            const capitalDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)
            const index = capitalDate.indexOf(" ");
  
            const finalDate = capitalDate.slice(0, index) + "," + capitalDate.slice(index);
            
            const pensumSuffix = weekToPensum[getISOWeekNumber(modDate)]

            // console.log(finalDate, pensumSuffix)

            vandaagContainer.style.paddingRight = "0px"
            document.querySelector("body > .container").style.paddingRight = "0px"
            vandaagContainer.parentElement.style.paddingBottom = "0px"

            //~ Main Sections

            const infoWidth = 450        // TODO make this a setting   outside of create loop so it always updates and not only on refresh?

            if (!vandaagContainer.querySelector("#roosterDiv")) {
              const roosterDiv = document.createElement("div")
              roosterDiv.id = "roosterDiv"
              roosterDiv.style.width = `calc(100% - ${infoWidth}px)`
              vandaagContainer.appendChild(roosterDiv)
            }
            if (!vandaagContainer.querySelector("#infoDiv")) {
              const infoDiv = document.createElement("div")
              infoDiv.id = "infoDiv"
              infoDiv.style.width = `${infoWidth}px`
              vandaagContainer.appendChild(infoDiv)
            }

            //~ Rooster

            if (!document.getElementById("dayText")) {
              const dayText = document.createElement("div")
              dayText.id = "dayText"

              const dateText = document.createElement("span")
              dateText.id = "dateText"
              dateText.textContent = finalDate

              const pensumText = document.createElement("span")
              pensumText.id = "pensumText"
              pensumText.textContent = pensumSuffix

              document.getElementById("roosterDiv").appendChild(dayText)
              dayText.appendChild(dateText)
              dayText.appendChild(pensumText)
            }

            if (!document.getElementById("dagRooster")) {
              const dagRooster = document.createElement("ul")
              dagRooster.id = "dagRooster"
              document.getElementById("roosterDiv").appendChild(dagRooster)

              loadDayEvents()
            }

            
            


            //~ Info
            
            if (!document.getElementById("currentTime")) {
              const currentTime = document.createElement("span")
              currentTime.id = "currentTime"
              document.getElementById("infoDiv").appendChild(currentTime)
            }
            // update time
            document.getElementById("currentTime").textContent = timeString.replace(/:/g, " : ")
            
            //~ Cijfers
            if (!document.getElementById("cijfersCard")) {
              const cijfersCard = document.createElement("div")
              cijfersCard.id = "cijfersCard"
              cijfersCard.classList.add("infoCard")

              document.getElementById("infoDiv").appendChild(cijfersCard)

              const cijfersLeft = document.createElement("div")
              cijfersLeft.id = "cijfersLeft"
              cijfersLeft.innerHTML = `<i class="fa-regular fa-chevron-left"></i>`
              cijfersLeft.addEventListener("click", () => {
                if (currentCijferId > 0) currentCijferId -= 1
              })
              cijfersCard.appendChild(cijfersLeft)

              const cijfersMid = document.createElement("div")
              cijfersMid.id = "cijfersMid"
              cijfersCard.appendChild(cijfersMid)

              const cifjersRight = document.createElement("div")
              cifjersRight.id = "cijfersRight"
              cifjersRight.innerHTML = `<i class="fa-regular fa-chevron-right"></i>`
              cifjersRight.addEventListener("click", () => {
                if (currentCijferId < items.maxLaatsteCijfers - 1) currentCijferId += 1
              })
              cijfersCard.appendChild(cifjersRight)

              const laatsteCijfersText = document.createElement("span")
              laatsteCijfersText.id = "laatsteCijfersText"
              laatsteCijfersText.textContent = "Laatste Cijfers"
              laatsteCijfersText.addEventListener("click", () => { currentCijferId = 0 })
              cijfersMid.appendChild(laatsteCijfersText)

              const cijferWaarde = document.createElement("span")
              cijferWaarde.id = "cijferWaarde"
              cijferWaarde.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferWaarde)

              const cijferOmschrijving = document.createElement("span")
              cijferOmschrijving.id = "cijferOmschrijving"
              cijferOmschrijving.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferOmschrijving)

              const cijferVak = document.createElement("span")
              cijferVak.id = "cijferVak"
              cijferVak.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferVak)

              const cijferTijd = document.createElement("span")
              cijferTijd.id = "cijferTijd"
              cijfersMid.appendChild(cijferTijd)

              

              const cijferIdCurrent = document.createElement("span")
              cijferIdCurrent.id = "cijferIdCurrent"
              cijfersCard.appendChild(cijferIdCurrent)
            }
            
            /// Update Cijfers
            MagisterApi.grades.recent(items.maxLaatsteCijfers).then(result => {
              // console.log(result)
              const nth = currentCijferId
              cijferWaarde.textContent = result[nth].waarde
              cijferOmschrijving.textContent = `${result[nth].omschrijving} (x${result[nth].weegfactor})`
              cijferVak.textContent = result[nth].vak.omschrijving
              cijferTijd.textContent = formatDate(result[nth].ingevoerdOp)
              cijferIdCurrent.textContent = `${currentCijferId + 1} / ${result.length}`
              
              
              // cijfers color
              const float = parseFloat(result[nth].waarde.replace(",", "."))
              let value
              if (!isNaN(float) && float >= 0 && float <= 10) {
                value = float
              }else if (result[nth].waarde.length <= 3) {
                var tmpValue = 0
                for (const char of result[nth].waarde) {
                  if (char.toLowerCase() == "o") tmpValue += 1
                  else if (char.toLowerCase() == "z") tmpValue += 3
                  else if (char.toLowerCase() == "v") tmpValue += 5
                  else if (char.toLowerCase() == "r") tmpValue += 7
                  else if (char.toLowerCase() == "g") tmpValue += 9
                }
                value = tmpValue / result[nth].waarde.length
                if (tmpValue == 0) value = 6
              }else {
                value = 6
              }

              const t = value / 10;

              const startColor = { r: 206, g: 18, b: 8 }
              const midColor = { r: 255, g: 147, b: 246 }
              const endColor = { r: 186, g: 201, b: 239 }

              let r, g, b;
              if (value <= 7) {
                const t = value / 7;
                r = Math.round(startColor.r + (midColor.r - startColor.r) * t);
                g = Math.round(startColor.g + (midColor.g - startColor.g) * t);
                b = Math.round(startColor.b + (midColor.b - startColor.b) * t);
              } else {
                const t = (value - 7) / 3;
                r = Math.round(midColor.r + (endColor.r - midColor.r) * t);
                g = Math.round(midColor.g + (endColor.g - midColor.g) * t);
                b = Math.round(midColor.b + (endColor.b - midColor.b) * t);
              }

              cijferWaarde.style.color = `rgb(${r}, ${g}, ${b})`
            })

            //~ Mededelingen
            if (!document.getElementById("mededelingenCard")) {
              const mededelingenCard = document.createElement("div")
              mededelingenCard.id = "mededelingenCard"
              mededelingenCard.classList.add("infoCard")

              document.getElementById("infoDiv").appendChild(mededelingenCard)

              createMededelingen(mededelingenCard)
  

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



  //~ Search box

  if (!document.getElementById("searchBox")) {
    const searchBox = document.createElement("div")
    searchBox.id = "searchBox"
    searchBox.style.display = "none"
    searchBox.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        toggleSearchBox()
      }
    })

    const searchInput = document.createElement("input")
    searchInput.type = "text"
    searchInput.id = "searchInput"
    searchInput.setAttribute("autocomplete", "off")
    searchInput.addEventListener("input", search)

    const searchResults = document.createElement("ul")
    searchResults.id = "searchResults"

    const resultsPages = document.createElement("li")
    resultsPages.id = "resultsPages"

    const resultsStudiewijzers = document.createElement("li")
    resultsStudiewijzers.id = "resultsStudiewijzers"
    
    document.body.appendChild(searchBox)
    searchBox.appendChild(searchInput)
    searchBox.appendChild(searchResults)
    searchResults.appendChild(resultsPages)
    searchResults.appendChild(resultsStudiewijzers)
  }

  //~ Open search button
  if (!document.getElementById("searchButton")) {
    const searchButtonDiv = document.createElement("div")
    searchButtonDiv.id = "searchButton"
    searchButtonDiv.classList.add("menu-button")
    searchButtonDiv.innerHTML = `<a id="searchButtonA"><i class="fa-solid fa-magnifying-glass"></i><span>Zoeken (CTRL+K)</span></a>`
  
    const appbar = document.querySelector("body > div.container > div.appbar-host > mg-appbar > div.appbar")
    appbar.insertBefore(searchButtonDiv, appbar.firstChild)
    document.getElementById("searchButtonA").addEventListener("click", toggleSearchBox)
  }
  
  //! Delete first afwezigheid btn
  const afwezigheidBtns = document.querySelectorAll('#menu-afwezigheid'); 
  if (afwezigheidBtns.length > 1) {
    afwezigheidBtns[0].parentElement.remove();
  }

  // Set iframe event listeners for key up/down
  if (zoekenActive) {
    const berichtenIframe = document.getElementById("berichten-nieuw-frame")

    if (berichtenIframe){
      if (setBerichtenIframeDown){
        berichtenIframe.contentWindow.document.addEventListener("keydown", (event) => {
          document.dispatchEvent(
            new KeyboardEvent('keydown', {key: event.key, code: event.code})
          )
        })
        setBerichtenIframeDown = false
      }
      if (setBerichtenIframeUp){
        berichtenIframe.contentWindow.document.addEventListener("keyup", (event) => {
          document.dispatchEvent(
            new KeyboardEvent('keyup', {key: event.key, code: event.code})
          )
        })
        setBerichtenIframeUp = false
      }
    }
  }
  



}, 100);

window.navigation.addEventListener("navigate", (event) => {
  setTimeout(() => {
    setBerichtenIframeDown = true
    setBerichtenIframeUp = true
  }, 500);
})

function extractBodyContent(htmlString) {
  const bodyContentMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return bodyContentMatch ? bodyContentMatch[1] : ""
}


function createMededelingen(mededelingenCard) {
  mededelingenCard.classList.remove("content")
  mededelingenCard.innerHTML = ""
  const mededelingenTitle = document.createElement("span")
  mededelingenTitle.id = "mededelingenTitle"
  mededelingenTitle.textContent = "Mededelingen"
  mededelingenCard.appendChild(mededelingenTitle)


  MagisterApi.mededelingen().then(mededelingen => {
    
    mededelingen.forEach(med => {

      const medCard = document.createElement("div")
      medCard.classList.add("medCard")
      if (med.isGelezen) medCard.classList.add("gelezen")
      mededelingenCard.appendChild(medCard)

      const medSender = document.createElement("span")
      medSender.classList.add("medSender")
      medSender.textContent = `${med.eigenaar.voorletters} ${med.eigenaar.achternaam}`
      medCard.appendChild(medSender)

      const medTitle = document.createElement("span")
      medTitle.classList.add("medTitle")
      medTitle.textContent = med.onderwerp
      medCard.appendChild(medTitle)

      const medDate = document.createElement("span")
      medDate.classList.add("medDate")
      medDate.textContent = `${formatYMDtoDmY(med.begin)} - ${formatYMDtoDmY(med.einde)}`
      medCard.appendChild(medDate)

      medCard.addEventListener("click", () => {
        MagisterApi.mededeling(med.id).then(content => {
          mededelingenCard.innerHTML = ""
          mededelingenCard.classList.add("content")

          const contentTitle = document.createElement("span")
          contentTitle.id = "contentTitle"
          contentTitle.textContent = med.onderwerp
          mededelingenCard.appendChild(contentTitle)

          const contentAfzender = document.createElement("span")
          contentAfzender.id = "contentAfzender"
          contentAfzender.textContent = `Afzender: ${content.eigenaar.voorletters} ${content.eigenaar.achternaam}`
          mededelingenCard.appendChild(contentAfzender)

          let ontvangers = []
          content.ontvangers.forEach(ontv => ontvangers.push(ontv.omschrijving))

          const contentAan = document.createElement("span")
          contentAan.id = "contentAan"
          contentAan.textContent = `Aan: ${ontvangers.join(", ")}`
          mededelingenCard.appendChild(contentAan)

          const contentDate = document.createElement("span")
          contentDate.id = "contentDate"
          contentDate.textContent = `${formatYMDtoDmY(content.begin)} - ${formatYMDtoDmY(content.einde)}`
          mededelingenCard.appendChild(contentDate)

          const contentInhoud = document.createElement("div")
          contentInhoud.id = "contentInhoud"
          contentInhoud.innerHTML = extractBodyContent(content.inhoud)
          mededelingenCard.appendChild(contentInhoud)

          const contentTerug = document.createElement("div")
          contentTerug.id = "contentTerug"
          contentTerug.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`
          contentTerug.addEventListener("click", () => {
            createMededelingen(mededelingenCard)
          })
          mededelingenCard.appendChild(contentTerug)
        })
      })

    })

  })
}


function loadDayEvents() {
  dagRooster.innerHTML = ""

  const { start , end } = getDayStartAndEndString(getCurrentDateFormatted(currentDag))

  MagisterApi.roosterwijzigingen(start, end).then(roosterResults => {
    
    const wijzigingen = roosterResults.filter(event => {
      const eventStart = new Date(event.Start)

      const [sd, sm, sy] = start.split("-").map(Number)
      const startAsDate = new Date(sy, sm - 1, sd)

      const [ed, em, ey] = end.split("-").map(Number)
      const endAsDate = new Date(ey, em - 1, ed)


      return eventStart >= startAsDate && eventStart <= endAsDate
    })


    if (wijzigingen.length !== 0) {
  
      createEventsDay(wijzigingen)

    }else {
      MagisterApi.events(start, end, 1).then(result => {
        const events = result.filter(event => {
          const eventStart = new Date(event.Start)
    
          const [sd, sm, sy] = start.split("-").map(Number)
          const startAsDate = new Date(sy, sm - 1, sd)
    
          const [ed, em, ey] = end.split("-").map(Number)
          const endAsDate = new Date(ey, em - 1, ed)
    
    
          return eventStart >= startAsDate && eventStart <= endAsDate
        })
    
        createEventsDay(events)
      })
    }

    

  })

  const [day, month, year] = getCurrentDateFormatted(currentDag).split("-").map(Number);
  const modDate = new Date(year, month - 1, day);

  const dateString = modDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const capitalDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)
  const index = capitalDate.indexOf(" ");

  const finalDate = capitalDate.slice(0, index) + "," + capitalDate.slice(index);
  
  const pensumSuffix = weekToPensum[getISOWeekNumber(modDate)]

  document.getElementById("dateText").textContent = finalDate
  document.getElementById("pensumText").textContent = pensumSuffix
  
}

function createEventsDay(e) {

  e.forEach(event => {
    
    const eventDiv = document.createElement("li")
    eventDiv.classList.add("roosterEvent")
    eventDiv.addEventListener("click", () => {
      const newUrl = "https://" + window.location.href.split(".")[0].split("//")[1] + ".magister.net/magister/#/agenda/huiswerk/" + event.Id
      // console.log(newUrl)
      window.location.href = newUrl
    })
    dagRooster.appendChild(eventDiv)

    const vakSpan = document.createElement("span")
    // if (event.Vakken[0]) vakSpan.textContent = event.Vakken[0].Naam
    // else vakSpan.textContent = event.Omschrijving
    vakSpan.textContent = event.Omschrijving
    vakSpan.classList.add("eventVak")
    eventDiv.appendChild(vakSpan)

  })

}


function getDayStartAndEnd(dateString) {
  const [day, month, year] = dateString.split("-").map(Number)

  const start = new Date(year, month - 1, day, 0, 0, 0, 0)
  const end = new Date(year, month - 1, day, 23, 59, 59, 999)

  return { start, end }
}

function getDayStartAndEndString(dateString) {
  const [day, month, year] = dateString.split("-").map(Number)
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 1);

  const nextDay = String(date.getDate()).padStart(2, "0");
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextYear = date.getFullYear();

  endString = `${nextDay}-${nextMonth}-${nextYear}`

  return { start: dateString , end: endString }
}

function getCurrentDateFormatted(skipDays = 0) {
  const currentDate = new Date()
  
  currentDate.setDate(currentDate.getDate() + skipDays)

  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()

  return `${day}-${month}-${year}`
}


const asyncFunc = async () => {
  const { start, end } = getDayStartAndEnd("02-10-2024")

  const events = await MagisterApi.events(start, end)

  const filteredEvents = events.filter(event => {
    const eventStart = new Date(event.Start)

    return eventStart >= start && eventStart <= end
  });

  console.log(filteredEvents)
}

// asyncFunc()

function toggleSearchBox() {
  const searchBox = document.getElementById("searchBox")

  if (searchBox.style.display === "none") {
    searchBox.style.display = "block"
    const searchInput = document.getElementById("searchInput")
    searchInput.focus()
    searchInput.value = ""
    document.getElementById("resultsPages").innerHTML = ""
    document.getElementById("resultsStudiewijzers").innerHTML = ""
    selectedSearchIndex = 0
    search()
  }else {
    searchBox.style.display = "none"
  }
}

function formatText(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\//g, ' ').replace(/\s/g, '')
}

async function search() {
  const searchInput = document.getElementById("searchInput")
  const searchResults = document.getElementById("searchResults")
  const resultsPages = document.getElementById("resultsPages")
  const resultsStudiewijzers = document.getElementById("resultsStudiewijzers")
  const input = searchInput.value.toLowerCase()

  const studiewijzers = await MagisterApi.studiewijzers()

  const pages = [
    {
      "title": "Vandaag",
      "btnId": "menu-vandaag"
    },
    {
      "title": "Agenda",
      "btnId": "menu-agenda"
    },
    {
      "title": "Afwezigheid",
      "btnId": "menu-afwezigheid"
    },
    {
      "title": "Cijfers",
      "btnId": "menu-cijfers"
    },
    {
      "title": "Examen",
      "btnId": "menu-examen"
    },
    {
      "title": "LVS/Logboeken",
      "btnId": "menu-logboeken"
    },
    {
      "title": "LVS/Toetsen",
      "btnId": "menu-toetsen"
    },
    {
      "title": "OPP",
      "btnId": "menu-opp"
    },
    {
      "title": "ELO/Bronnen",
      "btnId": "menu-bronnen"
    },
    {
      "title": "ELO/Studiewijzers",
      "btnId": "menu-studiewijzers"
    },
    {
      "title": "ELO/Opdrachten",
      "btnId": "menu-opdrachten"
    },
    {
      "title": "Portfolio/Profiel",
      "btnId": "menu-profiel"
    },
    {
      "title": "Portfolio/Portfoliodocumenten",
      "btnId": "menu-portfoliodocumenten"
    },
    {
      "title": "Portfolio/Beoordeelde documenten",
      "btnId": "menu-beoordeelde-producten"
    },
    {
      "title": "Activiteiten",
      "btnId": "menu-activiteiten"
    },
    {
      "title": "Leermiddelen",
      "btnId": "menu-leermiddelen"
    },
    {
      "title": "Berichten",
      "btnId": "menu-berichten-new"
    },
    {
      "title": "Mijn gegevens",
      "btnId": "mijnGegevens"
    },
    {
      "title": "Keuzes",
      "btnId": "customButtonKeuze"
    }
  ]

  // check search
  var matches = []

  pages.forEach((page) => {
    const position = formatText(page.title).indexOf(formatText(input))

    if (position !== -1) { 
      matches.push({ page, position })
    }

    // if (formatText(page.title).includes(formatText(input))) {
    //   matches.push({ page })
    // }
  })


  studiewijzers.forEach((studiewijzer) => {
    const position = formatText(studiewijzer.Titel).indexOf(formatText(input))

    if (position !== -1) { 
      matches.push({ studiewijzer, position })
    }

    // if (formatText(studiewijzer.Titel).includes(formatText(input))) {
    //   matches.push({ studiewijzer })
    // }
  })

  matches.sort((a, b) => a.position - b.position);

  // console.log(matches)

  resultsPages.innerHTML = ""
  resultsStudiewijzers.innerHTML = ""
  selectedSearchIndex = 0
  resultsStudiewijzers.style.display = "block"
  resultsPages.style.display = "block"

  matches.forEach(match => {
    if (match.studiewijzer) {
      const li = document.createElement("li")
      li.classList.add("searchResult")
      li.addEventListener("click", () => {
        if (window.location.href.includes("magister.net/magister/#/berichten")) {
          toggleSearchBox()
          window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
          setTimeout(() => {
            window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
          }, 100);
        }else {
          toggleSearchBox()
          window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
        }
      })

      const title = document.createElement("span")
      title.classList.add("resultTitle")
      title.textContent = match.studiewijzer.Titel

      resultsStudiewijzers.appendChild(li)
      li.appendChild(title)
    }
    else if(match.page) {
      const li = document.createElement("li")
      li.classList.add("searchResult")
      if (match.page.btnId === "mijnGegevens") {
        li.addEventListener("click", () => {
          if (window.location.href.includes("magister.net/magister/#/berichten")) {
            document.getElementById("menu-vandaag").click()
            toggleSearchBox()
            setTimeout(() => {
              document.getElementById("menu-vandaag").click()
            }, 100)
            setTimeout(() => {
              window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/mijn-instellingen`)
            }, 500)
          }else {
            toggleSearchBox()
            document.getElementById("menu-vandaag").click()
            setTimeout(() => {
              window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/mijn-instellingen`)
            }, 100)
          }
        })
      }else {
        li.addEventListener("click", () => {
          if (window.location.href.includes("magister.net/magister/#/berichten")) {
            document.getElementById(match.page.btnId).click()
            toggleSearchBox()
            setTimeout(() => {
              document.getElementById(match.page.btnId).click()
            }, 100)
          }else {
            toggleSearchBox()
            document.getElementById(match.page.btnId).click()
          }
        })
      }
      

      const title = document.createElement("span")
      title.classList.add("resultTitle")
      title.textContent = match.page.title

      resultsPages.appendChild(li)
      li.appendChild(title)
    }
    
  })

  if (resultsPages.childElementCount == 0) {
    resultsPages.style.display = "none"
  }
  
  if (resultsStudiewijzers.childElementCount == 0) {
    resultsStudiewijzers.style.display = "none"
  }

  const pagesTitle = document.createElement("h1")
  pagesTitle.textContent = "Pagina's"
  resultsPages.insertBefore(pagesTitle, resultsPages.firstChild)

  const studiewijzersTitle = document.createElement("h1")
  studiewijzersTitle.textContent = "Studiewijzers"
  resultsStudiewijzers.insertBefore(studiewijzersTitle, resultsStudiewijzers.firstChild)


  searchResults.querySelector(".searchResult").classList.add("selected")
}

function formatDate(dateString) {
  const date = new Date(dateString)

  const day = date.getDate();
  const monthName = new Intl.DateTimeFormat("nl-NL", { month: "long" }).format(date)
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${monthName} ${year}, ${hours}:${minutes}`
}


function moveSelectedIndexDown() {
  const results = document.querySelectorAll(".searchResult")

  results[selectedSearchIndex].classList.remove("selected")
  
  selectedSearchIndex = (selectedSearchIndex + 1) % results.length
  
  results[selectedSearchIndex].classList.add("selected")
}

function moveSelectedIndexUp() {
  const results = document.querySelectorAll(".searchResult")

  results[selectedSearchIndex].classList.remove("selected")
  
  selectedSearchIndex = (selectedSearchIndex - 1 + results.length) % results.length
  
  results[selectedSearchIndex].classList.add("selected")
}

function clickSelectedIndex() {
  const selectedItem = document.querySelector('#searchResults .selected');
  
  selectedItem.click();
  
}

function keydownFunc(event) {
  keysPressed.add(event.code);
  keysPressed.add(event.key);

  if (zoekenActive) {
    if (keysPressed.has("Control") && keysPressed.has("KeyK")) {
      toggleSearchBox()
    }
  }
  
  // if (keysPressed.has("Alt") && keysPressed.has("KeyS")) {
  //   toggleSearchBox()
  // }

  // console.log(keysPressed)
  

  if (document.getElementById("searchBox").style.display === "block") {

    if (keysPressed.has("Escape")) {
      toggleSearchBox()
    }

    if (keysPressed.has("Enter")) {
      clickSelectedIndex()
    }
    
    if (keysPressed.has("ArrowDown")) {
      moveSelectedIndexDown()
    }

    if (keysPressed.has("ArrowUp")) {
      moveSelectedIndexUp()
    }

  }

  if (document.getElementById("dagRooster")) {
    if (keysPressed.has("ArrowRight")) {
      currentDag++
      loadDayEvents()
    }
  
    if (keysPressed.has("ArrowLeft")) {
      currentDag--
      loadDayEvents()
    }
  }
  
}

function keyupFunc(event) {
  keysPressed.delete(event.code);
  keysPressed.delete(event.key);
}

//~ Hotkeys

document.addEventListener("keydown", (event) => keydownFunc(event))
document.addEventListener("keyup", (event) => keyupFunc(event))
