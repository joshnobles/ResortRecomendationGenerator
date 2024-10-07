import ApiKey from '../Modules/ApiKey.js';

class AddResortFormHandler {
    constructor() {

        this.txtNewResortName = document.querySelector('#TxtNewResortName');
        this.txtNewResortElevation = document.querySelector('#TxtNewResortElevation');

        this.txtNewResortTotalRuns = document.querySelector('#TxtNewResortTotalRuns');
        this.txtNewResortGreenPercent = document.querySelector('#TxtNewResortGreenPercent');
        this.txtNewResortBluePercent = document.querySelector('#TxtNewResortBluePercent');
        this.txtNewResortBlackPercent = document.querySelector('#TxtNewResortBlackPercent');
        this.txtNewResortTerrainParkNum = document.querySelector('#TxtNewResortTerrainParkNum');

        this.txtNewResortSnowmakingCoverage = document.querySelector('#TxtNewResortSnowmakingCoverage');
        this.txtNewResortSkiableAcres = document.querySelector('#TxtNewResortSkiableAcres');

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

            const res = await fetch(`/api/SkiResort/AddResort?key=${ApiKey}`, options);

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

        let totalRuns = parseFloat(this.txtNewResortTotalRuns.value.trim());
        let greenPercent = parseFloat(this.txtNewResortGreenPercent.value.trim());
        let bluePercent = parseFloat(this.txtNewResortBluePercent.value.trim());
        let blackPercent = parseFloat(this.txtNewResortBlackPercent.value.trim());
        let terrainParkNum = parseFloat(this.txtNewResortTerrainParkNum.value.trim());

        let snowmakingCoverage = parseFloat(this.txtNewResortSnowmakingCoverage.value.trim());
        let skiableAcres = parseFloat(this.txtNewResortSkiableAcres.value.trim());

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

        if (isNaN(totalRuns))
            errors.push('Total run count must be a number!');

        if (isNaN(greenPercent))
            errors.push('Green run percent must be a number!');

        if (isNaN(bluePercent))
            errors.push('Blue run percent must be a number!');

        if (isNaN(blackPercent))
            errors.push('Black run percent must be a number!');

        if (isNaN(terrainParkNum))
            errors.push('Terrain park count must be a number!');

        if (isNaN(snowmakingCoverage))
            errors.push('Snowmaking coverage must be a number!');

        if (isNaN(skiableAcres))
            errors.push('Skiable acres must be a number!');

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
            totalRuns: totalRuns,
            greenPercent: greenPercent,
            bluePercent: bluePercent,
            blackPercent: blackPercent,
            terrainParkNum: terrainParkNum,
            snowmakingCoverage: snowmakingCoverage,
            skiableAcres: skiableAcres,
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

        this.txtNewResortTotalRuns.value = '';
        this.txtNewResortGreenPercent.value = '';
        this.txtNewResortBluePercent.value = '';
        this.txtNewResortBlackPercent.value = '';
        this.txtNewResortTerrainParkNum.value = '';

        this.txtNewResortSnowmakingCoverage.value = '';
        this.txtNewResortSkiableAcres.value = '';

        this.txtNewResortNumNumLifts.value = '';

        this.chkNewResortNumIsEpicPass.checked = false;
        this.chkNewResortNumIsIkonPass.checked = false;
        this.chkNewResortNumIsIndyPass.checked = false;

        this.txtNewResortLatitude.value = '';
        this.txtNewResortLongitude.value = '';
    }

}

export default AddResortFormHandler;