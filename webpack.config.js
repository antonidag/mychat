const path = require('path');

module.exports = {
  entry: './main.js', // Entry point for your JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false, // Disable processing of src attributes
        },
      }, 
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
        },
    },
    ],
  },
  mode: 'development', // Change to 'production' for production build
};
