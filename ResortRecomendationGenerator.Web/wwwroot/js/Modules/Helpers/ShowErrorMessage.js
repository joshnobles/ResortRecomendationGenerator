import createElement from './CreateElement.js';

function showErrorMessage(msg) {
    const body = document.querySelector('#MainContainer');

    const alert = createElement('div', { class: 'alert alert-danger', role: 'alert', textContent: msg });

    body.insertBefore(alert, body.firstChild);

    setTimeout(() => body.removeChild(alert), 7500);
}

export default showErrorMessage;