import { FormValidator } from "./formValidator.js";
import { UserStorage } from "./userStorage.js";

export class AuthForm {
    constructor() {
        this.fullNameInput = document.getElementById("full-name-input");
        this.usernameInput = document.getElementById("username-input");
        this.emailInput = document.getElementById("email-input");
        this.passwordInput = document.getElementById("password-input");
        this.repeatPasswordInput = document.getElementById("repeat-password-input");
        this.checkbox = document.getElementById("agree-check");
        this.signUpButton = document.getElementById("sign-up");
        this.linkAccount = document.getElementById("link-account");
        this.infoTitle = document.getElementById("info-title");
        this.infoSubtitle = document.getElementById("info-subtitle");

        this.inputField = [
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

        this.validator = new FormValidator(this.inputField);
        this.storage = new UserStorage();
        this.showEvents();
    }

    showEvents() {
        this.validator.inputListener();
        this.signUpButton.onclick = () => this.registrationForm();
        this.linkAccount.onclick = () => this.switchToLogin();
    }

    registrationForm() {
        const patterns = {
            "full-name-input": /^[А-Яа-яA-Za-z\s]+$/,
            "username-input": /^[А-Яа-яA-Za-z0-9_-]+$/,
            "email-input": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "password-input": /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        }

        const isValidField = this.validator.validate(patterns)
        const isAgree = this.checkbox.checked

        if(!isAgree){
            document.getElementById("agree-error").style.display = "inline-block";
        }

        if(!isValidField || !isAgree) return;

        const user = {
            fullName: this.fullNameInput.value,
            username: this.usernameInput.value,
            email: this.emailInput.value,
            password: this.passwordInput.value,
        }

        if (this.storage.byUsername(user.username)) {
            this.validator.showError("username-label", "username-error", `Такой ${user.username} уже зарегистрирован`);
            return;
        }

        if (this.storage.byEmail(user.email)) {
            this.validator.showError("email-label", "email-error", `Такой ${user.email} уже зарегистрирован`);
            return;
        }

        this.storage.save(user);

        document.getElementById("success-popup").style.display = "flex";

        document.getElementById("popup-close").onclick = () => {
            document.getElementById("success-popup").style.display = "none";
            this.resetForm();
            this.switchToLogin();
        }
    }

    resetForm() {
        [
            this.fullNameInput,
            this.usernameInput,
            this.emailInput,
            this.passwordInput,
            this.repeatPasswordInput,
        ].forEach((e) => {
            e.value = ""
        });
        this.checkbox.checked = false;
    }

    switchToLogin() {
        this.validator.clearError()
        this.infoTitle.innerText = "Log in to the system";
        this.infoSubtitle.style.display = "none";
        document.querySelectorAll("#full-name-label, #email-label, #repeat-password-label, #agree")
            .forEach(element => element.style.display = "none");
        this.signUpButton.innerText = "Sign In";
        this.linkAccount.textContent = "Registration";
        this.signUpButton.onclick = () => this.loginToPersonalPage();
        this.linkAccount.onclick = () => location.reload();
    }

    loginToPersonalPage() {
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;
        const user = this.storage.find(username)

        this.validator.clearError()

        let hasError = false;

        if (!username) {
            this.validator.showError("username-label", "username-error", `Username может содержать только буквы, цифры, символы`);
            hasError = true;
        }

        if (!password) {
            this.validator.showError("password-label", "password-error", `Пароль должен содержать не менее 8 символов, заглавная буква, цифра и спецсимвол`);
            hasError = true;
        }

        if (hasError) return;

        if (!user) {
            this.validator.showError("username-label", "username-error", "Пользователь не найден");
            return;
        }

        if (user.password !== password) {
            this.validator.showError("password-label", "password-error", "Неверный пароль");
            return;
        }

        this.showUserPage(user);
    }

    showUserPage(user) {
        const mainForm = document.querySelector(".main-form");
        mainForm.classList.add("welcome");
        this.infoTitle.innerText = `Welcome, ${user.fullName}!`;
        this.infoSubtitle.style.display = "none";
        document.getElementById("username-label").style.display = "none";
        document.getElementById("password-label").style.display = "none";
        this.linkAccount.style.display = "none";
        this.signUpButton.innerText = "Exit"

        this.signUpButton.onclick = () => location.reload();
    }
}