chrome.runtime.sendMessage({ action: 'popstateDetected' }) // Revive the service worker

let syncedStorage = {},
    localStorage = {},
    locale = 'nl-NL',
    i18nData = {},
    i18nDataNl = {},
    verbose = false,
    apiUserId,
    apiUserToken,
    apiCache = {};

let eggs = [],
    announcements = [],
    snackbarQueue = [];

(async () => {
    if (chrome?.storage) {
        syncedStorage = await getFromStorageMultiple(null, 'sync', true)

        if (chrome?.runtime) {
            locale = syncedStorage['language']
            if (!['nl-NL', 'en-GB', 'fr-FR', 'de-DE', 'sv-SE', 'la-LA'].includes(locale)) locale = 'nl-NL'
            chrome.storage.sync.onChanged.addListener((changes) => { if (changes.language) window.location.reload() })
            const req = await fetch(chrome.runtime.getURL(`src/strings/${locale.split('-')[0]}.json`))
            i18nData = await req.json()
            const reqNl = await fetch(chrome.runtime.getURL(`src/strings/nl.json`))
            i18nDataNl = await reqNl.json()
        }

        localStorage = await getFromStorageMultiple(null, 'local', true)
    }

    verbose = syncedStorage['verbosity']
})()

window.addEventListener('DOMContentLoaded', async () => {
    handleAnnouncements()
})

async function handleAnnouncements() {
    let response = await fetch(`https://raw.githubusercontent.com/QkeleQ10/http-resources/main/study-tools/announcements.json`)
    if (!response.ok) return
    announcements = Object.values(await response.json())

    announcements
        .filter(announcement => announcement.type === 'snackbar' || announcement.type === 'dialog')
        .forEach(async announcement => {
            if (await isAnnouncementValid(announcement)) {
                notify(announcement.type || 'snackbar', announcement.body, announcement.buttons, announcement.duration || 10000)
                if (announcement.showOnceId) setTimeout(() => {
                    saveToStorage(`announcement-${announcement.showOnceId}`, true, 'local')
                }, 5000)
            }
        })
}

function isAnnouncementValid(announcement) {
    return new Promise(async (resolve, reject) => {
        let now = new Date()
        if (!!announcement.requiredSettings && !announcement.requiredSettings.every(setting => syncedStorage[setting])) resolve(false)
        if (!!announcement.onlyForStudents && !announcement.onlyForStudents.includes((await awaitElement('.menu-button figure img')).getAttribute('alt'))) resolve(false)
        if (!!announcement.onlyForSchools && !announcement.onlyForSchools.includes(await getFromStorage('schoolName', 'local')) && !announcement.onlyForSchools.includes('studentname')) resolve(false)
        if (!!announcement.dateStart && (new Date(announcement.dateStart) > now)) resolve(false)
        if (!!announcement.dateEnd && (new Date(announcement.dateEnd) < now)) resolve(false)
        if (!!announcement.onlyOnWeekdays && !announcement.onlyOnWeekdays.includes(now.getDay())) resolve(false)
        if (!!announcement.onlyBeforeTime && (new Date(`${now.toDateString()} ${announcement.onlyBeforeTime}`) < now)) resolve(false)
        if (!!announcement.onlyAfterTime && (new Date(`${now.toDateString()} ${announcement.onlyAfterTime}`) > now)) resolve(false)
        if (!!announcement.showOnceId && (await getFromStorage(`announcement-${announcement.showOnceId}`, 'local') || false)) resolve(false)

        resolve(true)
    })
}


/**
 * 
 * @param {TimerHandler} func 
 * @param {number} [interval]
 */
function setIntervalImmediately(func, interval) {
    func()
    return setInterval(func, interval)
}

/**
 * Creates an element if it doesn't exist already and applies the specified properties to it.
 * @param {string} [tagName] The element's tag name
 * @param {string} [id] The element's ID
 * @param {HTMLElement} [parent] The element's parent
 * @param {Object} [attributes] The attributes to assign to the element
 * @param {string} [attributes.innerText] The element's inner text
 * @returns {HTMLElement} The created element.
 */
function element(tagName, id, parent, attributes) {
    let elem = id ? document.getElementById(id) : undefined
    if (!elem) {
        elem = document.createElement(tagName)
        if (id) elem.id = id
        if (parent) parent.append(elem)
        if (attributes) elem.setAttributes(attributes)
    } else {
        if (attributes) elem.setAttributes(attributes)
    }
    return elem
}

/**
 * 
 * @param {string} querySelector 
 * @param {boolean} [all=false] 
 * @param {number} [duration=10000] 
 * @returns 
 */
function awaitElement(querySelector, all = false, duration = 10000, quiet = false) {
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            if (document.querySelector(querySelector)) {
                clearInterval(interval)
                clearTimeout(timeout)
                return resolve(all ? document.querySelectorAll(querySelector) : document.querySelector(querySelector))
            }
        }, 50)

        let timeout = setTimeout(() => {
            clearInterval(interval)
            if (!quiet) console.warn("Could not find element: ", querySelector, all, duration)
            return resolve(undefined)
        }, duration)
    })
}

/**
 * 
 * @param {string} key 
 * @param {'sync'|'local'|'session'} [location='sync'] 
 * @returns {*} Value
 */
function getFromStorage(key, location = 'sync') {
    return new Promise((resolve, reject) => {
        if (location === 'session' && !chrome.storage.session) location = 'local'
        chrome.storage[location].get([key], (result) => {
            let value = Object.values(result || {})[0]
            value ? resolve(value) : resolve('')
        })
    })
}

/**
 * 
 * @param {string[]} [array] 
 * @param {'sync'|'local'|'session'} [location='sync'] 
 * @param {boolean} [all=false] 
 * @returns {object} Key-value pairs
 */
function getFromStorageMultiple(array, location = 'sync', all = false) {
    return new Promise((resolve, reject) => {
        if (location === 'session' && !chrome.storage.session) location = 'local'
        chrome.storage[location].get(all ? null : array.map(e => [e]), (result) => {
            result ? resolve(result) : reject(Error('None found'))
        })
    })
}

function saveToStorage(key, value, location) {
    return new Promise((resolve, reject) => {
        if (location === 'session' && !chrome.storage.session) location = 'local'
        chrome.storage[location ? location : 'sync'].set({ [key]: value }, resolve())
    })
}

Element.prototype.setAttributes = function (attributes) {
    const elem = this
    for (var key in attributes) {
        if (key === 'innerText') elem.innerText = attributes[key]
        else if (key === 'innerHTML') elem.innerHTML = attributes[key]
        else if (key === 'viewBox') elem.setAttributeNS(null, 'viewBox', attributes[key])
        else elem.setAttribute(key, attributes[key])
    }
}

function formatTimestamp(start, end, now, includeTime) {
    now ??= new Date()
    start ??= end ?? now
    end ??= start ?? now
    let timestamp = start.toLocaleDateString(locale, { timeZone: 'Europe/Amsterdam', weekday: 'short', day: 'numeric', month: 'long' })
    if (start <= now && end >= now) {
        // Start date is in the past and End date is in the future
        i18n('dates.now')
    } else if (start >= now) {
        // Start date is in the future
        if (start - now < minToMs(15)) timestamp =
            i18n('dates.soon')
        else if (start.isToday()) timestamp =
            i18n(includeTime ? 'dates.todayAtTime' : 'dates.today', { time: start.getFormattedTime() })
        else if (start.isTomorrow()) timestamp =
            i18n(includeTime ? 'dates.tomorrowAtTime' : 'dates.tomorrow', { time: start.getFormattedTime() })
        else if (start - now < daysToMs(5)) timestamp =
            i18n(includeTime ? 'dates.weekdayAtTime' : 'dates.nextWeekday', { weekday: start.getFormattedDay(), time: start.getFormattedTime() })
        else if (start - now < daysToMs(90)) timestamp =
            i18n('dates.weekdayInWeek', { weekday: start.getFormattedDay(), week: start.getWeek() })
        else timestamp =
            start.toLocaleDateString(locale, { timeZone: 'Europe/Amsterdam', weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    } else if (end <= now) {
        // End date is in the past
        if (now - end < minToMs(5)) timestamp =
            i18n('dates.justNow')
        else if (now - end < minToMs(15)) timestamp =
            i18n('dates.fewMinsAgo')
        else if (end.isToday()) timestamp =
            i18n(includeTime ? 'dates.todayAtTime' : 'dates.today', { time: end.getFormattedTime() })
        else if (end.isYesterday()) timestamp =
            i18n(includeTime ? 'dates.yesterdayAtTime' : 'dates.yesterday', { time: end.getFormattedTime() })
        else if (now - end < daysToMs(5)) timestamp =
            i18n('dates.lastWeekday', { weekday: end.getFormattedDay() })
        else if (now.getFullYear() !== end.getFullYear()) timestamp =
            end.toLocaleDateString(locale, { timeZone: 'Europe/Amsterdam', weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    }

    return timestamp
}

// Elements with a temporal binding are updated every second, or whenever the function is invoked manually.
function updateTemporalBindings() {
    let elementsWithTemporalBinding = document.querySelectorAll('[data-temporal-type]')
    elementsWithTemporalBinding.forEach(element => {

        let now = new Date(),
            type = element.dataset.temporalType,
            start = new Date(element.dataset.temporalStart || now),
            end = new Date(element.dataset.temporalEnd || element.dataset.temporalStart || now)

        switch (type) {
            case 'timestamp':
                timestamp = formatTimestamp(start, end, now, true)
                if (element.dataset.time != timestamp) element.dataset.time = timestamp
                break

            case 'style-hours':
                element.style.setProperty('--relative-start', now.getHoursWithDecimals())
                break

            case 'ongoing-check':
                element.dataset.ongoing = (start <= now && end >= now)
                break

            case 'style-progress':
                let progress = (now - start) / (end - start)
                element.style.setProperty('--progress', Math.min(Math.max(0, progress), 1))
                element.dataset.done = progress >= 1
                break

            case 'current-time-long': {
                const timef = now.toLocaleTimeString(locale, { timeZone: 'Europe/Amsterdam', hours: '2-digit', minutes: '2-digit', seconds: '2-digit' })
                element.dataset.time = timef
                break
            }

            case 'current-time-short': {
                const timef = now.toLocaleTimeString(locale, { timeZone: 'Europe/Amsterdam', hours: '2-digit', minutes: '2-digit', timeStyle: 'short' })
                element.dataset.time = timef
                break
            }

            default:
                break
        }
    })
}
setIntervalImmediately(updateTemporalBindings, 1000)

let minToMs = (minutes = 1) => minutes * 60000
let daysToMs = (days = 1) => days * 8.64e7

let midnight = (offset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    date.setHours(23, 59, 59, 999)
    return date
}

Date.prototype.getWeek = function () {
    let d = this
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)),
        weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    return weekNo
}

Date.prototype.getFormattedDay = function () {
    let d = this
    const weekDays = i18n('dates.weekdays')
    return weekDays[d.getDay()]
}

Date.prototype.getFormattedTime = function () { return this.toLocaleTimeString(locale, { timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit' }) }
Date.prototype.getHoursWithDecimals = function () { return this.getHours() + (this.getMinutes() / 60) }

Date.prototype.isTomorrow = function (offset = 0) { return this > midnight(0 + offset) && this < midnight(1 + offset) }
Date.prototype.isToday = function (offset = 0) { return this > midnight(-1 + offset) && this < midnight(0 + offset) }
Date.prototype.isYesterday = function (offset = 0) { return this > midnight(-2 + offset) && this < midnight(-1 + offset) }

Array.prototype.random = function (seed) {
    let randomValue = Math.random()
    if (seed) {
        let rand = sfc32(seed[0], seed[1], seed[2], seed[3])
        randomValue = rand()
    }
    const arr = this
    const random = arr[Math.floor(randomValue * arr.length)]
    return random
}

Array.prototype.mode = function () {
    const arr = this
    if (arr.length < 1) return undefined
    else return [...arr].sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).at(-1)
}




function createStyle(content, id) {
    let styleElem
    if (!id) {
        styleElem = document.createElement('style')
    } else {
        styleElem = document.querySelector(`style#${id}`) || document.createElement('style')
        styleElem.id = id
    }
    styleElem.textContent = content
    document.head.append(styleElem)
    return styleElem
}

function i18n(key, variables = {}, useDefaultLanguage = false, fallBackToNull = false) {
    if (!(key.length > 0)) return ''

    const keys = key.split('.')
    let value = useDefaultLanguage ? i18nDataNl : i18nData

    for (const k of keys) {
        value = value[k]
        if (!value) value = fallBackToNull ? null : useDefaultLanguage ? key : i18n(key, variables, true)
    }

    if (value) {
        for (const variableName in variables) {
            if (Object.hasOwnProperty.call(variables, variableName)) {
                const variableContent = variables[variableName]
                value = value.replace(new RegExp(`{${variableName}}`, 'g'), variableContent)
            }
        }
    }

    return value || ''
}

function formatOrdinals(number, feminine) {
    if (locale.startsWith('la')) {
        return romanize(number)
    }

    const pr = new Intl.PluralRules(locale, { type: 'ordinal' })

    const suffixes = {
        'nl-NL': new Map([
            ['other', 'e']
        ]),
        'en-GB': new Map([
            ['one', 'st'],
            ['two', 'nd'],
            ['few', 'rd'],
            ['other', 'th'],
        ]),
        'fr-FR': new Map([
            ['zero', 'e'],
            ['one', feminine ? 're' : 'er'],
            ['other', 'e'],
        ]),
        'de-DE': new Map([
            ['other', '.']
        ]),
        'sv-SE': new Map([
            ['one', ':a'],
            ['other', ':e']
        ])
    }

    const rule = pr.select(number)
    const suffix = suffixes[locale]?.get(rule) || suffixes[locale]?.get('other') || '.'
    return `${number}${suffix}`
}

function romanize(num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

// Seeded random numbers.
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
function sfc32(a, b, c, d) {
    return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}