var pip = require('point-in-polygon');

function getLls(l) {
    var lls = l.getLatLngs(), o = [];
    for (var i = 0; i < lls.length; i++) o[i] = [lls[i].lng, lls[i].lat];
    return o;
}

var leafletPip = {
    bassackwards: false,
    pointInLayer: function(p, layer) {
        "use strict";
        if (!(layer instanceof L.GeoJSON)) throw 'Error must be L.GeoJSON';
        if (p instanceof L.LatLng) p = [p.lng, p.lat];
        if (leafletPip.bassackwards) p.reverse();

        var results = [];
        layer.eachLayer(function(l) {
            // multipolygon
            var lls = [];
            if (l instanceof L.MultiPolygon) {
                l.eachLayer(function(sub) { lls.push(getLls(sub)); });
            } else if (l instanceof L.Polygon) {
                lls.push(getLls(l));
            }
            for (var i = 0; i < lls.length; i++) {
                if (pip(p, lls[i])) results.push(l);
            }
        });
        return results;
    }
};

module.exports = leafletPip;
