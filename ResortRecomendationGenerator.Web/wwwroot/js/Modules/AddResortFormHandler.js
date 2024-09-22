class AddResortFormHandler {
    constructor() {

        this.txtNewResortName = document.querySelector('#TxtNewResortName');
        this.txtNewResortElevation = document.querySelector('#TxtNewResortElevation');
        this.txtNewResortNumGreenRuns = document.querySelector('#TxtNewResortNumGreenRuns');
        this.txtNewResortNumNumBlueRuns = document.querySelector('#TxtNewResortNumNumBlueRuns');
        this.txtNewResortNumNumBlackRuns = document.querySelector('#TxtNewResortNumNumBlackRuns');
        this.txtNewResortNumNumDubBlackRuns = document.querySelector('#TxtNewResortNumNumDubBlackRuns');
        this.txtNewResortNumNumLifts = document.querySelector('#TxtNewResortNumNumLifts');

        this.chkNewResortNumIsEpicPass = document.querySelector('#ChkNewResortNumIsEpicPass');
        this.chkNewResortNumIsIkonPass = document.querySelector('#ChkNewResortNumIsIkonPass');
        this.chkNewResortNumIsIndyPass = document.querySelector('#ChkNewResortNumIsIndyPass');

        this.txtNewResortLatitude = document.querySelector('#TxtNewResortLatitude');
        this.txtNewResortLongitude = document.querySelector('#TxtNewResortLongitude');

        this.btnClearResortForm = document.querySelector('#BtnClearNewResortForm');
        this.btnSubmitResortForm = document.querySelector('#BtnSubmitNewResortForm');

        this.addEventListeners();

    }

    submitForm = async () => {
        const newResort = this.getValidValues();

        if (newResort == null)
            return;

        try {

            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newResort)
            }

            const res = await fetch('/api/SkiResort/AddResort', options);

            if (!res.ok)
                throw new Error(res.status);

            document.querySelector('#ResortListContainer').dispatchEvent(new Event('refresh'));

            this.clearForm();

            alert('Successfully added new resort!');
        }
        catch (e) {
            if (e.message == 400)
                alert('New Resort Had Invalid Data');
            else if (e.message == 409)
                alert('This Resort Already Exists');
        }
    }

    getValidValues = () => {

        const errors = [];

        let name = this.txtNewResortName.value.trim();
        let elevation = parseFloat(this.txtNewResortElevation.value.trim());
        let numGreen = parseFloat(this.txtNewResortNumGreenRuns.value.trim());
        let numBlue = parseFloat(this.txtNewResortNumNumBlueRuns.value.trim());
        let numBlack = parseFloat(this.txtNewResortNumNumBlackRuns.value.trim());
        let numDubBlack = parseFloat(this.txtNewResortNumNumDubBlackRuns.value.trim());
        let numLifts = parseFloat(this.txtNewResortNumNumLifts.value.trim());

        let isEpic = this.chkNewResortNumIsEpicPass.checked;
        let isIkon = this.chkNewResortNumIsIkonPass.checked;
        let isIndy = this.chkNewResortNumIsIndyPass.checked;

        let latitude =  parseFloat(this.txtNewResortLatitude.value.trim());
        let longitude = parseFloat(this.txtNewResortLongitude.value.trim());

        if (name === '')
            errors.push('Resort name is required!');
        if (name.length > 50)
            errors.push('Resort name cannot be longer than 50 characters!');

        if (isNaN(elevation))
            errors.push('Elevation must be a number!');

        if (isNaN(numGreen))
            errors.push('Green run count must be a number!');

        if (isNaN(numBlue))
            errors.push('Blue run count must be a number!');

        if (isNaN(numBlack))
            errors.push('Black run count must be a number!');

        if (isNaN(numDubBlack))
            errors.push('Double black run count must be a number!');

        if (isNaN(numLifts))
            errors.push('Lift count must be a number!');

        if (isNaN(latitude))
            errors.push('Latitude must be a number!');

        if (isNaN(longitude))
            errors.push('Longitude must be a number!');

        if (errors.length != 0) {
            let result = 'New Resort Had Invalid Data: \n';

            for (const e of errors)
                result += e + '\n';

            alert(result);

            return null;
        }

        return {
            name: name,
            elevation: elevation,
            numGreenRuns: numGreen,
            numBlueRuns: numBlue,
            numBlackRuns: numBlack,
            numDubBlackRuns: numDubBlack,
            numLifts: numLifts,
            isEpicPass: isEpic,
            isIkonPass: isIkon,
            isIndyPass: isIndy,
            latitude: latitude,
            longitude: longitude
        }
    }

    addEventListeners = () => {

        this.btnClearResortForm.addEventListener('click', this.clearForm);

        this.btnSubmitResortForm.addEventListener('click', this.submitForm);

    }

    clearForm = () => {
        this.txtNewResortName.value = '';
        this.txtNewResortElevation.value = '';
        this.txtNewResortNumGreenRuns.value = '';
        this.txtNewResortNumNumBlueRuns.value = '';
        this.txtNewResortNumNumBlackRuns.value = '';
        this.txtNewResortNumNumDubBlackRuns.value = '';
        this.txtNewResortNumNumLifts.value = '';

        this.chkNewResortNumIsEpicPass.checked = false;
        this.chkNewResortNumIsIkonPass.checked = false;
        this.chkNewResortNumIsIndyPass.checked = false;

        this.txtNewResortLatitude.value = '';
        this.txtNewResortLongitude.value = '';
    }

}

export default AddResortFormHandler;