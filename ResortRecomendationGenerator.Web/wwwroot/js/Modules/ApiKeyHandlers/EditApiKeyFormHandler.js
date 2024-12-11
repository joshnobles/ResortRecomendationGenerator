class EditApiKeyFormHandler {
    constructor() {
        this.modal = new bootstrap.Modal(document.querySelector('#EditApiKeyModal'));

        this.form = document.querySelector('#EditApiKeyForm');

        this.btnSubmit = document.querySelector('#BtnSubmitEditApiKeyForm');
        this.btnClear = document.querySelector('#BtnClearEditApiKeyForm');
        this.btnDelete = document.querySelector('#BtnDeleteApiKey');

        this.form.addEventListener('populate', e => {
            this.populateForm(e.detail);
        })

        this.btnClear.addEventListener('click', this.clearForm);

        this.btnSubmit.addEventListener('click', this.submitForm);

        this.btnDelete.addEventListener('click', this.submitDelete);
    }

    populateForm = async idApiKey => {
        if (!idApiKey) {
            location.reload();
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('handler', 'ApiKey');
            params.append('idApiKey', idApiKey);

            const res = await fetch(`?${params}`);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            document.querySelector('#EditApiKeyName').value = json.name;
            document.querySelector('#EditApiKeyAllowedHost').value = json.allowedHost;
            this.btnSubmit.setAttribute('idapikey', idApiKey);
            this.btnDelete.setAttribute('idapikey', idApiKey);
        }
        catch (e) {
            if (e.message == 401)
                alert('Can not access API endpoint');
            else if (e.message == 404)
                alert('API key not found');
            else
                alert('An error occurred getting API key data');
        }
    }

    submitForm = async () => {
        const formData = this.getValidValues();

        if (!formData)
            return;

        const editedApiKey = formData[0];
        const verificationToken = formData[1];

        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(editedApiKey)
            }

            const res = await fetch(`?handler=EditApiKey`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            alert('Successfully Updated API key!');

            document.querySelector('#ApiKeyListContainer').dispatchEvent(new Event('refresh'));

            this.clearForm();
        }
        catch (e) {
            if (e.message == 400)
                alert('Invalid Data');
            else if (e.message == 404)
                alert('API key not found for editing');
            else
                alert('There was an error editing the API key');
        }
    }

    submitDelete = async () => {
        const idApiKey = parseInt(this.btnDelete.getAttribute('idapikey'));

        if (!idApiKey || isNaN(idApiKey)) {
            alert('Can not identify key');
            return;
        }

        const verificationToken = new FormData(this.form).get('__RequestVerificationToken');

        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'RequestVerificationToken': verificationToken
                }
            }

            const params = new URLSearchParams();
            params.append('handler', 'ApiKey');
            params.append('idApiKey', idApiKey);

            const res = await fetch(`?${params}`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status)

            alert('Successfully deleted API key');

            document.querySelector('#ApiKeyListContainer').dispatchEvent(new Event('refresh'));

            this.clearForm();
        }
        catch (e) {
            if (e.message == 401)
                alert('You do not have access to this endpoint');
            else if (e.message == 404)
                alert('API key not found');
            else
                alert('there was an error deleting this API key');
        }
    }

    clearForm = () => {
        document.querySelector('#EditApiKeyName').value = '';
        document.querySelector('#BtnClearEditApiKeyForm').value = '';

        this.btnSubmit.removeAttribute('idapikey');
        this.btnDelete.removeAttribute('idapikey');

        this.modal.hide();
    }

    getValidValues = () => {
        const errors = [];
        let verificationToken = '';

        const submission = {
            idApiKey: parseInt(this.btnSubmit.getAttribute('idapikey'))
        }

        new FormData(this.form).forEach((value, key) => {
            if (key === '__RequestVerificationToken')
                verificationToken = value;
            else
                submission[key] = value.trim();
        })

        if (!submission.idApiKey || isNaN(submission.idApiKey))
            errors.push('Can not identify API key');

        if (!submission.name || submission.name === '')
            errors.push('Name is required');

        if (!submission.allowedHost || submission.allowedHost === '')
            submission.allowedHost = null;

        if (errors.length > 0) {
            let result = 'Can not edit API key because of invalid data:\n';

            for (const e of errors)
                result += e + '\n';

            return null;
        }

        return [submission, verificationToken];
    }
}

export default EditApiKeyFormHandler;