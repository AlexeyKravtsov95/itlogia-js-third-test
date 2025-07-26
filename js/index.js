window.onload = function () {
    let fullNameInput = document.getElementById("full-name-input");

    fullNameInput.onkeydown = (event) => {
        let number = parseInt(event.key);
        if (!isNaN(number)) {
            event.preventDefault();
        }
    }

    let usernameInput = document.getElementById("username-input");

    usernameInput.onkeydown = (event) => {
        if (event.key === "." || event.key === ",") {
            event.preventDefault();
        }
    }

    let checkbox = document.getElementById("agree-check");

    checkbox.onchange = (event) => {
        event.target.checked ? console.log("Согласен") : console.log("Не согласен");
    }

    let signUpButton = document.getElementById("sign-up");
    let passwordInput = document.getElementById("password-input");
    let repeatPasswordInput = document.getElementById("repeat-password-input");
    let inputField = [
        {
            field: 'full-name-input',
            label: 'full-name-label',
        },
        {
            field: 'username-input',
            label: 'username-label',
        },
        {
            field: 'email-input',
            label: 'email-label',
        },
        {
            field: 'password-input',
            label: 'password-label',
        },
        {
            field: 'repeat-password-input',
            label: 'repeat-password-label',
        }
    ]

    let emailInput = document.getElementById("email-input");

    signUpButton.onclick = function () {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (let input of inputField) {
            let inputValue = document.getElementById(input.field);
            let inputLabelElement = document.getElementById(input.label)
            try {
                let inputLabel = inputLabelElement.innerText;
                if (!inputValue.value) {
                    alert(`Заполните поле ${inputLabel}`)
                    return;
                }
            } catch (error) {
                console.error(`Не найден элемент с field: ${input.field} или ${input.label}\n${error}`);
            }
        }

        if(!emailPattern.test(emailInput.value)) {
            alert("Введен некорректный email");
            return;
        }

        if (passwordInput.value.length < 8 ) {
            alert("Длина пароля должна быть не менее 8 символов");
            return;
        }

        if (repeatPasswordInput.value !== passwordInput.value) {
            alert("Пароли не совпадают");
            return;
        }

        if (!checkbox.checked) {
            alert("Не проставлено согласие");
            return;
        }

        document.getElementById("success-popup").style.display = "flex";
    }

    document.getElementById("popup-close").onclick = function () {
        document.getElementById("success-popup").style.display = "none";
        for (let input of inputField) {
            let inputValue = document.getElementById(input.field);
            try {
                inputValue.value = "";
            } catch (error) {
                console.error(`Не найден элемент с field: ${input.field}`);
            }
        }
        checkbox.checked = false;
        switchFormToLogin();
    }

    document.getElementsByClassName("link-account")[0].onclick = function () {
        switchFormToLogin();
    }

    function switchFormToLogin() {
        document.getElementsByClassName("info-title")[0].innerText = "Log in to the system";
        document.getElementById("full-name-label").style.display = "none";
        fullNameInput.style.display = "none";
        document.getElementById("email-label").style.display = "none";
        emailInput.style.display = "none";
        document.getElementById("repeat-password-label").style.display = "none";
        repeatPasswordInput.style.display = "none";
        document.getElementsByClassName("agree")[0].style.display = "none";
        signUpButton.innerText = "Sign In";
        document.getElementsByClassName("check-account")[0].style.display = "none";

        signUpButton.onclick = function () {
            if(!usernameInput.value) {
                alert("Не заполнено поле Username");
                return;
            }

            if(!passwordInput.value) {
                alert("Не заполнено поле Password");
                return;
            }

            alert(`Добро пожаловать, ${usernameInput.value}!`);
        }
    }
}