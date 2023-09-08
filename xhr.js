const firstrequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/SetNewVisit/"
const nextrequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/NextQuestion/"
const reloadrequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/ReloadAnswers/"
const callRequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/CallRequest/"
const AuthSmsPostRequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/AuthSmsPost/"
const AuthorizationRequstURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/Authorization/"
const OrderRequestURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/OrderRequest/"
const GetHistoryRequestURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/GetHistory/"
const GetAuthorizedVisitRequestURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/GetAuthorizedVisit/"
const GetHistoryAndProductsRequestURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/GetHistoryAndProducts/"
const ReturnBackRequestURL = "https://rarus-dfis.corp.rarus-cloud.ru/quize_1c_products/hs/api/ReturnBack/"


if (localStorage.getItem('GUID') !== null) {
    var GUID = localStorage.getItem('GUID');
} else {
    var GUID = 'none';
}

if (localStorage.getItem('answeredQuestion') == null) {
    localStorage.setItem('answeredQuestion', false)
}

if (localStorage.getItem('testCompleted') == null) {
    localStorage.setItem('testCompleted', false)
}

if (localStorage.getItem('isAuth') == null) {
    localStorage.setItem('isAuth', false)
}

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

function NextQuestion(queNum, queId, answerId, event_text, que_text) {

    body = {
        questionNumber: queNum,
        questionId: queId,
        answerId: answerId
    }

    CheckConnection('POST', nextrequstURL, GUID, body)
        .then(function (response) {
            if (response.isFinal) {
                localStorage.setItem('testCompleted', true)
                close_block()
                add_container_question(que_text, event_text)
                add_products(response.data)
                stopClickOnHistory()
            } else {
                addQuestionNext(response.data)
                open_question_next((queNum + 1), que_text, event_text, true)
                change_previous_question()
            }
            localStorage.setItem('answeredQuestion', true)
            //if (response.)

        })
        .catch(err => console.log(err));
}

function ReloadAanswers() {
    CheckConnection('POST', reloadrequstURL, GUID)
        .then(function (response) {
            localStorage.setItem('answeredQuestion', false)
            localStorage.setItem('testCompleted', false)
            openClickOnHistory()
            clear_questions()
            addQuestionNext(response)
        })
        .catch(err => console.log(err));
}

function CallRequest(name, phone, comment) {

    body = {
        clientName: name,
        phone: phone,
        comment: comment
    }

    CheckConnection('POST', callRequstURL, GUID, body)
        .then(function (response) {
            application_sent()
            console.log(response.Status)
        })
        .catch(err => console.log(err));
}

function OrderRequest(name, phone, comment, email) {
    body = {
        clientName: name,
        phone: phone,
        comment: comment,
        email: email
    }

    CheckConnection('POST', OrderRequestURL, GUID, body)
        .then(function (response) {
            console.log(response.Status)
        })
        .catch(err => console.log(err));
}

function SetNewVisit() {
    CheckConnection('POST', firstrequstURL, GUID)
        .then(function (response) {
            GUID = response.clientId
            localStorage.setItem('GUID', GUID);
            addQuestion(response)
        })
        .catch(err => console.log(err));
}

function GetHistory() {
    CheckConnection('GET', GetHistoryRequestURL, GUID)
        .then(function (response) {
            localStorage.setItem('fullName', response.userData.FIO);
            localStorage.setItem('email', response.userData.email);
            localStorage.setItem('phone', response.userData.phone);
            localStorage.setItem('answeredQuestion', true);
            authorizationPassed(localStorage.getItem('fullName'))
            addHistory(response.history)
            fillInput()
        })
        .catch(err => console.log(err));
}

function GetAuthorizedVisit() {
    CheckConnection('GET', GetAuthorizedVisitRequestURL, GUID)
        .then(function (response) {
            localStorage.setItem('fullName', response.userData.FIO);
            localStorage.setItem('email', response.userData.email);
            localStorage.setItem('phone', response.userData.phone);
            localStorage.setItem('answeredQuestion', false);
            authorizationPassed(localStorage.getItem('fullName'))
            addQuestion(response)
            fillInput()
        })
        .catch(err => console.log(err));
}

function GetHistoryAndProducts() {
    CheckConnection('GET', GetHistoryAndProductsRequestURL, GUID)
        .then(function (response) {
            localStorage.setItem('fullName', response.userData.FIO);
            localStorage.setItem('email', response.userData.email);
            localStorage.setItem('phone', response.userData.phone);
            authorizationPassed(localStorage.getItem('fullName'))
            addHistoryAnswers(response.history)
            add_products(response.products)
            stopClickOnHistory()
            closeBlockMain()
            fillInput()
        })
        .catch(err => console.log(err));
}

function ReturnBack(number) {
    body = {
        questionNumber: number
    }
    CheckConnection('POST', ReturnBackRequestURL, GUID, body)
        .then(function (response) {

        })
        .catch(err => console.log(err));
}

function stopClickOnHistory() {
    let elements = document.querySelectorAll(".box_col");
    elements.forEach(e => {
        e.style.cursor = 'default';
    });
}

function openClickOnHistory() {
    let box_col = document.querySelector(".box_col");
    if (box_col !== null) {
        box_col.style.cursor = 'pointer';
    }
}

function closeBlockMain() {
    var main = document.querySelector(".main");
    var selected_product = document.querySelector(".selected_product_main");
    let container_history = document.querySelector(".col-container_history");
    let previous_question = document.querySelector(".previous_question_plug");
    main.classList.toggle("hidden");
    selected_product.classList.toggle("hidden");
    container_history.classList.toggle("hidden");
    previous_question.classList.toggle("hidden");
}

function fillInput() {
    if (localStorage.getItem('isAuth') == 'true') {
        document.getElementById("name").setAttribute("value", localStorage.getItem('fullName'))
        document.getElementById("phone").setAttribute("value", localStorage.getItem('phone'))
        document.getElementById("email").setAttribute("value", localStorage.getItem('email'))
        document.getElementById("back_call_name").setAttribute("value", localStorage.getItem('fullName'))
        document.getElementById("back_call_phone").setAttribute("value", localStorage.getItem('phone'))
    }
}

if (localStorage.getItem('isAuth') == 'true') {
    //пользователь тогда ответил на один вопрос
    if (localStorage.getItem('answeredQuestion') == 'true') {
        //пользователь прошел тест
        if (localStorage.getItem('testCompleted') == 'true') {
            GetHistoryAndProducts()
        } else {
            GetHistory()
        }
        //пользователь не отвечал на вопросы
    } else {
        GetAuthorizedVisit()
    }
} else {
    SetNewVisit()
    closeAuthorizationPrompt(authorizationPrompt)
    localStorage.setItem('answeredQuestion', false)
    localStorage.setItem('testCompleted', false)
}

