class AddApiKeyFormHandler {
    constructor() {
        this.modal = new bootstrap.Modal(document.querySelector('#RegisterApiKeyModal'));

        this.form = document.querySelector('#RegisterApiKeyForm');

        this.btnSubmitForm = document.querySelector('#BtnSubmitAddApiKeyForm');
        this.btnClearForm = document.querySelector('#BtnClearAddApiKeyForm');

        this.btnSubmitForm.addEventListener('click', this.submitForm);

        this.btnClearForm.addEventListener('click', this.clearForm);
    }

    submitForm = async () => {
        const formData = this.getValidValues();

        if (!formData)
            return;

        const newApiKey = formData[0];
        const verificationToken = formData[1];

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(newApiKey)
            }

            const res = await fetch(`?handler=RegisterApiKey`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            alert('Successfully registered API key!');

            document.querySelector('#ApiKeyListContainer').dispatchEvent(new Event('refresh'));

            this.clearForm();
        }
        catch (e) {
            if (e.message == 400)
                alert('Can not register API key due to invalid data');
            else if (e.message == 409)
                alert('You can not have more than three API keys');
            else
                alert('There was an error registering a new API key');
        }
    }

    getValidValues = () => {
        const errors = [];

        const submission = {};

        let verificationToken = "";

        new FormData(this.form).forEach((value, key) => {
            if (key === '__RequestVerificationToken')
                verificationToken = value;
            else
                submission[key] = value.trim();
        })

        if (!submission.name)
            errors.push('Invalid name!');

        if (!submission.allowedHost)
            submission.allowedHost = null;

        if (errors.length != 0) {
            let result = 'Can not add API key, invalid data:\n';

            for (const e of errors)
                result += e + '\n';

            alert(result);
            return null;
        }

        return [submission, verificationToken];
    }

    clearForm = () => {
        this.form.reset();
        this.modal.hide();
    }

}

export default AddApiKeyFormHandler;