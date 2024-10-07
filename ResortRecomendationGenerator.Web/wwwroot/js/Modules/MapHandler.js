import ApiKey from '../Modules/ApiKey.js';

const epicLayer = L.layerGroup(),
    ikonLayer = L.layerGroup(),
    indyLayer = L.layerGroup(),
    otherLayer = L.layerGroup();

const map = L.map('map', {
    center: [40, 40],
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

getSkiResorts(map, [epicLayer, ikonLayer, indyLayer, otherLayer]);

async function getSkiResorts(map, layers) {
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
    catch {
        alert('An error occurred getting ski resorts');
    }
}

function getPopupContent(resort) {
    let result = '<div class="container text-center p-0">';

    result += '<div class="row">'
    result += '<strong class="col">Name</strong>';
    result += `<span class="col">${encodeHTML(resort.name)}</span>`
    result += '</div>';

    result += '<div class="row">'
    result += '<strong class="col">Elevation</strong>';
    result += `<span class="col">${encodeHTML(resort.elevation)}</span>`
    result += '</div>';

    result += '</div>';

    return result;
}

function encodeHTML(text) {
    let textArea = document.createElement('textarea');
    textArea.textContent = text;
    return textArea.innerHTML;
}
