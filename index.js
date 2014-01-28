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
