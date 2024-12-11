import emptyFormInputs from "../Helpers/EmptyFormInputs.js";
import ApiKey from "../Helpers/ApiKey.js";

class EditResortFormHandler {
    constructor() {
        this.modal = new bootstrap.Modal(document.querySelector('#EditResortModal'));

        this.form = document.querySelector('#EditResortForm');

        this.btnClearResortForm = document.querySelector('#BtnClearEditResortForm');
        this.btnSubmitResortForm = document.querySelector('#BtnSubmitEditResortForm');

        this.addEventListeners();
    }

    getResort = async idSkiResort => {
        try {
            const res = await fetch(`/api/SkiResort/${idSkiResort}?key=${ApiKey}`);

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();
            this.populateForm(json);
        }
        catch (e) {
            if (e.message == 404)
                alert('Ski resort not found');
            else
                alert('There was an error getting the resort');

            this.modal.hide()
        }
    }

    submitForm = async () => {
        try {
            const formData = this.getValidValues();

            if (formData === null)
                return;

            const verificationToken = formData[0];
            const editedResort = formData[1];

            const options = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(editedResort)
            }
            console.log(options);
            const res = await fetch('?handler=UpdateResort', options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            alert('Successfully edited resort!');

            this.clearForm();

            document.querySelector('#ResortListContainer').dispatchEvent(new Event('refresh'));
        }
        catch (e) {
            if (e.message == 400)
                alert('Invalid data');
            else if (e.message == 404)
                alert('Could not identify ski resort');
            else
                alert('There was an error editing the resort');
        }
    }

    populateForm = resort => {
        for (const key in resort) {
            if (key === 'idSkiResort') {
                this.btnSubmitResortForm.setAttribute('idskiresort', resort[key]);
                continue;
            }

            const element = this.form.querySelector(`[name=${key}]`);

            if (element['type'] === 'text' || element['type'] === 'number' || element['type'] === 'textarea')
                element.value = resort[key];
            else if (element['type'] === 'checkbox')
                element.checked = resort[key];
        }        
    }

    addEventListeners = () => {

        this.form.addEventListener('opened', event => {
            this.getResort(event.detail);
        })

        this.btnSubmitResortForm.addEventListener('click', this.submitForm);

        this.btnClearResortForm.addEventListener('click', this.clearForm);
    }

    getValidValues = () => {
        const errors = [];

        let verificationToken;

        const submission = {
            idSkiResort: parseInt(this.btnSubmitResortForm.getAttribute('idskiresort')),
            isEpicPass: false,
            isIkonPass: false,
            isIndyPass: false
        }

        new FormData(this.form).forEach((value, key) => {
            if (key == '__RequestVerificationToken')
                verificationToken = value;
            else if (key === 'isEpicPass' || key === 'isIkonPass' || key === 'isIndyPass')
                submission[key] = true;
            else
                submission[key] = value.trim();
        })

        for (const key in submission) {
            switch (key) {
                case 'name':
                    if (submission[key] === '')
                        errors.push('Resort name is required!');
                    if (submission[key] > 50)
                        errors.push('Resort name cannot be longer than 50 characters!');
                    break;
                case 'elevation':
                    const elevation = parseFloat(submission[key]);
                    if (isNaN(elevation))
                        errors.push('Elevation must be a number!');
                    else
                        submission[key] = elevation;
                    break;
                case 'totalRuns':
                    const totalRuns = parseFloat(submission[key]);
                    if (isNaN(totalRuns))
                        errors.push('Total run count must be a number!');
                    else
                        submission[key] = totalRuns;
                    break;
                case 'greenPercent':
                    const greenPercent = parseFloat(submission[key]);
                    if (isNaN(greenPercent))
                        errors.push('Green run percent must be a number!');
                    else
                        submission[key] = greenPercent;
                    break;
                case 'bluePercent':
                    const bluePercent = parseFloat(submission[key]);
                    if (isNaN(bluePercent))
                        errors.push('Blue run percent must be a number!');
                    else
                        submission[key] = bluePercent;
                    break;
                case 'blackPercent':
                    const blackPercent = parseFloat(submission[key]);
                    if (isNaN(blackPercent))
                        errors.push('Black run percent must be a number!');
                    else
                        submission[key] = blackPercent;
                    break;
                case 'terrainParkNum':
                    const terrainParkNum = parseFloat(submission[key]);
                    if (isNaN(terrainParkNum))
                        errors.push('Terrain park count must be a number!');
                    else
                        submission[key] = terrainParkNum;
                    break;
                case 'snowmakingCoverage':
                    const snowmakingCoverage = parseFloat(submission[key]);
                    if (isNaN(snowmakingCoverage))
                        errors.push('Snowmaking coverage must be a number!');
                    else
                        submission[key] = snowmakingCoverage;
                    break;
                case 'skiableAcres':
                    const skiableAcres = parseFloat(submission[key]);
                    if (isNaN(skiableAcres))
                        errors.push('Skiable acres must be a number!');
                    else
                        submission[key] = skiableAcres;
                    break;
                case 'numLifts':
                    const numLifts = parseFloat(submission[key]);
                    if (isNaN(numLifts))
                        errors.push('Lift count must be a number!');
                    else
                        submission[key] = numLifts;
                    break;
                case 'description':
                    if (!submission[key])
                        errors.push('description is required');
                    else if (submission[key].length > 99)
                        errors.push('description can not be longer than 99 characters');
                    break;
                case 'latitude':
                    const latitude = parseFloat(submission[key]);
                    if (isNaN(latitude))
                        errors.push('Latitude must be a number!');
                    else
                        submission[key] = latitude;
                    break;
                case 'longitude':
                    const longitude = parseFloat(submission[key]);
                    if (isNaN(longitude))
                        errors.push('Longitude must be a number!');
                    else
                        submission[key] = longitude;
            }
        }

        if (errors.length != 0) {
            let result = 'New Resort Had Invalid Data: \n';

            for (const e of errors)
                result += e + '\n';

            alert(result);

            return null;
        }

        return [verificationToken, submission];
    }

    clearForm = () => {
        emptyFormInputs(this.form);

        this.btnSubmitResortForm.removeAttribute('idskiresort');

        this.modal.hide();
    }

}

export default EditResortFormHandler;