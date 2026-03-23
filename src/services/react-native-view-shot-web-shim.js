// Web shim for react-native-view-shot (not supported on web)
const { View } = require('react-native');
module.exports = View;
module.exports.default = View;
module.exports.captureRef = async () => '';
module.exports.captureScreen = async () => '';
