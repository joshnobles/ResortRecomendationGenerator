class ResortListHandler {
    constructor() {
        this.txtResortSearch = document.querySelector('#TxtResortSearch');
        this.resortListContainer = document.querySelector('#ResortListContainer');

        this.resortList = [{}];

        this.getResorts().then(this.populateResortContainer);

        this.addEventListeners();
    }

    getResorts = async () => {
        try {
            const res = await fetch('/api/SkiResort/');

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            for (const resort of json)
                this.resortList.push({ id: resort.idSkiResort, name: resort.name });
        }
        catch (e) {
            alert(e);
        }
    }

    populateResortContainer = () => {
        this.resortListContainer.textContent = '';

        let row;
        let col;
        let span;

        let searchResults;

        if (this.txtResortSearch.value !== '')
            searchResults = this.resortList.filter(r => r.name.toLowerCase().includes(this.txtResortSearch.value.trim().toLowerCase()));
        else
            searchResults = this.resortList;

        for (const resort of searchResults) {

            row = this.createElement('div', { class: 'row mt-1' });

            col = this.createElement('div', { class: 'col-12' });

            span = this.createElement('span', { class: 'text-light', idskiresort: resort.idSkiResort, textContent: resort.name })

            col.appendChild(span);
            row.appendChild(col);

            this.resortListContainer.appendChild(row);
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

        this.resortListContainer.addEventListener('refresh', () => { this.getResorts().then(this.populateResortContainer) });

    }

}

export default ResortListHandler;