// Web shim for react-native-maps (not supported on web)
const { View } = require('react-native');

const MapView = View;
MapView.Marker = View;
MapView.Polyline = View;
MapView.Circle = View;
MapView.Polygon = View;

module.exports = MapView;
module.exports.default = MapView;
module.exports.Marker = View;
module.exports.Polyline = View;
module.exports.Circle = View;
module.exports.Polygon = View;
module.exports.PROVIDER_GOOGLE = null;
module.exports.PROVIDER_DEFAULT = null;
