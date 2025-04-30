let update500ms = window.setInterval(function(){

    let body = document.getElementsByTagName("body")[0]

// grijze bg licht
    let mooieBgColor = "#241d26"
// grijze bg mid
    let mooieBgColorMid = "#1c171e"
// grijze bg donker
    let mooieBgColorHover = "#1a151c"
// tekst           
    let mooieTextColor = "#ff5fff"
// tekst die altijd wit is ; op blauwe bg
    let mooieTextColorWhite = "#ffafff"

    let blueTextColorLight = "#a2c5e5"
// lichtere bg
    let background1 = "#71009e"
// lichte bg
    let primaryBackground = "#542368"
// donkere bg
    let secondaryBackground = "#46205B"
// donkere bg met opacity .2
    let secondaryBackgroundDarker = "#0E0612"
// mid tekst
    let midGray = "#7f3f7fff"

    // body.style = `--mooie-bg-color:${mooieBgColor} !important;--mooie-bg-color-mid:${mooieBgColorMid} !important;--mooie-bg-color-hover:${mooieBgColorHover} !important;--mooie-text-color: ${mooieTextColor} !important;--mooie-text-color-white: ${mooieTextColorWhite} !important;--blue-text-color-light: ${blueTextColorLight} !important;background-color: var(--mooie-bg-color) !important;--dna-primary: var(--mooie-text-color) !important;--dna-secondary: transparent !important;--dna-background: transparent !important;--background-1: ${background1} !important;--primary-background: ${primaryBackground} !important;--secondary-background: ${secondaryBackground} !important;--secondary-background-darker: ${secondaryBackgroundDarker} !important;--mid-gray: ${midGray} !important;`


}, 100);