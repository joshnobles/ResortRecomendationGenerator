class LoginFormHandler {
    constructor() {
        this.loginForm = document.querySelector('#LoginForm');

        this.emailValid = document.querySelector('#EmailValidation');
        this.passwordValid = document.querySelector('#PasswordValidation');

        this.loginValid = document.querySelector('#LoginValidation');

        this.btnLogin = document.querySelector('#BtnLogin');

        this.btnLogin.addEventListener('click', this.submitLogin);
    }

    submitLogin = async () => {
        if (document.querySelector('#Email').value === 'github') {
            location.replace("https://github.com/joshnobles/ResortRecomendationGenerator");
            return;
        }

        const formData = this.getValidValues();

        if (!formData)
            return;

        const verificationToken = formData[0];
        const login = formData[1];

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(login)
            }

            const res = await fetch('?handler=Login', options);

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            const detail = {
                idAccount: json.idAccount,
                phoneLast4: json.phoneLast4
            }

            document.querySelector('#OtpModalBody')
                .dispatchEvent(new CustomEvent('opened', { detail: detail }));
        }
        catch (e) {
            if (e.message == 400)
                this.loginValid.textContent = 'Email or Password are not in a valid format';
            else if (e.message == 401)
                this.loginValid.textContent = 'Login failed, invalid Email or Password';
            else if (e.message == 409)
                this.loginValid.textContent = 'OTP check failed, please wait before logging in again';
            else
                this.loginValid.textContent = 'An error occurred loggin in';
        }
    }

    getValidValues = () => {
        this.emailValid.textContent = '';
        this.passwordValid.textContent = '';
        this.loginValid.textContent = '';

        const submission = {}
        let verificationToken;

        new FormData(this.loginForm).forEach((value, key) => {
            if (key === '__RequestVerificationToken')
                verificationToken = value;
            else
                submission[key] = value.trim();
        })

        let isValid = true;

        for (const key in submission) {
            switch (key) {
                case 'email':
                    if (!submission[key]) {
                        this.emailValid.textContent = 'Email is required!';
                        isValid = false;
                    }
                    else {
                        const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

                        if (!regex.test(submission[key])) {
                            this.emailValid.textContent = 'Invalid email!';
                            isValid = false;
                        }
                    }
                    break;
                case 'password':
                    if (!submission[key]) {
                        this.passwordValid.textContent = 'Password is required!';
                        isValid = false;
                    }
                    break;
            }
        }

        if (!isValid)
            return null;

        return [verificationToken, submission];
    }
}

export default LoginFormHandler;