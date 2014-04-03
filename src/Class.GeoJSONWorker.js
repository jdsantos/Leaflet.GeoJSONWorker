/*
	Leaflet.GeoJSONWorker, a plugin that parses a textual geojson string with a webworker.
	
	https://github.com/jdsantos/LeafletGeoJSONWorker
	http://leafletjs.com
	
	Authors:	
	https://github.com/jdsantos | https://github.com/leoneljdias
*/

(function (window, document, undefined) {
    /*
     * Leaflet.label assumes that you have already included the Leaflet library.
     */

    L.geoJSONWorkerVersion = '0.0.1-dev';

    L.GeoJSONWorker = L.GeoJSON.extend({

        includes: L.Mixin.Events,

        initialize: function (geojson, options) {
            L.setOptions(this, options);

            this._layers = {};

            this._worker = null;

            if (geojson) {
                if (typeof geojson == "string") {
                    this.parseAddGeoJSON(geojson);
                } else {
                    L.GeoJSON.prototype.addData.call(this,geojson);
                }
            }
        },

        _callBaseAddData: function(geojson){
            L.GeoJSON.prototype.addData.call(this._worker.layerRef, geojson);
        },

        _onWorkerDoneMessage: function (response) {
            this.layerRef._callBaseAddData(response.data.result);
        },

        _onWorkerErrorMessage: function (response) {
        },

        parseAddGeoJSON: function (geojson) {
            this._worker = new Worker("/JSONWorker.js");
            this._worker.layerRef = this;
            this._worker.onmessage = this._onWorkerDoneMessage;
            this._worker.onerror = this._onWorkerErrorMessage;
            this._worker.postMessage(geojson);
        }
    });
})();

L.geoJsonWorker = function (geojson, options) {
    if (window.Worker) {
        return new L.GeoJSONWorker(geojson, options);
    } else {
        return new L.GeoJSON(geojson, options);
    }
};
