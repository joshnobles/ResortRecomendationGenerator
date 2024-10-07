import ApiKey from '../Modules/ApiKey.js';

class EditResortFormHandler {
    constructor() {

        this.form = document.querySelector('#EditResortForm');

        this.txtEditResortName = document.querySelector('#TxtEditResortName');
        this.txtEditResortElevation = document.querySelector('#TxtEditResortElevation');

        this.txtEditResortTotalRuns = document.querySelector('#TxtEditResortTotalRuns');
        this.txtEditResortGreenPercent = document.querySelector('#TxtEditResortGreenPercent');
        this.txtEditResortBluePercent = document.querySelector('#TxtEditResortBluePercent');
        this.txtEditResortBlackPercent = document.querySelector('#TxtEditResortBlackPercent');
        this.txtEditResortTerrainParkNum = document.querySelector('#TxtEditResortTerrainParkNum');

        this.txtEditResortSnowmakingCoverage = document.querySelector('#TxtEditResortSnowmakingCoverage');
        this.txtEditResortSkiableAcres = document.querySelector('#TxtEditResortSkiableAcres');

        this.txtEditResortNumNumLifts = document.querySelector('#TxtEditResortNumNumLifts');

        this.chkEditResortNumIsEpicPass = document.querySelector('#ChkEditResortNumIsEpicPass');
        this.chkEditResortNumIsIkonPass = document.querySelector('#ChkEditResortNumIsIkonPass');
        this.chkEditResortNumIsIndyPass = document.querySelector('#ChkEditResortNumIsIndyPass');

        this.txtEditResortLatitude = document.querySelector('#TxtEditResortLatitude');
        this.txtEditResortLongitude = document.querySelector('#TxtEditResortLongitude');

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
            console.log(json);
            this.populateForm(json);
        }
        catch (e) {
            console.log(e.message);
        }
    }

    submitForm = async () => {
        try {
            const editedResort = this.getValidValues();

            if (editedResort === null)
                return;

            const options = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedResort)
            }
            
            const res = await fetch(`/api/SkiResort/EditResort?key=${ApiKey}`, options);

            if (!res.ok)
                throw new Error(res.status);

            alert('Successfully edited resort!');

            this.clearForm();

            document.querySelector('#ResortListContainer').dispatchEvent(new Event('refresh'));
        }
        catch (e) {
            console.log(e.message);
        }
    }

    populateForm = resort => {
        this.txtEditResortName.value = resort.name;
        this.txtEditResortElevation.value = resort.elevation;

        this.txtEditResortTotalRuns.value = resort.totalRuns;
        this.txtEditResortGreenPercent.value = resort.greenPercent;
        this.txtEditResortBluePercent.value = resort.bluePercent;
        this.txtEditResortBlackPercent.value = resort.blackPercent;
        this.txtEditResortTerrainParkNum.value = resort.terrainParkNum;

        this.txtEditResortSnowmakingCoverage.value = resort.snowmakingCoverage;
        this.txtEditResortSkiableAcres.value = resort.skiableAcres;

        this.txtEditResortNumNumLifts.value = resort.numLifts;

        this.chkEditResortNumIsEpicPass.checked = resort.isEpicPass;
        this.chkEditResortNumIsIkonPass.checked = resort.isIkonPass;
        this.chkEditResortNumIsIndyPass.checked = resort.isIndyPass;

        this.txtEditResortLatitude.value = resort.latitude;
        this.txtEditResortLongitude.value = resort.longitude;

        this.btnSubmitResortForm.setAttribute('idskiresort', resort.idSkiResort);
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

        let idSkiResort = parseInt(this.btnSubmitResortForm.getAttribute('idskiresort'));

        let name = this.txtEditResortName.value.trim();
        let elevation = parseFloat(this.txtEditResortElevation.value.trim());
        let totalRuns = parseFloat(this.txtEditResortTotalRuns.value.trim());
        let greenPercent = parseFloat(this.txtEditResortGreenPercent.value.trim());
        let bluePercent = parseFloat(this.txtEditResortBluePercent.value.trim());
        let blackPercent = parseFloat(this.txtEditResortBlackPercent.value.trim());
        let terrainParkNum = parseFloat(this.txtEditResortTerrainParkNum.value.trim());

        let snowmakingCoverage = parseFloat(this.txtEditResortSnowmakingCoverage.value.trim());
        let skiableAcres = parseFloat(this.txtEditResortSkiableAcres.value.trim());

        let numLifts = parseFloat(this.txtEditResortNumNumLifts.value.trim());

        let isEpic = this.chkEditResortNumIsEpicPass.checked;
        let isIkon = this.chkEditResortNumIsIkonPass.checked;
        let isIndy = this.chkEditResortNumIsIndyPass.checked;

        let latitude = parseFloat(this.txtEditResortLatitude.value.trim());
        let longitude = parseFloat(this.txtEditResortLongitude.value.trim());

        if (isNaN(idSkiResort))
            errors.push('There was an error getting the resorts id!');

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
            idSkiResort: idSkiResort,
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

    clearForm = () => {
        this.txtEditResortName.value = '';
        this.txtEditResortElevation.value = '';

        this.txtEditResortTotalRuns.value = '';
        this.txtEditResortGreenPercent.value = '';
        this.txtEditResortBluePercent.value = '';
        this.txtEditResortBlackPercent.value = '';
        this.txtEditResortTerrainParkNum.value = '';

        this.txtEditResortSnowmakingCoverage.value = '';
        this.txtEditResortSkiableAcres.value = '';

        this.txtEditResortNumNumLifts.value = '';

        this.chkEditResortNumIsEpicPass.checked = false;
        this.chkEditResortNumIsIkonPass.checked = false;
        this.chkEditResortNumIsIndyPass.checked = false;

        this.txtEditResortLatitude.value = '';
        this.txtEditResortLongitude.value = '';

        this.btnSubmitResortForm.removeAttribute('idskiresort');
    }

}

export default EditResortFormHandler;