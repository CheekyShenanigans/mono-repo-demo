// host/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");

const cssLoaderRule = { test: /\.css$/, use: 'css-loader' }
const imageLoaderRule = {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    };

module.exports = {
  entry: "./src/index",
  mode: "production",
  devServer: {
    static: './dist',
    port: 3000,
  },
  module: {
    rules: [
      cssLoaderRule,
      imageLoaderRule,
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
      name: "Host",
      remotes: {
        Remote: `Remote@http://localhost:4000/moduleEntry.js`,
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // moduleFederationPlugin,
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  target: "web",
};
