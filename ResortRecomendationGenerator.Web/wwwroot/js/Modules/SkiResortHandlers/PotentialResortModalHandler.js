import showErrorMessage from '../Helpers/ShowErrorMessage.js';

class PotentialResortModalHandler {
    constructor() {
        this.modal = new bootstrap.Modal(document.querySelector('#PotentialResortModal'));

        this.modalHeader = document.querySelector('#PotentialResortHeading');

        this.modalBodyContainer = document.querySelector('#PotentialResortModalBody');

        this.modalBody = {
            idPotentialSkiResort: 0,
            elevation: document.querySelector('#PotentialResortElevation'),
            totalRuns: document.querySelector('#PotentialResortTotalRuns'),
            greenPercent: document.querySelector('#PotentialResortGreenPercent'),
            bluePercent: document.querySelector('#PotentialResortBluePercent'),
            blackPercent: document.querySelector('#PotentialResortBlackPercent'),
            terrainParkNum: document.querySelector('#PotentialResortTerrainParkNum'),
            snowmakingCoverage: document.querySelector('#PotentialResortSnowmakingCoverage'),
            skiableAcres: document.querySelector('#PotentialResortSkiableAcres'),
            numLifts: document.querySelector('#PotentialResortNumLifts'),
            isEpicPass: document.querySelector('#PotentialResortIsEpicPass'),
            isIkonPass: document.querySelector('#PotentialResortIsIkonPass'),
            isIndyPass: document.querySelector('#PotentialResortIsIndyPass'),
            description: document.querySelector('#PotentialResortDescription'),
            latitude: document.querySelector('#PotentialResortLatitude'),
            longitude: document.querySelector('#PotentialResortLongitude')
        }

        this.btnAccept = document.querySelector('#BtnAcceptPotentialResort');
        this.btnReject = document.querySelector('#BtnRejectPotentialResort');
        this.btnClear = document.querySelector('#BtnClearPotentialResortModal');

        this.addEventListeners();
    }

    getResort = async idPotentialResort => {
        try {
            const params = new URLSearchParams({
                handler: 'SpecificPotentialResort',
                idPotentialResort: idPotentialResort
            });

            const res = await fetch(`?${params}`);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            this.populateModal(json);
        }
        catch (e) {
            if (e.message == 404)
                showErrorMessage('Could not identify resort');
            else
                showErrorMessage('There was an error getting the potential resort');
        }
    }

    populateModal = resort => {
        this.modalHeader.textContent = resort.name;

        for (const key in this.modalBody) {
            if (key === 'idPotentialSkiResort')
                this.modalBody[key] = resort[key];
            else
                this.modalBody[key].textContent = resort[key];
        }
    }

    acceptResort = async () => {
        try {
            const verificationToken = this.getVerfifcationToken();

            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                }
            }

            const params = new URLSearchParams({
                handler: 'AcceptPotentialResort',
                idPotentialResort: this.modalBody['idPotentialSkiResort']
            });

            const res = await fetch(`?${params}`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            this.clearForm();

            alert('Successfully accepted resort');

            for (const e of [document.querySelector('#PotentialResortListContainer'), document.querySelector('#ResortListContainer')])
                e.dispatchEvent(new Event('refresh'));
        }
        catch (e) {
            if (e.message == 404)
                showErrorMessage('Could not find potential ski resort');
            else if (e.message == 409)
                showErrorMessage('This resort already exists, cannot accept');
            else
                showErrorMessage('There was an error accepting the potential ski resort');
        }
    }

    rejectResort = async () => {
        try {
            const verificationToken = this.getVerfifcationToken();

            const options = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                }
            }

            const params = new URLSearchParams({
                handler: 'RejectPotentialResort',
                idPotentialResort: this.modalBody['idPotentialSkiResort']
            });

            const res = await fetch(`?${params}`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            this.clearForm();
            alert('Successfully rejected potential resort');

            document.querySelector('#PotentialResortListContainer').dispatchEvent(new Event('refresh'));
        }
        catch (e) {
            if (e.message == 404)
                showErrorMessage('Could not identify potential resort');
            else
                showErrorMessage('There was an error rejected the potential resort');

            this.clearForm();
        }
    }

    clearForm = () => {
        for (const key in this.modalBody) {
            if (key === 'idPotentialSkiResort')
                this.modalBody[key] = 0;
            else
                this.modalBody[key].textContent = '';
        }

        this.modalHeader.textContent = '';

        this.modal.hide();
    }

    addEventListeners = () => {
        this.modalBodyContainer.addEventListener('opened', e => this.getResort(e.detail));

        this.btnClear.addEventListener('click', this.clearForm);

        this.btnAccept.addEventListener('click', this.acceptResort);

        this.btnReject.addEventListener('click', this.rejectResort);
    }

    getVerfifcationToken = () => this.modalBodyContainer.querySelector('input[name=__RequestVerificationToken]').value;

}

export default PotentialResortModalHandler;