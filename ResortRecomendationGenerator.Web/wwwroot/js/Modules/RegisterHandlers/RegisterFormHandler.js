import showErrorMessage from '../Helpers/ShowErrorMessage.js';

class RegisterFormHandler {
    constructor() {
        this.registerForm = document.querySelector('#RegisterForm');

        this.btnRegister = document.querySelector('#BtnRegister');

        this.firstNameValid = document.querySelector('#FirstNameValidation');
        this.lastNameValid = document.querySelector('#LastNameValidation');
        this.phoneValid = document.querySelector('#PhoneValidation');
        this.emailValid = document.querySelector('#EmailValidation');
        this.passwordValid = document.querySelector('#PasswordValidation');

        this.registerViewModel = {};

        this.modal = new bootstrap.Modal(document.querySelector('#OtpModal'));

        this.modalHeader = document.querySelector('#OtpModalLabel');
        this.modalBody = document.querySelector('#OtpModalBody');

        this.txtOtp = document.querySelector('#Otp');
        this.otpValid = document.querySelector('#OtpValidation');

        this.btnSubmitOtp = document.querySelector('#BtnSubmitOtp');
        this.btnClearOtp = document.querySelector('#BtnClearOtp');

        this.addEventListeners();
    }

    submitRegister = async () => {
        this.registerViewModel = {};

        const formData = this.getValidRegisterValues();

        if (!formData)
            return;

        const verificationToken = formData[0];
        const submission = formData[1];

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(submission)
            }

            const res = await fetch('?handler=VerifyPhone', options);

            if (!res.ok)
                throw new Error(res.status);

            this.registerViewModel = submission;

            this.showOtpModal();
        }
        catch (e) {
            this.registerViewModel = {};

            if (e.message == 400)
                showErrorMessage('Request contained invalid data');
            else if (e.message == 409)
                showErrorMessage('This account already exists, try logging in');
            else if (e.message == 401)
                showErrorMessage('Cannot verify phone number, please wait and try again');
            else
                showErrorMessage('An error occurred verifying new account');
        }
    }

    getValidRegisterValues = () => {
        this.firstNameValid.textContent = '';
        this.lastNameValid.textContent = '';
        this.phoneValid.textContent = '';
        this.emailValid.textContent = '';
        this.passwordValid.textContent = '';

        const submission = {};
        let verificationToken;

        let isValid = true;

        new FormData(this.registerForm).forEach((value, key) => {
            if (key === '__RequestVerificationToken') {
                verificationToken = value;
                return;
            }
            else if (key === 'confirmPassword')
                return;
            
            switch (key) {
                case 'firstName':
                    if (!value) {
                        this.firstNameValid.textContent = 'First Name is required';
                        isValid = false;
                    }
                    else if (!/^[A-Za-z ']{3,20}$/.test(value)) {
                        this.firstNameValid.textContent = 'Invalid First Name';
                        isValid = false;
                    }
                    break;
                case 'lastName':
                    if (!value) {
                        this.lastNameValid.textContent = 'Last Name is required';
                        isValid = false;
                    }
                    else if (!/^[A-Za-z ']{3,20}$/.test(value)) {
                        this.lastNameValid.textContent = 'Invalid Last Name';
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if (!value) {
                        this.phoneValid.textContent = 'Phone is required';
                        isValid = false;
                    }
                    else if (!/^[0-9]{10}$/.test(value)) {
                        this.phoneValid.textContent = 'Phone number must be in the format: 1234567890';
                        isValid = false;
                    }
                    break;
                case 'email':
                    if (!value) {
                        this.emailValid.textContent = 'Email is required';
                        isValid = false;
                    }
                    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                        this.emailValid.textContent = 'Invalid Email';
                        isValid = false;
                    }
                    break;
                case 'password':
                    if (!value) {
                        this.passwordValid.textContent = 'Password is required';
                        isValid = false;
                    }
            }

            submission[key] = value;
        })

        if (!isValid)
            return null;

        return [verificationToken, submission];
    }

    getValidOtp = () => {
        this.otpValid.textContent = '';

        const otp = this.txtOtp.value.trim();

        const verificationToken = this.modalBody
            .querySelector(['input[name=__RequestVerificationToken]'])
            .value;

        if (!otp) {
            this.otpValid.textContent = 'OTP is required';
            return null;
        }

        if (!/^[0-9]{6}$/.test(otp)) {
            this.otpValid.textContent = 'Invalid OTP';
            return null;
        }

        return [verificationToken, otp];
    }

    showOtpModal = () => {
        this.modalHeader.textContent = `Enter the verification code sent to: ${this.registerViewModel.phone}`;

        this.modal.show();
    }

    submitOtp = async () => {
        const formData = this.getValidOtp();

        if (!formData)
            return;

        const verificationToken = formData[0];
        const otp = formData[1];

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    RequestVerificationToken: verificationToken
                },
                body: JSON.stringify(this.registerViewModel)
            }

            const params = new URLSearchParams({
                handler: 'CheckOtp',
                otp: otp
            })

            const res = await fetch(`?${params}`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            this.otpValid.textContent = 'Incorrect OTP, please try again';
        }
        catch (e) {
            if (e.message == 400)
                this.otpValid.textContent = 'Invalid OTP';
            else if (e.message == 401) {
                showErrorMessage('Failed OTP verification, please register again');
                this.clearOtpModal();
            }
            else
                location.reload();
        }
    }

    clearOtpModal = () => {              
        this.txtOtp.value = '';
        this.otpValid.textContent = '';
        this.modalHeader.textContent = '';

        this.modal.hide();    
    }

    addEventListeners = () => {
        this.btnRegister.addEventListener('click', this.submitRegister);

        this.btnClearOtp.addEventListener('click', this.clearOtpModal);

        this.btnSubmitOtp.addEventListener('click', this.submitOtp);
    }
}

export default RegisterFormHandler;