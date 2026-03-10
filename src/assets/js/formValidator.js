// formValidator.js

class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => this.setupForm(form));
    }

    setupForm(form) {

        form.setAttribute('novalidate', 'novalidate');

        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        const phoneInputs = form.querySelectorAll('input[type="tel"][required]');

        // Удаляем класс submitted при загрузке
        form.classList.remove('submitted');

        // Обработчик отправки формы
        form.addEventListener('submit', (e) => {
            form.classList.add('submitted');

            let hasErrors = false;


            const invalidFields = form.querySelectorAll('input:required:invalid:not([type="checkbox"]):not([type="tel"]), textarea:required:invalid, select:required:invalid');
            if (invalidFields.length > 0) {
                hasErrors = true;
            }


            phoneInputs.forEach(phone => {

                const phoneValue = phone.value.replace(/\D/g, '');
                const isPhoneValid = phoneValue.length === 11;

                if (!isPhoneValid) {
                    hasErrors = true;
                    phone.classList.add('phone-mask-red');
                } else {
                    phone.classList.remove('phone-mask-red');
                }
            });

            // Проверяем чекбоксы
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    hasErrors = true;
                    checkbox.style.border = '1px solid #F83E49';
                    checkbox.style.outline = 'none';
                } else {
                    checkbox.style.border = '';
                }
            });

            if (hasErrors) {
                e.preventDefault();


                const firstInvalid = form.querySelector('.phone-mask-red, input:required:invalid:not([type="checkbox"]), textarea:required:invalid, select:required:invalid, input[type="checkbox"]:required:not(:checked)');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });


        phoneInputs.forEach(phone => {
            phone.addEventListener('input', () => {
                const phoneValue = phone.value.replace(/\D/g, '');
                const isPhoneValid = phoneValue.length === 11;

                if (isPhoneValid) {
                    phone.classList.remove('phone-mask-red');
                } else if (form.classList.contains('submitted')) {
                    phone.classList.add('phone-mask-red');
                }
            });
        });


        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    checkbox.style.border = '';
                } else if (form.classList.contains('submitted')) {
                    checkbox.style.border = '1px solid #F83E49';
                }
            });
        });
    }
}

export default FormValidator;