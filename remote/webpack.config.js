// remote/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const config = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    static: './dist',
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "Remote",
      filename: "moduleEntry.js",
      exposes: {
        "./App": "./src/App",
        "./Button": "./src/Button",
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  target: "web",
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.mode = 'production';
  }

  return config;
};
