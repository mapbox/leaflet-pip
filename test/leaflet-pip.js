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

describe('Leaflet Point in Polygon', function() {
  describe('simple polygon', function() {
      it('should find a point in a layer', function() {
          var gjLayer = L.geoJson(gj), poly;
          gjLayer.eachLayer(function(l) { poly = l; });
          expect(leafletPip.pointInLayer([50, 50], gjLayer)).to.eql([poly]);
      });
      it('should not find a point outside', function() {
          var gjLayer = L.geoJson(gj), poly;
          expect(leafletPip.pointInLayer([50, 150], gjLayer)).to.eql([]);
      });
  });
});
