## point in polygon for Leaflet

A [Leaflet](http://leafletjs.com/)-friendly API for [point in polygon](http://en.wikipedia.org/wiki/Point_in_polygon)
operations, using [substack](https://github.com/substack)'s
[point in polygon](https://github.com/substack/point-in-polygon) library.

## install

With browserify

    npm install leaflet-pip

Otherwise copy `leaflet-pip.min.js`.

## example

```
var gjLayer = L.geoJson(statesData);
var results = leafletPip.pointInLayer([-88, 38], gjLayer);
// results is an array of L.Polygon objects containing that point
```

## api

### `leafletPip.pointInLayer(point, layer L.GeoJSON)`

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

### `leafletPip.bassackwards`

Leaflet treats literate coordinate arrays as `[lat, lon]`, unlike GeoJSON
and [any true scotsman](http://en.wikipedia.org/wiki/No_true_Scotsman). `leaflet-pip`
treats literate coordinate arrays as `[lon, lat]`, but if you set `bassackwards`
to true, it'll do things the Leaflet/Google Maps API way.
