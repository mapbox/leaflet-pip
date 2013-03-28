all: leaflet-pip.js leaflet-pip.min.js site/bundle.js

leaflet-pip.js: index.js package.json
	browserify -s leafletPip index.js > leaflet-pip.js

leaflet-pip.min.js: leaflet-pip.js
	uglifyjs leaflet-pip.js -c > leaflet-pip.min.js

site/bundle.js: site/site.js leaflet-pip.min.js
	browserify site/site.js > site/bundle.js
