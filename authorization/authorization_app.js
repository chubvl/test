const form_back_call = document.forms["formback_authorization_1"];
const formArr = Array.from(form_back_call);
const validFormArr = [];
const button_back_call = form_back_call.elements["button_1"];

formArr.forEach((el) => {
    if (el.hasAttribute("data-reg")) {
        el.setAttribute("is-valid", "0");
        validFormArr.push(el);
    }
});

form_back_call.addEventListener("input", inputHandler);
button_back_call.addEventListener("click", buttonHandler);

function inputHandler({ target }) {
    if (target.hasAttribute("data-reg")) {
        inputCheck(target);
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

function buttonHandler(e) {
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

    if (allValid[0] == "0") {
        e.preventDefault();
        add_error(allValid);
    } else {
        add_error(allValid);
        authSmsPost();
    }
}

function add_error(Valid) {
    let form = document.getElementById("input_block_phone");
    let div = document.createElement('div');

    if (Valid[0] == "0") {
        if (!(form_back_call.getElementsByClassName('input_error').length)) {
            div.className = 'input_error';
            div.id = 'phone_error'
            div.innerHTML = 'Можно использовать формат: +79009999999, 79009999999, 89009999999';
            form.append(div);
        }
    } else if (form_back_call.getElementsByClassName('input_error').length) {
        form_back_call.querySelector('.input_error').remove();
    }
}
