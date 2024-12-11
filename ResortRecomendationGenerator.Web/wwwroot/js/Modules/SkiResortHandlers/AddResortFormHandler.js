import emptyFormInputs from "../Helpers/EmptyFormInputs.js";

class AddResortFormHandler {
    constructor() {        
        this.modal = new bootstrap.Modal(document.querySelector('#AddResortModal'));

        this.form = document.querySelector('#AddResortForm');

        this.btnSubmitResortForm = document.querySelector('#BtnSubmitNewResortForm');
        this.btnClearResortForm = document.querySelector('#BtnClearNewResortForm');
        
        this.addEventListeners();
    }

    submitForm = async () => {
        const formData = this.getValidValues();

        if (formData == null)
            return;

        const verificationToken = formData[0];
        const newResort = formData[1];

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(newResort)
            }

            const res = await fetch(`?handler=AddResort`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

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
            else
                alert('There was an error adding the new resort!');
        }
    }

    getValidValues = () => {
        const errors = [];

        let verificationToken;

        const submission = {
            isEpicPass: false,
            isIkonPass: false,
            isIndyPass: false
        };        

        new FormData(this.form).forEach((value, key) => {
            if (key === '__RequestVerificationToken')
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
                case 'image':
                    if (!submission[key])
                        errors.push('Resort image is required');
                    else if (submission[key].type.split('/')[0] !== 'image')
                        errors.push('File type must be an image');
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
        emptyFormInputs(this.form)

        this.modal.hide();
    }

    addEventListeners = () => {
        this.btnSubmitResortForm.addEventListener('click', this.submitForm);
        this.btnClearResortForm.addEventListener('click', this.clearForm);
    }

}

export default AddResortFormHandler;