;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var pip = require('point-in-polygon');

function getLls(p) {
    var o = [];
    for (var i = 0; i < p.length; i++) o[i] = [p[i].lng, p[i].lat];
    return o;
}

function loopPolygon(p, lls) {
    for(var i = 0; i < p.length; i++) {
        var polygon = p[i];
        if(polygon[0] instanceof L.LatLng){
            lls.push(getLls(polygon))
        } else {
            loopPolygon(polygon, lls)
        }
    }
    return lls
}

var leafletPip = {
    bassackwards: false,
    pointInLayer: function(p, layer, first) {
        'use strict';
        if (!(layer instanceof L.GeoJSON)) throw new Error('must be L.GeoJSON');
        if (p instanceof L.LatLng) p = [p.lng, p.lat];
        if (leafletPip.bassackwards) p.reverse();
        var results = [];
        layer.eachLayer(function(l) {
            if (first && results.length) return;
            var polygons = l.getLatLngs()
            var lls = loopPolygon(polygons, [])
            for (var i = 0; i < lls.length; i++) {
                if (pip(p, lls[i])) results.push(l);
            }
        });
        return results;
    }
};

module.exports = leafletPip;

},{"point-in-polygon":2}],2:[function(require,module,exports){
module.exports = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

},{}],3:[function(require,module,exports){
var leafletPip = require('../'),
    map = L.map('map').setView([37.8, -96], 4),
    gjLayer = L.geoJson(statesData);

L.tileLayer('http://a.tiles.mapbox.com/v3/tmcw.map-l1m85h7s/{z}/{x}/{y}.png')
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

},{"../":1}]},{},[3])
;