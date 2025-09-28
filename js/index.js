window.onload = function () {
    const fullNameInput = document.getElementById("full-name-input");
    const usernameInput = document.getElementById("username-input");
    const checkbox = document.getElementById("agree-check");
    const signUpButton = document.getElementById("sign-up");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const inputField = [
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
    ];
    const emailInput = document.getElementById("email-input");

    fullNameInput.onkeydown = (event) => {
        let number = parseInt(event.key);
        if (!isNaN(number)) {
            event.preventDefault();
        }
    }


    usernameInput.onkeydown = (event) => {
        if (event.key === "." || event.key === ",") {
            event.preventDefault();
        }
    }

    checkbox.onchange = (event) => {
        event.target.checked ? console.log("Согласен") : console.log("Не согласен");
    }

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

                if(inputValue.id === "email-input") {
                    if(!emailPattern.test(emailInput.value)) {
                        alert("Введен некорректный email");
                        return;
                    }
                }

                if(inputValue.id === "password-input") {
                    if (passwordInput.value.length < 8 ) {
                        alert("Длина пароля должна быть не менее 8 символов");
                        return;
                    }
                }
            } catch (error) {
                console.error(`Не найден элемент с field: ${input.field} или ${input.label}\n${error}`);
            }
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

    document.getElementById("link-account").onclick = function () {
        switchFormToLogin();
    }

    function switchFormToLogin() {
        document.getElementById("info-title").innerText = "Log in to the system";
        document.getElementById("full-name-label").style.display = "none";
        fullNameInput.style.display = "none";
        document.getElementById("email-label").style.display = "none";
        emailInput.style.display = "none";
        document.getElementById("repeat-password-label").style.display = "none";
        repeatPasswordInput.style.display = "none";
        document.getElementById("agree").style.display = "none";
        signUpButton.innerText = "Sign In";
        document.getElementById("check-account").style.display = "none";

        signUpButton.onclick = function () {
            if(!usernameInput.value) {
                alert("Не заполнено поле Username");
                return;
            }

            if(!passwordInput.value) {
                alert("Не заполнено поле Password");
                return;
            }

            if (passwordInput.value.length < 8 ) {
                alert("Длина пароля должна быть не менее 8 символов");
                return;
            }

            alert(`Добро пожаловать, ${usernameInput.value}!`);
        }
    }

    console.log("test3213");
}