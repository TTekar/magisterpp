let magisterApiCache = {},
    magisterApiUserId,
    magisterApiUserToken,
    magisterApiUserTokenDate,
    magisterApiSchoolName = window.location.hostname.split('.')[0],
    magisterApiPermissions = []

now = new Date()

const gatherStart = new Date()
gatherStart.setDate(now.getDate() - (now.getDay() + 6) % 7)
gatherStart.setHours(0, 0, 0, 0)

const gatherEarlyStart = new Date()
gatherEarlyStart.setDate(now.getDate() - 42)
gatherEarlyStart.setHours(0, 0, 0, 0)

const gatherEnd = new Date()
gatherEnd.setDate(now.getDate() + 42)
gatherEnd.setHours(0, 0, 0, 0)

const MagisterApi = {
    useSampleData: false,
    accountInfo: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.accountInfo ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/account?noCache=0`, null, 'accountInfo'
                )
            resolve(
                (await magisterApiCache.accountInfo)
            )
            magisterApiPermissions = (await magisterApiCache.accountInfo)?.Groep?.[0]?.Privileges?.filter(p => p.AccessType.includes('Read')).map(p => p.Naam)
        })
    },
    years: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.years ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/leerlingen/$USERID/aanmeldingen?begin=2013-01-01&einde=${new Date().getFullYear() + 1}-01-01`, null, 'years'
                )
            resolve(
                (await magisterApiCache.years)?.items || []
            )
        })
    },
    yearInfo: async (year) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache['yearInfo' + year?.id] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/aanmeldingen/${year?.id}`, null, 'yearInfo'
                )
            resolve(
                (await magisterApiCache['yearInfo' + year?.id])
            )
        })
    },
    exams: {
        list: async (year) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['examsList' + year?.id] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/aanmeldingen/${year?.id}/examens`, null, 'examsList'
                    )
                resolve(
                    (await magisterApiCache['examsList' + year?.id])?.items || null
                )
            })
        },
        info: async (year) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['examsInfo' + year?.id] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/aanmeldingen/${year?.id}/examen`, null, 'examsInfo', true
                    )
                resolve(
                    (await magisterApiCache['examsInfo' + year?.id]) || {}
                )
            })
        }
    },
    roosterwijzigingen: async (start = gatherStart, end = gatherEnd) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache['roosterwijzigingen' + start + end] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/roosterwijzigingen?van=${start}&tot=${end}`, null, 'roosterwijzigingen'
                )
            resolve(
                (await magisterApiCache['roosterwijzigingen' + start + end])?.Items || null
            )
        })
    },
    events: async (start = gatherStart, end = gatherEnd, status = 0) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache['events' + start + end] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/afspraken?status=${status}&van=${start}&tot=${end}`, null, 'events'
                )
            resolve(
                (await magisterApiCache['events' + start + end])?.Items || null
            )
        })
    },
    event: async (id) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache[`event${id}`] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/afspraken/${id}`, null, 'event'
                )
            resolve(
                (await magisterApiCache[`event${id}`]) || null
            )
        })
    },
    grades: {
        recent: async (lastN = 20) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache.gradesRecent ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/cijfers/laatste?top=${lastN}&skip=0`, null, 'grades.recent'
                    )
                resolve(
                    (await magisterApiCache.gradesRecent)?.items || []
                )
            })
        },
        forYear: async (year) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['gradesYear' + year?.id] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/aanmeldingen/${year?.id}/cijfers/cijferoverzichtvooraanmelding?actievePerioden=false&alleenBerekendeKolommen=false&alleenPTAKolommen=false&peildatum=${year.einde}`, null, 'grades.forYear'
                    )
                resolve(
                    (await magisterApiCache['gradesYear' + year?.id])?.Items || []
                )
            })
        },
        columnInfo: async (year, columnId) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['gradesYear' + year?.id + 'Col' + columnId] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/aanmeldingen/${year?.id}/cijfers/extracijferkolominfo/${columnId}`, null, 'grades.columnInfo'
                    )
                resolve(
                    (await magisterApiCache['gradesYear' + year?.id + 'Col' + columnId]) || {}
                )
            })
        }
    },
    assignments: {
        top: async (lastN = 20) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache.assignments ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/opdrachten?top=${lastN}&skip=0&startdatum=${gatherEarlyStart.toISOString().substring(0, 10)}&einddatum=${gatherEnd.toISOString().substring(0, 10)}`, null, 'assignments.top'
                    )
                resolve(
                    (await magisterApiCache.assignments)?.Items || []
                )
            })
        },
        forYear: async (year) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['assignmentsYear' + year?.id] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/opdrachten?top=250&startdatum=${year.begin}&einddatum=${year.einde}`, null, 'assignments.forYear'
                    )
                resolve(
                    (await magisterApiCache['assignmentsYear' + year?.id])?.Items || []
                )
            })
        }
    },
    mededelingen: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.mededelingen =
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/mededelingen`, null, "mededelingen"
                )
            resolve(
                (await magisterApiCache.mededelingen)?.mededelingen.items || []
            )
        })
    },
    mededeling: async (id) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache[`mededeling${id}`] =
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/mededelingen/${id}`, null, "mededeling"
                )
            resolve(
                (await magisterApiCache[`mededeling${id}`]) || {}
            )
        })
    },
    studiewijzers: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.studiewijzers ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/leerlingen/$USERID/studiewijzers`, null, "studiewijzers"
                )
            resolve(
                (await magisterApiCache.studiewijzers)?.Items || []
            )
        })
    },
    studiewijzerParts: async (studiewijzerId) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache[`studiewijzerPart${studiewijzerId}`] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/leerlingen/$USERID/studiewijzers/${studiewijzerId}`, null, "studiewijzerPart"
                )
            resolve(
                (await magisterApiCache[`studiewijzerPart${studiewijzerId}`])?.Onderdelen.Items || []
            )
        })
    },
    studiewijzerSources: async (studiewijzerId, onderdeelId) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache[`studiewijzerSources${studiewijzerId}${onderdeelId}`] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/leerlingen/$USERID/studiewijzers/${studiewijzerId}/onderdelen/${onderdeelId}`, null, "studiewijzerSources"
                )
            resolve(
                (await magisterApiCache[`studiewijzerSources${studiewijzerId}${onderdeelId}`])?.Bronnen || []
            )
        })
    },
    messages: async (lastN = 20, skip = 0) => {
        return new Promise(async (resolve, reject) => {
            // `https://${magisterApiSchoolName}.magister.net/api/berichten/postvakin/berichten?top=20&skip=0&gelezenStatus=ongelezen`, null, 'messages'
            magisterApiCache[`messages${lastN}${skip}`] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/berichten/postvakin/berichten?top=${lastN}&skip=${skip}`, null, 'messages'
                )
            resolve(
                (await magisterApiCache[`messages${lastN}${skip}`])?.items || []
            )
        })
    },
    messageContent: async (id) => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache[`message${id}`] ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/berichten/berichten/${id}`, null, "message"
                )
            resolve(
                (await magisterApiCache[`message${id}`]) || []
            )
        })
    },
    activities: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.activities ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/activiteiten?status=NogNietAanEisVoldaan`, null, 'activities'
                )
            resolve(
                (await magisterApiCache.activities)?.Items || []
            )
        })
    },
    logs: async () => {
        return new Promise(async (resolve, reject) => {
            magisterApiCache.logs ??=
                fetchWrapper(
                    `https://${magisterApiSchoolName}.magister.net/api/leerlingen/$USERID/logboeken/count`, null, 'logs'
                )
            resolve(
                Array((await magisterApiCache.logs).count || 0) || []
            )
        })
    },
    absences: {
        forYear: async (year) => {
            return new Promise(async (resolve, reject) => {
                magisterApiCache['absencesYear' + year?.id] ??=
                    fetchWrapper(
                        `https://${magisterApiSchoolName}.magister.net/api/personen/$USERID/absenties?van=${year.begin}&tot=${year.einde}`, null, 'absences'
                    )
                resolve(
                    (await magisterApiCache['absencesYear' + year?.id])?.Items || []
                )
            })
        }
    },
}

/**
 * Wrapper for fetch().json()
 * @param {number} url
 * @param {Object} options
 * @returns {Promise<Object>}
 */
async function fetchWrapper(url, options, identifier = 'unknown', quiet = false) {
    const calledAt = new Date()

    const promiseReq = new Promise(async (resolve, reject) => {
        if (!magisterApiUserId || !magisterApiUserToken) {
            await updateApiCredentials(identifier)
                .catch(err => console.error(err))
        }

        const res1 = await fetch(url.replace(/(\$USERID)/gi, magisterApiUserId), {
            headers: {
                Authorization: magisterApiUserToken,
                'X-Request-Source': 'study-tools'
            }, ...options
        })

        // Resolve if no errors
        if (res1.ok) {
            const json = await res1.json()
            if (verbose) console.info(`APIRQ OK after ${new Date() - calledAt} ms (@ ${identifier})`)
            return resolve(json)
        }

        if (verbose) console.info(`APIRQ ERR: ${res1.status}. Retrying... (@ ${identifier})`)

        // Reject when forbidden (e.g. feature disabled by school)
        if (res1.status === 403) {
            return resolve({})
        }

        // Reject when ratelimit is hit
        if (res1.status === 429 && !quiet) {
            notify('snackbar', `Verzoeksquotum overschreden\nWacht even, vernieuw de pagina en probeer het opnieuw`)
            return resolve({})
        }

        // If it's not a ratelimit, retry one more time. Also forcibly refresh from memory.
        await updateApiCredentials(identifier)
            .catch(err => console.error(err))

        // Retry with a second request
        const res2 = await fetch(url.replace(/(\$USERID)/gi, magisterApiUserId), {
            headers: {
                Authorization: magisterApiUserToken,
                'X-Request-Source': 'study-tools'
            }, ...options
        })

        // Resolve if no errors
        if (res2.ok) {
            const json = await res2.json()
            if (verbose) console.info(`APIRQ OK after ${new Date() - calledAt} ms: Succeeded on second try. (@ ${identifier})`)
            return resolve(json)
        }

        if (verbose) console.info(`APIRQ ERR: ${res1.status}. Resolving empty. (@ ${identifier})`)

        // Reject when forbidden (e.g. feature disabled by school)
        if (res2.status === 403) {
            return resolve({})
        }

        // Reject when ratelimit is hit
        if (res2.status === 429 && !quiet) {
            notify('snackbar', `Verzoeksquotum overschreden\nWacht even, vernieuw de pagina en probeer het opnieuw`)
            return resolve({})
        }

        // Handle other errors
        if (!quiet) {
            notify(
                'snackbar',
                `Fout ${res2.status}. Vernieuw de pagina.`,
                [
                    { innerText: "Hulp", expandToDialog: "Probeer eerst wat achtergrondprogramma's te sluiten en de pagina te vernieuwen." }
                ],
                120000
            )
        }
        console.error(`APIRQ: ${res2.status}\n\nurl: ${url}\nuserId: ${magisterApiUserId}\nuserToken.length: ${magisterApiUserToken?.length} (@ ${identifier})`)
        return resolve({})
    })

    return Promise.race([
        promiseReq,
        new Promise((resolve, reject) => {
            // Reject after 10 seconds
            setTimeout(() => reject(new Error("Request timed out.")), 10000)
        })
    ])
        .catch(err => {
            if (!quiet) {
                notify(
                    'snackbar',
                    `Er is iets misgegaan. Vernieuw de pagina.`,
                    [
                        { innerText: "Hulp", expandToDialog: "Probeer eerst wat achtergrondprogramma's te sluiten en de pagina te vernieuwen." }
                    ],
                    120000
                )
            }
            console.error(`APIRQ: ${err}\n\nurl: ${url}\nuserId: ${magisterApiUserId}\nuserToken.length: ${magisterApiUserToken?.length} (@ ${identifier})`)
            return ({})
        })
}

/**
 * Retrieve the latest credentials information from memory.
 * @returns {Promise<Object>} Object containing userId and token
 */
async function updateApiCredentials(identifier = 'unknown') {
    let isCancelled = false

    now = new Date()
    const calledAt = new Date()

    const timeInit = new Date()

    const promiseMemory = new Promise(getApiCredentialsMemory)

    return Promise.race([
        promiseMemory,
        new Promise((resolve, reject) => {
            // Reject after 4 seconds
            setTimeout(() => {
                isCancelled = true
                reject(new Error("Timed out"))
            }, 4000)
        })
    ])
        .catch(err => {
            console.error(`CREDS ERR: ${err} (@ ${identifier})`)
        })

    async function getApiCredentialsMemory(resolve, reject) {
        let storageLocation = chrome.storage.session?.get ? 'session' : 'local'
        now = new Date()

        if (!(magisterApiUserId?.length > 1)) {
            magisterApiUserId = await getFromStorage('user-id', 'sync')
        }

        magisterApiUserToken = await getFromStorage('token', storageLocation) || magisterApiUserToken
        magisterApiUserTokenDate = await getFromStorage('token-date', storageLocation) || magisterApiUserTokenDate

        if (magisterApiUserId && magisterApiUserToken && magisterApiUserTokenDate && new Date(magisterApiUserTokenDate)) {
            if (Math.abs(now - new Date(magisterApiUserTokenDate)) < 60000) {
                resolve({ userId: magisterApiUserId, token: magisterApiUserToken })
                if (verbose) console.info(`CREDS OK after ${now - calledAt} ms (@ ${identifier})\nuserId: ${magisterApiUserId}\nuserToken.length: ${magisterApiUserToken?.length}\nuserTokenDate: ${new Date(magisterApiUserTokenDate).toTimeString().split(' ')[0]} (${Math.abs(now - new Date(magisterApiUserTokenDate))} ms ago)`)
            } else {
                if (new Date() - timeInit < 3000) {
                    if (verbose) console.info(`CREDS WARN after ${now - calledAt} ms: Data too old! (@ ${identifier})\nuserId: ${magisterApiUserId}\nuserToken.length: ${magisterApiUserToken?.length}\nuserTokenDate: ${new Date(magisterApiUserTokenDate).toTimeString().split(' ')[0]} (${Math.abs(now - new Date(magisterApiUserTokenDate))} ms ago)`)
                    resolve({ userId: magisterApiUserId, token: magisterApiUserToken })
                } else {
                    if (isCancelled) return reject(new Error("Timed out"))
                    if (verbose) console.info(`CREDS WARN: Data too old! Retrying... (@ ${identifier})`)
                    setTimeout(() => getApiCredentialsMemory(resolve, reject), 200)
                }
            }
        } else {
            if (isCancelled) return reject(new Error("Timed out"))
            if (verbose) console.info(`CREDS INFO: Data incomplete! Retrying... (@ ${identifier})\nuserId: ${magisterApiUserId}\nuserToken.length: ${magisterApiUserToken?.length}\nuserTokenDate: ${new Date(magisterApiUserTokenDate).toTimeString().split(' ')[0]} (${Math.abs(now - new Date(magisterApiUserTokenDate))} ms ago)`)
            setTimeout(() => getApiCredentialsMemory(resolve, reject), 200)
        }
    }
}


window.MagisterApi = MagisterApi;