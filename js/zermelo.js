
var lln = {} 

fetch('https://jmlu.tekar.dev/lln.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Zermelo lln fetch response was not ok');
    }
    return response.json();
  })
  .then(data => {
    lln = data;
  })
  .catch(error => {
    console.error('There was a problem with the zermelo lln fetch operation:', error);
});


var zermeloLoop = window.setInterval(function(){

    const allSchedulesPage = document.querySelector("#app > div > div.lowerContent > div > div.masterHolder > div.master > div.allSchedulesPage")

    if (allSchedulesPage) {
        
        const persoonListItems = allSchedulesPage.querySelectorAll("div.allSchedulesList > .personListItem")

        persoonListItems.forEach(child => {
            const title = child.querySelector(".personInformation > .title")
            
            const name = title.textContent.split(" ")[0]

            const newName = `${name} - ${lln[name]}`

            if (lln[name] && title.textContent != newName) {
                title.textContent = newName
            }

        })

    }

}, 500)