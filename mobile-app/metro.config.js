const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add SVG support
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Add Node.js polyfills for packages like ws
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('stream-browserify'),
  // Add other Node.js core modules polyfills as needed
  // http: require.resolve('stream-http'),
  // https: require.resolve('https-browserify'),
  // zlib: require.resolve('browserify-zlib'),
  // path: require.resolve('path-browserify'),
};

module.exports = config;
