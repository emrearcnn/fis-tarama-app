const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// TypeScript dosyalarını düzgün çözümlemek için
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Cache'i temizle
config.resetCache = true;

// Asset çözümleme
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'
];

// Transformer ayarları
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    mangle: false,
    keep_fnames: true,
  },
};

config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

module.exports = config; 