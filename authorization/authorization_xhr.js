const AuthSmsPostRequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/AuthSmsPost/"
const AuthorizationRequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/Authorization/"


let GUID = localStorage.getItem('GUID');
var body = {}

function CheckConnection(method, url, quid, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        url += quid
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }

        xhr.onerror = () => {
            reject(xhr.response)
        }
        if (body == null) {
            xhr.send()
        } else {
            xhr.send(JSON.stringify(body))
        }

    })

}

function AuthSmsPost(phone) {
    body = {
        phone: phone
    }
    CheckConnection('POST', AuthSmsPostRequstURL, GUID, body)
        .then(function (response) {
            addAuthorizationAfterSms(phone, response.firstAuth)
        })
        .catch(err => console.log(err));
}

function Authorization(firstAuth, phone, FIO = null, code, email = null) {
    if (localStorage.getItem('answeredQuestion') == 'true') {
        wasAnswers = true;
    } else {
        wasAnswers = false;
    }
    
    body = {
        firstAuth: firstAuth,
        phone: phone,
        FIO: FIO,
        code: code,
        email: email,
        wasAnswers: wasAnswers
    }
    CheckConnection('POST', AuthorizationRequstURL, GUID, body)
        .then(function (response) {
            if (response.id == null) {
                errorCode()
            } else {
                if (response.hasHistory == true) {
                    localStorage.setItem('answeredQuestion', true)
                } else {
                    localStorage.setItem('answeredQuestion', false)
                }
                if (response.testCompleted !== null) {
                    localStorage.setItem('testCompleted', true)
                }

                if (firstAuth) {
                    GUID = response.id;
                    localStorage.setItem('fullName', FIO);               
                } else {
                    GUID = response.id;
                    fullName = response.FIO;
                    localStorage.setItem('fullName', fullName);
                }
                localStorage.setItem('GUID', GUID);
                localStorage.setItem('isAuth', true);
                localStorage.setItem('firstAuth', firstAuth)
                authorizationEnd();
            }
        })
        .catch();
}