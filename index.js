'use strict';
var gju = require('geojson-utils');

function isPoly(l) {
    return l.feature &&
        l.feature.geometry &&
        l.feature.geometry.type &&
        ['Polygon', 'MultiPolygon'].indexOf(l.feature.geometry.type) !== -1;
}

var leafletPip = {
    bassackwards: false,
    pointInLayer: function(p, layer, first) {
        if (typeof p.lat === 'number') p = [p.lng, p.lat];
        else if (leafletPip.bassackwards) p = p.concat().reverse();

        var results = [];

        layer.eachLayer(function(l) {
            if (first && results.length) return;

            if (isPoly(l) && gju.pointInPolygon({
                type: 'Point',
                coordinates: p
            }, l.toGeoJSON().geometry)) {
                results.push(l);
            }
        });
        return results;
    }
};

module.exports = leafletPip;
