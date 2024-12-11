import showErrorMessage from '../Helpers/ShowErrorMessage.js';
import createElement from '../Helpers/CreateElement.js';

class PotentialResortListHandler {
    constructor() {
        this.container = document.querySelector('#PotentialResortListContainer');

        this.resortList = [];

        this.getResorts()
            .then(this.populateResortContainer);

        this.container.addEventListener('refresh', () => this.getResorts().then(this.populateResortContainer));
    }

    getResorts = async () => {
        try {
            this.resortList = [];

            const res = await fetch('?handler=PotentialResorts');

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();
            this.resortList = json;
        }
        catch (e) {
            showErrorMessage("Could not get potential resorts");
        }
    }

    populateResortContainer = () => {
        this.container.textContent = '';

        let row,
            col,
            span,
            btn;

        if (this.resortList.length === 0) {
            let row = createElement('div', { class: 'row mt-2' });
            let h3 = createElement('div', { class: 'col-12 text-muted', textContent: 'No Potential Resorts' });

            row.appendChild(h3);
            this.container.appendChild(row);

            return;
        }

        for (const r of this.resortList) {
            row = createElement('div', { class: 'row mt-1 rounded fs-4 text-center resort-list-item' });

            col = createElement('div', { class: 'col-8' });

            span = createElement('span', { class: 'text-dark', textContent: r.name })

            col.appendChild(span);
            row.appendChild(col);

            col = createElement('div', { class: 'col-2 pb-1' });

            btn = createElement('button', { type: 'button', class: 'btn btn-info', textContent: 'Review', 'data-bs-toggle': 'modal', 'data-bs-target': '#PotentialResortModal' });

            btn.addEventListener('click', () => {
                document
                    .querySelector('#PotentialResortModalBody')
                    .dispatchEvent(new CustomEvent('opened', { detail: r.idPotentialSkiResort }));
            });

            col.appendChild(btn);
            row.appendChild(col);

            this.container.appendChild(row);
        }

    }

}

export default PotentialResortListHandler;