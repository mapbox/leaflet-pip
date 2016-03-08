/* global L */
'use strict';
var gju = require('geojson-utils');

var leafletPip = {
  bassackwards: false,
  pointInLayer: function(p, layer, first) {
    if (p instanceof L.LatLng) p = [p.lng, p.lat];
    else if (leafletPip.bassackwards) p = p.concat().reverse();

    var results = [];

    layer.eachLayer(function(l) {
      if (first && results.length) return;

      if (isPoly(l) &&
        gju.pointInPolygon({
          type:        'Point',
          coordinates: p
        }, l.toGeoJSON().geometry)) {
        results.push(l);
      }
    });
    return results;
  }
};

function isPoly(l) {
  if (L.MultiPolygon) {
    return (l instanceof L.MultiPolygon || l instanceof L.Polygon);
  } else {    //leaftletjs >= 1.0
    return (l.feature && l.feature.geometry && l.feature.geometry.type && -1 != ['Polygon', 'MultiPolygon'].indexOf(l.feature.geometry.type));
  }
}

module.exports = leafletPip;
