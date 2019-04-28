const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        browsers: '> 1%, IE 11, not op_mini all, not dead',
      },
      useBuiltIns: 'usage',
      modules: false,
    },
  ],
];

module.exports = { presets };
