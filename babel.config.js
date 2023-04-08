const path = require('path');

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@babel/preset-env',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    ],
  ],
};
