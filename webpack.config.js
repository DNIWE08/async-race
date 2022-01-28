const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // context: path.resolve(__dirname, 'src'),
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/index.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.scss', '.css'],
    // alias: {
    //   '@assets': path.resolve(__dirname, 'src/assets'),
    // }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader',
        options: {
            name: '[name].[ext]'
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./src/assets/favicon.ico",
      filename: './index.html',
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" },
      ],
    })
  ],
  devServer: {
    static: {
      publicPath: path.resolve(__dirname, './dist'),
    },
    port: 8080,
  },
}