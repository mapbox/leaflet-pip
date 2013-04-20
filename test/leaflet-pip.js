if (typeof require !== 'undefined') {
    expect = require('expect.js');
    leafletPip = require('../');
}

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

describe('Leaflet Point in Polygon', function() {
    describe('simple polygon', function() {
        it('should find a point in a layer', function() {
            var gjLayer = L.geoJson(gj), poly;
            gjLayer.eachLayer(function(l) { poly = l; });
            expect(leafletPip.pointInLayer([50, 50], gjLayer)).to.eql([poly]);
        });
        it('should not find a point outside', function() {
            var gjLayer = L.geoJson(gj);
            expect(leafletPip.pointInLayer([50, 150], gjLayer)).to.eql([]);
        });
    });
    describe('error handling', function() {
        it('should throw an error if the argument is not right', function() {
            expect(function() {
                leafletPip.pointInLayer([50, 150], {});
            }).to.throwException(/must be L\.GeoJSON/);
        });
    });
    describe('accept first', function() {
        it('will find all in a stack', function() {
            var res = leafletPip.pointInLayer([50, 50], stackLayer);
            expect(res.length).to.eql(10000);
        });
        it('will accept the first in a layer of many if first is true', function() {
            var res = leafletPip.pointInLayer([50, 50], stackLayer, true);
            expect(res.length).to.eql(1);
        });
    });
});
