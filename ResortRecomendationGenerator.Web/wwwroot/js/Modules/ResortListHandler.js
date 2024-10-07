import ApiKey from '../Modules/ApiKey.js';

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

            row = this.createElement('div', { class: 'row mt-1 rounded fs-4 text-center', id: 'ResortListItem' });

            col = this.createElement('div', { class: 'col-8' });

            span = this.createElement('span', { class: 'text-dark', textContent: resort.name })

            col.appendChild(span);
            row.appendChild(col);

            col = this.createElement('div', { class: 'col-2 pb-1' });

            btn = this.createElement('button', { type: 'button', class: 'btn btn-info', textContent: 'Edit', 'data-bs-toggle': 'modal', 'data-bs-target': '#EditResortModal' });
             
            btn.addEventListener('click', () => {
                const editForm = document.querySelector('#EditResortForm');
                
                editForm.dispatchEvent(new CustomEvent('opened', { detail: resort.idSkiResort }));
            });

            col.appendChild(btn);
            row.appendChild(col);

            col = this.createElement('div', { class: 'col-2 pb-1' });

            btn = this.createElement('button', { type: 'button', class: 'btn btn-danger', textContent: 'Delete' });

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

            const options = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }

            const res = await fetch(`/api/SkiResort/DeleteResort/${idSkiResort}?key=${ApiKey}`, options);

            if (!res.ok)
                throw new Error(res.status);

            this.resortListContainer.dispatchEvent(new Event('refresh'));

            alert('Successfully Deleted Resort');
        }
        catch (e) {
            console.log(e.message);
        }
    }

    createElement = (tagName, attributes) => {
        const element = document.createElement(tagName);

        for (let key in attributes) {
            if (key === 'textContent')
                element.textContent = attributes[key];
            else
                element.setAttribute(key, attributes[key]);
        }

        return element;
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