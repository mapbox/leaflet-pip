## point in polygon for Leaflet

A [Leaflet](http://leafletjs.com/)-friendly API for [point in polygon](http://en.wikipedia.org/wiki/Point_in_polygon)
operations, using [substack](https://github.com/substack)'s
[point in polygon](https://github.com/substack/point-in-polygon) library.

## install

With browserify

    npm install leaflet-pip

Otherwise copy `leaflet-pip.min.js`.

## api

`leafletPip.pointInLayer(point, layer L.GeoJSON)`

Point can be:

* A two-element array of `[lng, lat]`
* A `L.LatLng` object

Layer must be:

* A `L.geoJSON` layer

Returns:

An array of polygons in which the given point resides, an empty array if there
are none. The polygons are returned as direct sublayers, so they can include
MultiPolygons. You can call `pointInLayer` again on those if you want the
sub-polygon result.
