// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add .cjs extension support
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Enable package exports for modern ESM packages like make-plural
config.resolver.unstable_enablePackageExports = true;

// Provide polyfill for stream/web
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'stream/web': path.resolve(__dirname, 'metro.web-polyfills.js'),
};

module.exports = config;
