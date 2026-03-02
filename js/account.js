
var update100msAccount = window.setInterval(function(){

    chrome.storage.sync.get(
        { autoLogin: false , username: "" , password: "" , inlogText: "Bonjour" , customHtml: false },
        (items) => {

            //~ Custom text
            if (!document.getElementById("customLoginText")) {
                const form = document.getElementsByClassName("podium")
                const h1 = document.createElement("h1")

                h1.id = "customLoginText"
                if (items.customHtml) h1.innerHTML = items.inlogText
                else h1.textContent = items.inlogText

                form[0].prepend(h1)
            }


            //~ Auto login
            if (items.autoLogin && items.username !== "" && items.password !== "" && ( !document.querySelector('[id^="sl-form-field-error"]') || document.querySelector('[id^="sl-form-field-error"]').textContent.includes("is niet ingevuld."))) {
                
                const usernameField = document.getElementById("username")

                if (usernameField) {
                    usernameField.value = items.username
                    usernameField.dispatchEvent(new Event('input', { bubbles: true }))
                    document.getElementById("username_submit").click()
                }
                    
                const passwordField = document.getElementById("password")
                
                if (passwordField) {
                    passwordField.value = items.password
                    passwordField.dispatchEvent(new Event('input', { bubbles: true }))
                    document.getElementById("password_submit").click()
                    
                }

            }
        }
    );
}, 100);