'use strict';
var test = require('tape');
var leafletPip = require('../');

var gj = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 100], [100, 100], [100, 0]]]
        }
    }]
};

var stack = {
    type: 'FeatureCollection',
    features: []
};

for (var i = 0; i < 10000; i++) {
    stack.features.push({
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 100], [100, 100], [100, 0]]]
        },
        properties: {
            i: i
        }
    });
}

[{
    version: '0.7.3',
    L: require('./leaflet-0.7.3')
}, {
    version: '1.0.2',
    L: require('./leaflet-1.0.2')
}].forEach(function (Leaflet) {

    var L = Leaflet.L;

    test('Leaflet ' + Leaflet.version, function(group) {

        var stackLayer = L.geoJson(stack);

        group.test('should find a point in a layer', function(t) {
            var gjLayer = L.geoJson(gj), poly;
            gjLayer.eachLayer(function(l) { poly = l; });
            t.deepEqual(leafletPip.pointInLayer([50, 50], gjLayer), [poly]);
            t.end();
        });

        group.test('should not find a point outside', function(t) {
            var gjLayer = L.geoJson(gj);
            t.deepEqual(leafletPip.pointInLayer([50, 150], gjLayer), []);
            t.end();
        });

        group.test('is fine with point features', function(t) {
            var gjLayer = L.geoJson({
                type: 'Point',
                coordinates: [0, 0]
            });
            t.deepEqual(leafletPip.pointInLayer([50, 150], gjLayer), []);
            t.end();
        });

        group.test('polygon with holes', function(t) {
            var gjLayer = L.geoJson({
                type: 'Polygon',
                coordinates: [
                    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
                ]
            });
            t.deepEqual(leafletPip.pointInLayer([100.49,0.50], gjLayer), []);
            t.deepEqual(leafletPip.pointInLayer([100.51,0.91], gjLayer).length, 1);
            t.end();
        });

        group.test('multipolygon', function(t) {
            var gjLayer = L.geoJson({
                type: 'MultiPolygon',
                coordinates: [[
                    [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0] ],
                    [ [100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2] ]
                ]]
            });
            t.deepEqual(leafletPip.pointInLayer([100.49,0.50], gjLayer), []);
            t.deepEqual(leafletPip.pointInLayer([100.51,0.91], gjLayer).length, 1);
            t.end();
        });

        group.test('should throw an error if the argument is not right', function(t) {
            t.throws(function() {
                leafletPip.pointInLayer([50, 150], {});
            });
            t.end();
        });

        group.test('will find all in a stack', function(t) {
            var res = leafletPip.pointInLayer([50, 50], stackLayer);
            t.equal(res.length, 10000);
            t.end();
        });

        group.test('will accept the first in a layer of many if first is true', function(t) {
            var res = leafletPip.pointInLayer([50, 50], stackLayer, true);
            t.equal(res.length, 1);
            t.end();
        });

        group.end();
    });
});
