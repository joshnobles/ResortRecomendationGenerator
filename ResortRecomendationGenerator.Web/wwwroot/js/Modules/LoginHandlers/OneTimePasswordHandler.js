import showErrorMessage from '../Helpers/ShowErrorMessage.js';

class OneTimePasswordHandler {
    constructor() {
        this.modal = new bootstrap.Modal(document.querySelector('#OtpModal'));

        this.modalHeader = document.querySelector('#OtpModalLabel');
        this.modalBody = document.querySelector('#OtpModalBody');

        this.txtOtp = document.querySelector('#Otp');
        this.otpValid = document.querySelector('#OtpValidation');

        this.btnSubmitOtp = document.querySelector('#BtnSubmitOtp');
        this.btnClearOtp = document.querySelector('#BtnClearOtp');

        this.addEventListeners();
    }

    showOtpForm = detail => {
        this.btnSubmitOtp.setAttribute('idaccount', detail.idAccount);
        this.modalHeader.textContent = `Enter the verification code sent to: (***) *** - ${detail.phoneLast4}`;

        this.modal.show();
    }

    submitOtp = async () => {
        const formData = this.getValidOtp();

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

            const res = await fetch('?handler=CheckOtp', options);

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
                showErrorMessage('Failed OTP verification, please log in again');
                this.clearModal();
            }
            else
                location.reload();
        }
    }

    clearModal = () => {
        this.txtOtp.value = '';
        this.otpValid.textContent = '';
        this.modalHeader.textContent = '';

        this.btnSubmitOtp.removeAttribute('idaccount');

        this.modal.hide();
    }

    addEventListeners = () => {
        this.modalBody.addEventListener('opened', e => this.showOtpForm(e.detail));

        this.btnClearOtp.addEventListener('click', this.clearModal);

        this.btnSubmitOtp.addEventListener('click', this.submitOtp);
    }

    getValidOtp = () => {
        const otp = this.txtOtp.value.trim();

        let isValid = true;

        if (!otp) {
            this.otpValid.textContent = 'OTP is required';
            isValid = false;
        }
        else {
            const regex = new RegExp('^[0-9]{6}$');

            if (!regex.test(otp)) {
                this.otpValid.textContent = 'Invalid OTP';
                isValid = false;
            }
        }

        if (!isValid)
            return null;

        const verificationToken = this.modalBody
            .querySelector('input[name=__RequestVerificationToken]')
            .value;

        const submission = {
            otp: otp,
            idAccount: this.btnSubmitOtp.getAttribute('idaccount')
        }

        return [verificationToken, submission];
    }

}

export default OneTimePasswordHandler;