const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable the problematic node externals feature
config.resolver = config.resolver || {};
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Disable Metro's external dependencies handling that's causing the Windows path issue
config.watchFolders = [];

module.exports = config;