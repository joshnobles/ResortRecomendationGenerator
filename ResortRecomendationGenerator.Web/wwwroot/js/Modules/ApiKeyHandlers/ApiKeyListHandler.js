import createElement from '../Helpers/CreateElement.js';

class ApiKeyListHandler {
    constructor() {
        this.container = document.querySelector('#ApiKeyListContainer');

        this.container.addEventListener('refresh', this.getApiKeyList);

        this.getApiKeyList();
    }

    getApiKeyList = async () => {
        try {
            this.container.textContent = '';

            const res = await fetch(`?handler=AccountKeys`);

            if (res.redirected) {
                location.replace(res.url);
                return;
            }

            if (!res.ok)
                throw new Error(res.status);

            const json = await res.json();

            if (json.length === 0) {
                let row = createElement('div', { class: 'row mt-2' });
                let h3 = createElement('div', { class: 'col-12 text-muted' });

                row.appendChild(h3);
                this.container.appendChild(row);

                return;
            }

            let row = createElement('div', { class: 'row' });
            let col = createElement('div', { class: 'col-2' });
            let strong = createElement('strong', { textContent: 'Name' });

            col.appendChild(strong);
            row.appendChild(col);

            col = createElement('div', { class: 'col-4' });
            strong = createElement('strong', { textContent: 'Value' });

            col.appendChild(strong);
            row.appendChild(col);

            col = createElement('div', { class: 'col-4' });
            strong = createElement('strong', { textContent: 'Allowed Host' });

            col.appendChild(strong);
            row.appendChild(col);

            col = createElement('div', { class: 'col-2' });

            row.appendChild(col);

            this.container.appendChild(row);

            for (const key of json) {
                row = createElement('div', { class: 'row mt-2' });

                col = createElement('div', { class: 'col-2', textContent: key.name });

                row.appendChild(col);

                col = createElement('div', { class: 'col-4', textContent: key.value });

                row.appendChild(col);

                if (key.allowedHost == null)
                    col = createElement('div', { class: 'col-4 text-muted', textContent: 'All' });
                else
                    col = createElement('div', { class: 'col-4', textContent: key.allowedHost });

                row.appendChild(col);

                col = createElement('div', { class: 'col-2' });

                let btn = createElement('button', {
                    class: 'btn btn-primary',
                    type: 'button',
                    'data-bs-toggle': 'modal',
                    'data-bs-target': '#EditApiKeyModal',
                    textContent: 'Edit'
                });

                btn.addEventListener('click', () => {
                    document
                        .querySelector('#EditApiKeyForm')
                        .dispatchEvent(new CustomEvent('populate', { detail: key.idApiKey }));
                })

                col.appendChild(btn);
                row.appendChild(col);

                this.container.appendChild(row);
            }
        }
        catch (e) {
            alert('There was an error getting your API keys');
        }
    }

}

export default ApiKeyListHandler;