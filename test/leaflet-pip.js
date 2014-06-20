var L = require('leaflet'),
    test = require('tape'),
    leafletPip = require('../');

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

var stackLayer = L.geoJson(stack);

test('should find a point in a layer', function(t) {
    var gjLayer = L.geoJson(gj), poly;
    gjLayer.eachLayer(function(l) { poly = l; });
    t.deepEqual(leafletPip.pointInLayer([50, 50], gjLayer), [poly]);
    t.end();
});

test('should not find a point outside', function(t) {
    var gjLayer = L.geoJson(gj);
    t.deepEqual(leafletPip.pointInLayer([50, 150], gjLayer), []);
    t.end();
});

test('should throw an error if the argument is not right', function(t) {
    t.throws(function() {
        leafletPip.pointInLayer([50, 150], {});
    });
    t.end();
});

test('will find all in a stack', function(t) {
    var res = leafletPip.pointInLayer([50, 50], stackLayer);
    t.equal(res.length, 10000);
    t.end();
});

test('will accept the first in a layer of many if first is true', function(t) {
    var res = leafletPip.pointInLayer([50, 50], stackLayer, true);
    t.equal(res.length, 1);
    t.end();
});
