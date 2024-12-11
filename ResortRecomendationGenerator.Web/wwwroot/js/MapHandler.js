import ApiKey from './Modules/Helpers/ApiKey.js';
import showErrorMessage from './Modules/Helpers/ShowErrorMessage.js';

const epicLayer = L.layerGroup(),
    ikonLayer = L.layerGroup(),
    indyLayer = L.layerGroup(),
    otherLayer = L.layerGroup();

const map = L.map('map', {
    center: [42.204469, -74.210372],
    zoom: 4,
    maxZoom: 19,
    layers: [epicLayer, ikonLayer, indyLayer, otherLayer]
});

const layers = {
    'Epic Pass': epicLayer,
    'Ikon Pass': ikonLayer,
    'Indy Pass': indyLayer,
    'No Pass': otherLayer
}

const layerControl = L.control.layers({}, layers).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

getSkiResorts([epicLayer, ikonLayer, indyLayer, otherLayer]);

async function getSkiResorts(layers) {
    try {
        const res = await fetch(`/api/SkiResort/?key=${ApiKey}`);

        if (!res.ok)
            throw new Error(res.status);

        const json = await res.json();

        const promises = [];

        for (const resort of json) {
            promises.push(new Promise(res => {
                let marker = L.marker([resort.latitude, resort.longitude]);
                let content = getPopupContent(resort);

                marker.bindPopup(content);

                if (resort.isEpicPass)
                    layers[0].addLayer(marker);
                else if (resort.isIkonPass)
                    layers[1].addLayer(marker);
                else if (resort.isIndyPass)
                    layers[2].addLayer(marker);
                else
                    layers[3].addLayer(marker);

                res();
            }));
        }

        await Promise.all(promises);
    }
    catch (e) {
        showErrorMessage('An error occurred getting the resort list');
    }
}

function getPopupContent(resort) {
    const result = `
        <div class="container w-100 p-0"">
            <div class="row">
                <div class="col-12">
                    <strong>${encodeHTML(resort.name)}</strong>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-12">
                    <span>${encodeHTML(resort.description)}</span>
                </div>
            </div>
        </div>
    `;

    return result;
}

function encodeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
