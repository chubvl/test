const form_back_call = document.forms["formback_call"];
const formArr = Array.from(form_back_call);
const validFormArr = [];
const button_back_call = form_back_call.elements["button"];


const formback = document.forms["formback"];
const formbackArr = Array.from(formback);
const validFormbackmArr = [];
const buttonFormback = formback.elements["button"];

form_back_call.addEventListener("input", inputHandler);
button_back_call.addEventListener("click", buttonHandler);

formback.addEventListener("input", inputHandlerFormback);
buttonFormback.addEventListener("click", buttonHandlerFormback);

function inputHandler({ target }) {
    if (target.hasAttribute("data-reg")) {
        inputCheck(target);
    }
}

function inputHandlerFormback({ target }) {
    if (target.hasAttribute("data-reg")) {
        inputCheckFormback(target);
    }
}

function inputCheck(el) {
    const inputValue = el.value;
    const inputReg = el.getAttribute("data-reg");
    const reg = new RegExp(inputReg);
    if (reg.test(inputValue)) {
        el.setAttribute("is-valid", "1");
        el.style.border = "0";
    } else {
        el.setAttribute("is-valid", "0");
    }
}

function inputCheckFormback(el) {
    const inputValueFormback = el.value;
    const inputRegFormback = el.getAttribute("data-reg");
    const regFormback = new RegExp(inputRegFormback);
    if (regFormback.test(inputValueFormback)) {
        el.setAttribute("is-valid", "1");
        el.style.border = "1px solid #ABABAB";
    } else {
        el.setAttribute("is-valid", "0");
    }
}

function buttonHandlerFormback(e) {
    formbackArr.forEach((el) => {
        if (el.hasAttribute("data-reg")) {
            el.setAttribute("is-valid", "0");
            validFormbackmArr.push(el);
            inputCheckFormback(el);
        }
    });

    const allValid = [];
    let number = 0;
    validFormbackmArr.forEach((el) => {
        allValid.push(el.getAttribute("is-valid"));
        if (el.getAttribute("is-valid") == 0) {
            el.style.border = "2px solid #ff6f6b";
            add_errorFormback(el);
            number += 1;
        } else {
            delite_error(el);
        }
    });

    let chbox = formback.elements["checkbox"];
    if (!chbox.checked) {
        add_error_checkbox();
        number += 1;
    } else {
        delite_error_checkbox();
    }

    if (number == 0) {
        orderRequest();
    } else {
        add_error(allValid);
        call_request();
    }
}

function add_errorFormback(elem) {
    
    let div = document.createElement('div');
    if ((elem.name == "name") && (document.getElementById("name_error") == null)){
        let form = document.getElementById("input_block_name");
        div.className = 'input_error';
        div.id = 'name_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
        } else {
            div.innerHTML = 'Это поле может содержать только буквы!';
        }
        form.append(div);
    } else if ((elem.name == "email") && (document.getElementById("email_error") == null)){
        let form = document.getElementById("input_block_email");
        div.className = 'input_error_two';
        div.id = 'email_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
        } else {
            div.innerHTML = 'Неправильно указан email адрес!';
        }
        form.append(div);
    } else if ((elem.name == "phone") && (document.getElementById("phone_error") == null)){
        let form = document.getElementById("input_block_phone");
        div.className = 'input_error_two';
        div.id = 'phone_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
        } else {
            div.innerHTML = 'Можно использовать формат: +79009999999, 79009999999, 89009999999';
        }
        form.append(div);
    } 
}

function add_error_checkbox() {
    if (document.getElementById("checkbox_error") == null) {
        let div = document.createElement('div');
        let form = document.getElementById("input_block_checkbox");
        div.className = 'input_error';
        div.id = 'checkbox_error';
        div.innerHTML = 'Нужно отметить это поле!';
        form.append(div);
    }
}

function delite_error_checkbox() {
    if (document.getElementById("checkbox_error") !== null) {
        document.getElementById('checkbox_error').remove();
    }
}

function delite_error(elem) {
    if (elem.name == "name") {
        if (document.getElementById("name_error") !== null) {
            document.getElementById('name_error').remove();
        }
    } else if (elem.name == "email") {
        if (document.getElementById("email_error") !== null) {
            document.getElementById('email_error').remove();
        }
    } else if (elem.name == "phone") {
        if (document.getElementById("phone_error") !== null) {
            document.getElementById('phone_error').remove();
        }
    }
}

function buttonHandler(e) {
    formArr.forEach((el) => {
        if (el.hasAttribute("data-reg")) {
            el.setAttribute("is-valid", "0");
            validFormArr.push(el);
            inputCheck(el);
        }
    });

    const allValid = [];
    validFormArr.forEach((el) => {
        allValid.push(el.getAttribute("is-valid"));
        if (el.getAttribute("is-valid") == 0) {
            el.style.border = "2px solid #ff6f6b";
        } 
    });
    const isAllValid = allValid.reduce((acc, current) => {
        return acc && current;
    });

    if (allValid[0] == "0" || allValid[1] == "0") {
        e.preventDefault();
        add_error(allValid);
    } else {
        add_error(allValid);
        call_request();
    }
}

function add_error(Valid) {
    let form = document.getElementById("formback_call");
    let div = document.createElement('div');

    if (Valid[0] == "0") {
        div.className = 'clue_back_call_1';
        div.innerHTML = 'Можно использовать только русские символы';
        form.append(div);
    } else if (document.getElementsByClassName('clue_back_call_1').length) {
        form_back_call.querySelector('.clue_back_call_1').remove();
    }

    if (Valid[1] == "0") {
        div = document.createElement('div');
        div.className = 'clue_back_call_2';
        div.innerHTML = 'Можно использовать формат: +79009999999, 79009999999, 89009999999';
        form.append(div);
    } else if (document.getElementsByClassName('clue_back_call_2').length) {
        form_back_call.querySelector('.clue_back_call_2').remove();
    }
}