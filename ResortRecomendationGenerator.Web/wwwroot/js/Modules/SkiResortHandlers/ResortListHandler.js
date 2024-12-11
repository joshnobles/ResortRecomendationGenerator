import createElement from '../Helpers/CreateElement.js';
import ApiKey from '../Helpers/ApiKey.js';

class ResortListHandler {
    constructor() {
        this.txtResortSearch = document.querySelector('#TxtResortSearch');
        this.resortListContainer = document.querySelector('#ResortListContainer');

        this.resortList = [];

        this.getResorts().then(() => {
            this.populateResortContainer();
            this.addEventListeners();
        });
    }

    getResorts = async () => {
        try {
            this.resortList = [];

            const res = await fetch(`/api/SkiResort/?key=${ApiKey}`);

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            for (const resort of json)
                this.resortList.push({ idSkiResort: resort.idSkiResort, name: resort.name });
        }
        catch (e) {
            alert(e);
        }
    }

    populateResortContainer = () => {
        document.querySelector('#ResortListContainer').innerHTML = '';

        let searchResults;

        if (this.txtResortSearch.value !== '')
            searchResults = this.resortList.filter(r => r.name.toLowerCase().includes(this.txtResortSearch.value.trim().toLowerCase()));
        else
            searchResults = this.resortList;

        let row;
        let col;
        let span;
        let btn;

        for (const resort of searchResults) {
            row = createElement('div', { class: 'row mt-1 rounded fs-4 text-center resort-list-item' });

            col = createElement('div', { class: 'col-8' });

            span = createElement('span', { class: 'text-dark', textContent: resort.name })

            col.appendChild(span);
            row.appendChild(col);

            col = createElement('div', { class: 'col-2 pb-1' });

            btn = createElement('button', { type: 'button', class: 'btn btn-info', textContent: 'Edit', 'data-bs-toggle': 'modal', 'data-bs-target': '#EditResortModal' });
             
            btn.addEventListener('click', () => {
                const editForm = document.querySelector('#EditResortForm');
                
                editForm.dispatchEvent(new CustomEvent('opened', { detail: resort.idSkiResort }));
            });

            col.appendChild(btn);
            row.appendChild(col);

            col = createElement('div', { class: 'col-2 pb-1' });

            btn = createElement('button', { type: 'button', class: 'btn btn-danger', textContent: 'Delete' });

            btn.addEventListener('click', () => { this.deleteResort(resort.idSkiResort); });

            col.appendChild(btn);
            row.appendChild(col);

            this.resortListContainer.appendChild(row);
        }
    }

    deleteResort = async (idSkiResort) => {
        try {
            if (!confirm('Are you sure you want to delete this resort?'))
                return;

            const verificationToken = this.resortListContainer.parentElement
                .querySelector('[name=__RequestVerificationToken]').value;

            const options = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': verificationToken
                },
                body: JSON.stringify(idSkiResort)
            }

            const res = await fetch(`?handler=SkiResort`, options);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            this.resortListContainer.dispatchEvent(new Event('refresh'));

            alert('Successfully Deleted Resort');
        }
        catch (e) {
            if (e.message == 404)
                alert('Ski resort not found');
            else
                alert('There was an error deleting the ski resort');
        }
    }

    addEventListeners = () => {
        this.txtResortSearch.addEventListener('keyup', this.populateResortContainer);

        this.resortListContainer.addEventListener('refresh', async () => {
            await this.getResorts();
            this.populateResortContainer();
        });
    }

}

export default ResortListHandler;