const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'expo-sqlite') {
      return {
        filePath: path.resolve(__dirname, 'src/services/expo-sqlite-web-shim.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-maps') {
      return {
        filePath: path.resolve(__dirname, 'src/services/react-native-maps-web-shim.js'),
        type: 'sourceFile',
      };
    }
    if (moduleName === 'react-native-view-shot') {
      return {
        filePath: path.resolve(__dirname, 'src/services/react-native-view-shot-web-shim.js'),
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
