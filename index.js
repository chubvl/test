var question_id = [];
var question_text = [];
var events = [];
var events_id = [];

var isAuth = false;

var start_filling = true;
let scrollPosition = 0;
var number_question = 0;

let numberId = 0;
let difference = 0;



function addQuestion(dataJson) {
    number_question += 1;
    id = dataJson.firstQuestion.id;
    text = dataJson.firstQuestion.text;
    question_id.push(id);
    question_text.push(text);
    var main = document.getElementById("question_now");
    var str_question = question_block(dataJson.firstQuestion.hint, dataJson.firstQuestion.text)
    var str_varints = '';

    if (dataJson.isLast) {
        str_varints = events_block_last(dataJson.firstQuestion);
    } else {
        str_varints = events_block(dataJson.firstQuestion);
    }

    str_question += str_varints;
    main.innerHTML += str_question;
}

function addQuestionNext(dataJson) {
    number_question += 1;
    id = dataJson.id;
    text = dataJson.text;
    question_id.push(id);
    question_text.push(text);
    var main = document.getElementById("question_now");
    var str_question = question_block(dataJson.hint, dataJson.text);
    var str_varints = '';

    str_varints = events_block(dataJson);
    str_question += str_varints;
    main.innerHTML += str_question;
}

function addHistory(dataJson) {
    let lenght = dataJson.length;

    if (lenght >= 2) {
        let container_history = document.querySelector(".col-container_history");
        let content_previous_question = document.querySelector(".previous_question_img");
        let content_plug = document.querySelector(".previous_question_plug");
        container_history.classList.toggle("hidden");
        content_previous_question.classList.toggle("hidden");
        content_plug.classList.toggle("hidden");
        start_filling = false;
    }

    for (let i in dataJson) {
        number_question += 1;
        id = dataJson[i].id;
        text = dataJson[i].text;
        question_id.push(id);
        question_text.push(text);
        var main = document.getElementById("question_now");
        if (number_question != lenght) {
            var str_question = question_blockHistory(dataJson[i].hint, dataJson[i].text);
        } else {
            var str_question = question_blockHistoryLast(dataJson[i].hint, dataJson[i].text);
        }

        var str_varints = '';

        str_varints = events_blockHistory(dataJson[i], lenght);

        str_question += str_varints;
        main.innerHTML += str_question;
    }
    change_previous_question()

}

function question_block(hint, text) {
    var str = ''
    if (hint == '') {
        str = `
            <div class="block_question" id="${number_question}">
                <div class="question_img">
                    <div class="missing"></div>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    } else {
        str = `
            <div class="block_question" id="${number_question}">
                <div class="question_img">
                    <div class="missing"></div>
                    <span class="clue"
                        data-clue="${hint}"><img 
                            src="images/question-circle-svgrepo-com 1.svg" alt=""></span>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    }
    return str
}

function events_block(dataJson) {
    var str = '<div class="answers">';

    for (var event in dataJson.variants) {
        str += `<button class="btn" onclick="question_next(event);" id="${dataJson.variants[event].id}">${dataJson.variants[event].text}</button>`;
    }
    str += '</div></div>';

    return str;
}

function addHistoryAnswers(dataJson) {
    for (let i in dataJson) {
        events_id.push('0');
        question_id.push('0');
        add_container_questionHistory(dataJson[i].text, dataJson[i].selectedVariantName);
        scrol_container_question();
    }
}

function question_blockHistory(hint, text) {
    var str = ''
    if (hint == '') {
        str = `
            <div class="block_question" id="${number_question}" style="display: none;">
                <div class="question_img">
                    <div class="missing"></div>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    } else {
        str = `
            <div class="block_question" id="${number_question}" style="display: none;">
                <div class="question_img">
                    <div class="missing"></div>
                    <span class="clue"
                        data-clue="${hint}"><img 
                            src="images/question-circle-svgrepo-com 1.svg" alt=""></span>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    }
    return str
}

function question_blockHistoryLast(hint, text) {
    var str = ''
    if (hint == '') {
        str = `
            <div class="block_question" id="${number_question}" style="display: block;">
                <div class="question_img">
                    <div class="missing"></div>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    } else {
        str = `
            <div class="block_question" id="${number_question}" style="display: block;">
                <div class="question_img">
                    <div class="missing"></div>
                    <span class="clue"
                        data-clue="${hint}"><img 
                            src="images/question-circle-svgrepo-com 1.svg" alt=""></span>
                </div>
                <div class="question">
                    <p>${text}</p>
                </div>`
    }
    return str
}

function events_blockHistory(dataJson, lenght) {
    var str = '<div class="answers">';

    for (var event in dataJson.variants) {
        if (dataJson.selectedVariant == dataJson.variants[event].id) {
            str += `<button class="btn_active" onclick="question_next(event);" id="${dataJson.variants[event].id}">${dataJson.variants[event].text}</button>`;
            events_id.push(dataJson.variants[event].id);
            if (lenght != number_question) {
                add_container_questionHistory(dataJson.text, dataJson.variants[event].text);
            }
        } else {
            str += `<button class="btn" onclick="question_next(event);" id="${dataJson.variants[event].id}">${dataJson.variants[event].text}</button>`;
        }
    }
    str += '</div></div>';

    return str;
}

function add_container_questionHistory(Question, Answer) {

    var container_scrol = document.getElementById("col-container_scrol");
    if (events_id.length == 1) {
        var str = `<div class="box_col" onclick="previous_question('${number_question}', false);"><div class="box_col_p" align="center">${Question}</div><hr><div class="box_col_vower" align="center">${Answer}</div></div>`;
    } else {
        var str = `<img src="images/right-arrow-next-svgrepo-com 1.svg" alt=""><div class="box_col" onclick="previous_question('${number_question}', false);"><div class="box_col_p" align="center">${Question}</div><hr><div class="box_col_vower" align="center">${Answer}</div></div>`;
    }
    container_scrol.innerHTML += str;
    scrol_container_question();

}

function question_next(evt) {
    let last_que = question_id[question_id.length - 1];
    let event_id = evt.target.id;
    let event_text = evt.target.innerText;
    let que_text = question_text[question_id.length - 1];
    active_event(event_id)
    NextQuestion(number_question, last_que, event_id, event_text, que_text);
}

function active_event(id) {
    if (events_id.length == 0) {
        events_id.push(id);
        document.getElementById(id).classList.add('btn_active');
        document.getElementById(id).classList.remove('btn');
    } else if (id != events_id[events_id.length - 1] && events_id.length == question_id.length) {
        prev_id = events_id[events_id.length - 1];
        events_id[events_id.length - 1] = id;

        document.getElementById(prev_id).classList.add('btn');
        document.getElementById(prev_id).classList.remove('btn_active');

        document.getElementById(id).classList.add('btn_active');
        document.getElementById(id).classList.remove('btn');

    } else if (events_id.length != question_id.length) {
        events_id.push(id);
        document.getElementById(id).classList.add('btn_active');
        document.getElementById(id).classList.remove('btn');
    }
}

function previous_question(Next_qID, Question, Answer, AddRem) {
    numberId = Number(Next_qID);
    difference = number_question - numberId;
    if (localStorage.getItem('testCompleted') !== 'true') {
        if (difference > 1) {
            openPopup();        
        } else {
            open_question_next(Next_qID, Question, Answer, AddRem);
            change_previous_question();
            ReturnBack(numberId);
        }
    }
}

function goToQuestion() {
    closePopup();
    while (difference !== 0) {
        let currentId = difference + numberId - 1;
        open_question_next(currentId, '', '', false);
        change_previous_question();
        difference -= 1;
    }
    ReturnBack(numberId);
}

function question_again() {
    ReloadAanswers()
}

function open_question_next(Next_qID, Question, Answer, AddRem) {
    if (question_id.length != 1) {
        previous_question_id = question_id.slice(-1);
    }
    if (question_id.length <= 2) {
        start_filling = true;
    }
    if (AddRem == true) {
        add_container_question(Question, Answer);
        //add_previous_question(previous_question_id);
    } else if (question_id.length <= 2) {
        put_away_container_question();
        put_away_question();
        if (events_id.length == question_id.length) {
            events_id.pop();
        }
        question_id.pop();
        question_text.pop();
    } else {
        put_away_container_question();
        put_away_container_question();
        put_away_question();
        if (events_id.length == question_id.length) {
            events_id.pop();
        }
        question_id.pop();
        question_text.pop();
    }

    if (number_question == 1) {
        localStorage.setItem('answeredQuestion', false);
    }

    if (question_id.length == 1 || start_filling) {
        var content_plug = document.querySelector(".previous_question_plug");
        var content_previous_question = document.querySelector(".previous_question_img");
        var container_history = document.querySelector(".col-container_history");
        console.log(content_plug.classList);
        content_plug.classList.toggle("hidden");
        console.log(content_previous_question.classList);
        content_previous_question.classList.toggle("hidden");
        start_filling = false;
        console.log(container_history.classList);
        container_history.classList.toggle("hidden");
    }

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("block_question");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("answers");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(Next_qID).style.display = "block";

}

function change_previous_question() {
    var currentNode = document.querySelector('#id_0');
    if (question_id.length == 1) {
        currentNode.outerHTML =
            `<div class="previous_question_img hidden" id="id_0">
                <img src="images/previous.svg" alt="" onclick="previous_question('${question_id.length - 1}', false);">
            </div>`;
    } else {
        currentNode.outerHTML =
            `<div class="previous_question_img" id="id_0">
                <img src="images/previous.svg" alt="" onclick="previous_question('${question_id.length - 1}', false);">
            </div>`;
    }

}

function add_container_question(Question, Answer) {

    var container_scrol = document.getElementById("col-container_scrol");
    if (question_id.length == 2) {
        var str = `<div class="box_col" onclick="previous_question('${number_question - 1}', false);"><div class="box_col_p" align="center">${Question}</div><hr><div class="box_col_vower" align="center">${Answer}</div></div>`;
    } else {
        var str = `<img src="images/right-arrow-next-svgrepo-com 1.svg" alt=""><div class="box_col" onclick="previous_question('${number_question - 1}', false);"><div class="box_col_p" align="center">${Question}</div><hr><div class="box_col_vower" align="center">${Answer}</div></div>`;
    }
    container_scrol.innerHTML += str;
    scrol_container_question();

}

function put_away_container_question() {
    const parentBlock = document.querySelector('.col-container_scrol');
    const lastChild = parentBlock.lastElementChild;
    if (lastChild) {
        parentBlock.removeChild(lastChild);
    }
}

function put_away_question() {
    number_question -= 1;
    const parentBlockQuestion = document.querySelector('#question_now');
    const lastChildQuestion = parentBlockQuestion.lastElementChild;
    if (lastChildQuestion) {
        parentBlockQuestion.removeChild(lastChildQuestion);
    }
}

function scrol_container_question() {

    var container = document.querySelector('.col-container_scrol');
    scrollPosition += 800;
    container.scrollTo(scrollPosition, 800);

}

function add_previous_question(id) {
    var divElement = document.getElementsByClassName('previous_question_img');
    divElement.Name_id = id;
}

function change_color(Name_id) {

    if (Name_id == 'name_id') {
        document.getElementById('reg').style = 'background: #B5EDF8;';
        document.getElementById('buh').style = 'background: #48BB78;';
    }

}

function opening_exit_forms(objName) {


    document.getElementById("authorizationPrompt").style.display = "none";

    if (objName.id == 'back_call') {
        var content = document.querySelector(".profile_user");
        if ($(content).css('display') != 'none') {
            $(content).animate({ height: 'hide' }, 600);
        }
    }

    if (objName.id == 'profile_user') {
        var content = document.querySelector(".back_call");
        if ($(content).css('display') != 'none') {
            $(content).animate({ height: 'hide' }, 400);
        }
    }

    if ($(objName).css('display') == 'none') {
        $(objName).animate({ height: 'show' }, 800);
    } else {
        $(objName).animate({ height: 'hide' }, 600);
    }

    setTimeout(form_blockClose, 1000);
}

function form_blockClose() {
    if (document.getElementById('form_block').style.display == "none") {
        document.getElementById('form_block').style.display = "block";
        let parent = document.getElementById("back_call");
        let child = document.getElementById("back_call_answer");
        parent.removeChild(child);
    }
}

function closeAuthorizationPrompt(objName) {
    if ($(objName).css('display') == 'none') {
        $(objName).animate({ height: 'show' }, 800);
    } else {
        $(objName).animate({ height: 'hide' }, 600);
    }
}

function add_products(dataJson) {
    var product = document.getElementById("product_list");

    for (var num in dataJson) {
        product.innerHTML += `<div class="product">
                                    <p>${dataJson[num].name}</p>
                                    <div class="product_content">
                                        <div class="product_info">${dataJson[num].description}</div>
                                        <div class="product_img"><img src="${dataJson[num].photo}"></div>
                                    </div>
                                    <a href="${dataJson[num].shopRef}" target="_blank"><button>Перейти на сайт</button></a>
                                </div>`;
    }
}

function close_block() {
    var main = document.querySelector(".main");
    var content_previous_question = document.querySelector(".previous_question_img");
    var selected_product = document.querySelector(".selected_product_main");
    console.log(main.classList);
    main.classList.toggle("hidden");
    console.log(selected_product.classList);
    selected_product.classList.toggle("hidden");
    console.log(content_previous_question.classList);
    content_previous_question.classList.toggle("hidden");
}

function close_block_again() {
    var main = document.querySelector(".main");
    var content_previous_question = document.querySelector(".previous_question_plug");
    var selected_product = document.querySelector(".selected_product_main");
    var container_history = document.querySelector(".col-container_history");
    console.log(main.classList);
    main.classList.toggle("hidden");
    console.log(selected_product.classList);
    selected_product.classList.toggle("hidden");
    console.log(content_previous_question.classList);
    content_previous_question.classList.toggle("hidden");
    console.log(container_history.classList);
    container_history.classList.toggle("hidden");
}

function clear_questions() {
    close_block_again();

    for (let i = question_id.length - 1; i >= 0; i -= 1) {
        if (question_id.length == 1) {
            put_away_container_question();
            question_id.pop();
            question_text.pop();
        } else {
            put_away_container_question();
            put_away_container_question();
            question_id.pop();
            question_text.pop();
        }
    }

    const question_now = document.getElementById('question_now');
    question_now.innerHTML = '';

    const product_list = document.getElementById('product_list');
    product_list.innerHTML = '';

    events_id = [];
    start_filling = true;
    scrollPosition = 0;
    number_question = 0;
}

function close_block_exit() {
    var content_previous_question = document.querySelector(".previous_question_plug");
    var container_history = document.querySelector(".col-container_history");
    console.log(content_previous_question.classList);
    content_previous_question.classList.toggle("hidden");
    console.log(container_history.classList);
    container_history.classList.toggle("hidden");
}


function clear_questionsExitProfile() {

    for (let i = question_id.length - 1; i >= 0; i -= 1) {
        if (question_id.length == 1) {
            put_away_container_question();
            question_id.pop();
            question_text.pop();
            events_id.pop()
        } else {
            put_away_container_question();
            put_away_container_question();
            question_id.pop();
            question_text.pop();
            events_id.pop();
        }
    }

    const question_now = document.getElementById('question_now');
    question_now.innerHTML = '';

    const product_list = document.getElementById('product_list');
    product_list.innerHTML = '';

    events_id = [];
    start_filling = true;
    scrollPosition = 0;
    number_question = 0;
}

function call_request() {
    let back_call_name = document.getElementById("back_call_name").value;
    let back_call_phone = document.getElementById("back_call_phone").value;
    let back_call_comment = document.getElementById("back_call_comment").value;
    if (back_call_name == "" || back_call_phone == "" || back_call_phone.length < 11) {

    } else {
        CallRequest(back_call_name, back_call_phone, back_call_comment);
    }

}

function application_sent() {
    document.getElementById('form_block').style.display = "none";

    let div = document.createElement('div');
    div.className = 'back_call_box';
    div.id = 'back_call_answer';

    let back_call_block = document.createElement('div');
    back_call_block.className = 'back_call_block';
    back_call_block.innerHTML = 'Ваша заявка была отправлена!';

    let back_call_block_ = document.createElement('div');
    back_call_block_.className = 'back_call_block_';
    back_call_block_.innerHTML = 'В ближайшее время с Вами свяжется менеджер.';

    div.append(back_call_block);
    div.append(back_call_block_);
    let back_call = document.getElementById("back_call");
    back_call.append(div);

}

function authorizationPassed(fullName) {
    let form = document.getElementById("profile_user");
    let div = document.createElement('div');
    div.className = 'profile_user_box';
    div.id = 'userAuthorized'
    div.innerHTML = `<div class="profile_user_greetings">Здравствуйте, ${fullName}!</div>
                     <button onclick="exit_profile()">Выйти</button>`;
    form.append(div);
    document.getElementById('userNoAuthorized').style.display = "none";
}

function exit_profile() {
    localStorage.clear();
    window.location.href = "index.html";
}

function orderRequest() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let comment = document.getElementById("comment").value;
    OrderRequest(name, phone, comment, email);
}
