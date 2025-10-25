export class FormValidator {
    constructor(fields) {
        this.fields = fields;
    }

    clearError() {
        document.querySelectorAll(".error").forEach(element => element.style.display = "none");
        document.querySelectorAll("label").forEach(element => element.classList.remove("error-label"));
    }

    showError(label, error, message) {
        const labelElement = document.getElementById(label);
        const errorElement = document.getElementById(error);
        if (!labelElement || !errorElement) return;

        labelElement.classList.add("error-label");
        errorElement.textContent = message;
        errorElement.style.display = "inline-block";
    }

    inputListener() {
        document.querySelectorAll(".base-input").forEach(element => {
            element.addEventListener("input", event => {
                const label = element.closest("label");
                const error = label.querySelector(".error");
                label.classList.remove("error-label");
                if (error) error.style.display = "none";
            })
        })
    }

    validate(patterns) {
        this.clearError()
        let hasError = false;

        const passwordInput = document.getElementById("password-input").value;
        const repeatPasswordInput = document.getElementById("repeat-password-input").value;

        for (const input of this.fields) {
            const pattern = patterns[input.field];
            const inputValue = document.getElementById(input.field);
            const inputLabelElement = document.getElementById(input.label)
            const errorElement = document.getElementById(input.error)
            const defaultError = errorElement.dataset.default || errorElement.textContent;
            errorElement.dataset.default = defaultError;

            try {
                const inputLabel = inputLabelElement.innerText;
                if (!inputValue.value) {
                    this.showError(input.label, input.error, `Заполните поле ${inputLabel}`);
                    hasError = true;
                    continue;
                }

                if (pattern && !pattern.test(inputValue.value)) {
                    this.showError(input.label, input.error, defaultError);
                    hasError = true;
                }
            } catch (error) {
                console.error(`Не найден элемент с field: ${input.field} или ${input.label}\n${error}`);
                hasError = true;
            }
        }

        if (passwordInput && repeatPasswordInput && passwordInput !== repeatPasswordInput) {
            this.showError("repeat-password-label", "repeat-password-error", "Пароли должны совпадать");
            hasError = true;
        }

        return !hasError;
    }
}