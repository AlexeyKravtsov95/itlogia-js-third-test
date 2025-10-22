window.onload = function () {
    const fullNameInput = document.getElementById("full-name-input");
    const usernameInput = document.getElementById("username-input");
    const checkbox = document.getElementById("agree-check");
    const signUpButton = document.getElementById("sign-up");
    const passwordInput = document.getElementById("password-input");
    const repeatPasswordInput = document.getElementById("repeat-password-input");
    const linkAccount = document.getElementById("link-account");
    const infoTitle = document.getElementById("info-title");
    const userNameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const inputField = [
        {
            field: 'full-name-input',
            label: 'full-name-label',
            error: 'full-name-error',
        },
        {
            field: 'username-input',
            label: 'username-label',
            error: 'username-error',
        },
        {
            field: 'email-input',
            label: 'email-label',
            error: 'email-error',
        },
        {
            field: 'password-input',
            label: 'password-label',
            error: 'password-error',
        },
        {
            field: 'repeat-password-input',
            label: 'repeat-password-label',
            error: 'repeat-password-error',
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
        document.querySelectorAll(".error").forEach(element => element.style.display = "none");
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const fullNamePattern = /^[А-Яа-яA-Za-z\s]+$/;
        const usernamePattern = /^[А-Яа-яA-Za-z0-9_-]+$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        let hasError = false;
        for (let input of inputField) {
            const inputValue = document.getElementById(input.field);
            const inputLabelElement = document.getElementById(input.label)
            const errorElement = document.getElementById(input.error)
            const defaultError = errorElement.dataset.default || errorElement.textContent;
            errorElement.dataset.default = defaultError;

            try {
                const inputLabel = inputLabelElement.innerText;
                if (!inputValue.value) {
                    errorElement.textContent = `Заполните поле ${inputLabel}`;
                    errorElement.style.display = "block";
                    hasError = true;
                    continue;
                }

                if (inputValue.id === "full-name-input") {
                    if(!fullNamePattern.test(fullNameInput.value)) {
                        errorElement.textContent = defaultError;
                        errorElement.style.display = "block";
                        hasError = true;
                        continue;
                    }
                }

                if (inputValue.id === "username-input") {
                    if(!usernamePattern.test(usernameInput.value)) {
                        errorElement.textContent = defaultError;
                        errorElement.style.display = "block";
                        hasError = true;
                        continue;
                    }
                }

                if(inputValue.id === "email-input") {
                    if(!emailPattern.test(emailInput.value)) {
                        errorElement.textContent = defaultError;
                        errorElement.style.display = 'block'
                        hasError = true;
                        continue;
                    }
                }

                if(inputValue.id === "password-input") {
                    if(!passwordPattern.test(passwordInput.value)) {
                        errorElement.textContent = defaultError;
                        errorElement.style.display = 'block'
                        hasError = true;
                        continue
                    }
                }

                if (repeatPasswordInput.value !== passwordInput.value) {
                    errorElement.textContent = defaultError;
                    errorElement.style.display = 'block'
                    hasError = true;
                }
            } catch (error) {
                console.error(`Не найден элемент с field: ${input.field} или ${input.label}\n${error}`);
            }
        }

        if (!checkbox.checked) {
            document.getElementById('agree-error').style.display = "block";
            return;
        }
        if (hasError) return;
        const success = saveData();
        if (!success) return;
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

    linkAccount.onclick = function () {
        switchFormToLogin();
    }

    function switchFormToLogin() {
        infoTitle.innerText = "Log in to the system";
        document.getElementById("full-name-label").style.display = "none";
        fullNameInput.style.display = "none";
        document.getElementById("email-label").style.display = "none";
        emailInput.style.display = "none";
        document.getElementById("repeat-password-label").style.display = "none";
        repeatPasswordInput.style.display = "none";
        document.getElementById("agree").style.display = "none";
        signUpButton.innerText = "Sign In";
        linkAccount.textContent = "Registration"
        let passwordError = document.getElementById('password-error');
        let hasError = false;

        userNameError.style.display = "none";
        passwordError.style.display = "none"

        usernameInput.addEventListener("input", () => userNameError.style.display = "none");
        passwordInput.addEventListener("input", () => passwordError.style.display = "none");

        linkAccount.onclick = function () {
            location.reload();
        }

        signUpButton.onclick = function () {
            if (usernameInput.value.trim() === "") {
                userNameError.style.display = "block";
                hasError = true;
            }

            if (passwordInput.value.trim() === "") {
                passwordError.style.display = "block";
                hasError = true;
            }

            if(!hasError)  {
                let clients = JSON.parse(localStorage.getItem("clients")) || [];
                let user = clients.find(user => user.username === usernameInput.value.trim());

                if (!user) {
                    userNameError.textContent = "Пользователь не найден"
                    userNameError.style.display = "block";
                    return
                }

                if (user.password !== passwordInput.value.trim()) {
                    passwordError.textContent = "Неверный пароль"
                    passwordError.style.display = "block";
                    return
                }

                loginToPersonalPage(user);
            }
        }
    }

    function loginToPersonalPage(user) {
        const mainForm = document.querySelector(".main-form");
        infoTitle.innerText = `Welcome, ${user.fullName}!`;
        mainForm.style.alignItems = "center";
        mainForm.style.justifyContent = "center";
        mainForm.style.textAlign = "center";
        document.getElementById("info-subtitle").style.display = "none";
        document.getElementById('username-label').style.display = "none";
        document.getElementById('password-label').style.display = "none";
        linkAccount.style.display = "none";
        signUpButton.innerText = "Exit";

        signUpButton.onclick = function () {
            location.reload();
        }
    }

    function saveData() {
        const fullName = fullNameInput.value.trim()
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let client = {
            fullName: fullName,
            username: username,
            email: email,
            password: password,
        }

        let clients = JSON.parse(localStorage.getItem("clients")) || [];
        if (clients.some(client => client.username === username)) {
            userNameError.textContent = `Такой ${client.username} уже зарегистрирован`;
            userNameError.style.display = "block";
            return false;
        }
        if (clients.some(client => client.email === email)) {
            emailError.textContent = `Такой ${client.email} уже зарегистрирован`;
            emailError.style.display = "block";
            return false;
        }

        clients.push(client);
        localStorage.setItem("clients", JSON.stringify(clients));
        return true;
    }
}