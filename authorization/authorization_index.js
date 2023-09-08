let FirstAuthorization = true;
let PhoneNumber = '';

function next_authorization() {
    document.getElementById('formback_authorization_1').style.display = "none";
}

function back_authorization() {
    document.getElementById('formback_authorization_1').style.display = "block";
    document.querySelector('.authorization_2').remove();
}

function authorizationEnd() {
    window.location.href = "../index.html";
}

function authSmsPost() {
    let auth_phone = document.getElementById("phone").value;
    AuthSmsPost(auth_phone);
}

function addAuthorizationAfterSms(phone, firstAuth) {
    var main = document.getElementById("authorization_block");
    FirstAuthorization = firstAuth;
    PhoneNumber = phone;
    let authStr = document.createElement("div");
    authStr.className = 'authorization_2';
    authStr.id = 'authorization_2';
    if (firstAuth) {
        authStr.innerHTML = addFirstAuth(phone);
    } else {
        authStr.innerHTML = addAlreadyAuth(phone);
    }

    main.append(authStr);
    next_authorization();
}

function addFirstAuth(phone) {
    return `<form class="authorization_1" action="#" id="formback_authorization_2" name="formback_authorization_2" onsubmit="return false;">
                <div class="authorization_box">
                    <div class="authorization_cap" onclick="back_authorization();"><img src="../images/change_data.svg" alt=""></div>
                    <div class="authorization_box_input_color"><p>${phone}</p></div>
                    <div class="input_block_" id="input_block_name">
                        <input 
                            class="authorization_box_input"
                            type="text"  
                            id="name" 
                            name="name"
                            placeholder="ФИО" 
                            data-reg="^([А-ЯЁ][а-яё-]* *){1,}$"
                        />
                    </div>
                    <div class="input_block_" id="input_block_email">
                        <input 
                            class="authorization_box_input" 
                            type="text" 
                            id="email" 
                            name="email"
                            placeholder="Email"
                            data-reg="[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$"
                        />
                    </div>
                    <div class="input_block_" id="confirmationСode">
                        <input 
                            type="text" 
                            name="code"
                            id="code"
                            class="authorization_box_input_2" 
                            data-reg="[0-9]"
                            placeholder="Код подтверждения" 
                        />
                    </div>
                    <div class="input_block_1" id="input_block_checkbox">
                        <label>
                            <div class="inline">
                                <input 
                                    type='checkbox' 
                                    id="checkbox"
                                />
                                <span></span>
                                <div class="labelText">Согласие <a href="">на обработку</a> персональных данных</div>
                            </div>
                        </label>
                    </div>
                    <button class="button_come" onclick="authorization();">Войти</button>
                </div>
            </form>`;
}

function addAlreadyAuth(phone) {
    return `<form class="authorization_1" action="#" id="formback_authorization_2" name="formback_authorization_2" onsubmit="return false;">
                <div class="authorization_box">
                    <div class="authorization_cap" onclick="back_authorization();"><img src="../images/change_data.svg" alt=""></div>
                    <div class="authorization_box_input_color"><p>${phone}</p></div>
                    <div class="input_block_" id="confirmationСode">
                        <input 
                            type="text" 
                            name="code"
                            id="code"
                            class="authorization_box_input_2" 
                            data-reg="[0-9]"
                            placeholder="Код подтверждения" 
                        />
                    </div>
                    <div class="margin_button"></div>
                    <button class="button_come" onclick="authorization();">Войти</button>
                </div>
            </form>`;
}

function authorization() {
    let formAuth2 = document.forms["formback_authorization_2"];
    let formAuth2Arr = Array.from(formAuth2);
    let formAuth2ValidFormArr = [];

    for (let el in formAuth2Arr) {
        delite_error(formAuth2Arr[el]);
        if (formAuth2Arr[el].hasAttribute("data-reg")) {
            inputCheck2(formAuth2Arr[el]);
            formAuth2ValidFormArr.push(formAuth2Arr[el]);
        }
    }
    let number = 0;
    for (let elem in formAuth2ValidFormArr) {
        if (formAuth2ValidFormArr[elem].getAttribute("is-valid") == 0) {
            formAuth2ValidFormArr[elem].style.border = "2px solid #ff6f6b";
            add_error2(formAuth2ValidFormArr[elem]);
            number += 1;
        }
        else {
            formAuth2ValidFormArr[elem].style.border = "0";
        }
    }

    if (document.getElementById("input_block_checkbox") !== null) {
        let chbox = formAuth2.elements["checkbox"];
        if (!chbox.checked) {
            add_error_checkbox();
            number += 1;
        } else {
            delite_error_checkbox();
        }
    }
    if (number == 0) {
        authorizationAfterVerification();
    }

}

function inputCheck2(el) {
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

function add_error2(elem) {
    let div = document.createElement('div');

    if (elem.name == "name") {
        let form = document.getElementById("input_block_name");
        div.className = 'input_error';
        div.id = 'name_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
        } else {
            div.innerHTML = 'Это поле может содержать только буквы!';
        }
        form.append(div);
    } else if (elem.name == "email") {
        let form = document.getElementById("input_block_email");
        div.className = 'input_error';
        div.id = 'email_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
        } else {
            div.innerHTML = 'Неправильно указан email адрес!';
        }
        form.append(div);
    } else if (elem.name == "code") {
        let form = document.getElementById("confirmationСode");
        div.className = 'input_error';
        div.id = 'code_error'
        if (elem.value == "") {
            div.innerHTML = 'Это поле обязательно для заполнения!';
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

function addErrorCode() {
    if (document.getElementById("code_error") !== null) {
        document.getElementById("code_error").remove();
    }
    if (document.getElementById("code_error") !== null) {
        let form = document.getElementById("confirmationСode");
        let div = document.createElement('div');
        div.className = 'input_error';
        div.id = 'code_error'
        div.innerHTML = 'Вы неправильно ввели код!';
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
    } else if (elem.name == "code") {
        if (document.getElementById("code_error") !== null) {
            document.getElementById('code_error').remove();
        }
    }
}

function authorizationAfterVerification() {
    let code = document.getElementById("code").value;
    if (FirstAuthorization) {
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        Authorization(true, PhoneNumber, name, code, email);
    } else {
        Authorization(false, PhoneNumber, null, code, null);
    }

}

function errorCode() {
    
    let form = document.getElementById("confirmationСode");
    let div = document.createElement('div');
    div.className = 'input_error';
    div.id = 'code_error'
    div.innerHTML = 'Код не верный, попробуйте еще раз!';
    form.append(div);
}