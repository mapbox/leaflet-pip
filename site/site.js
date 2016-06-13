var leafletPip = require('../'),
    map = L.map('map').setView([37.8, -96], 4),
    gjLayer = L.geoJson(statesData);

L.tileLayer('https://a.tiles.mapbox.com/v3/tmcw.map-l1m85h7s/{z}/{x}/{y}.png')
    .addTo(map);

gjLayer.addTo(map);

document.getElementById('me').onclick = function() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        var res = leafletPip.pointInLayer(
            [pos.coords.longitude, pos.coords.latitude], gjLayer);
        if (res.length) {
            document.getElementById('me').innerHTML = res[0].feature.properties.name;
        } else {
            document.getElementById('me').innerHTML = 'You aren\'t in America';
        }
    });
};
