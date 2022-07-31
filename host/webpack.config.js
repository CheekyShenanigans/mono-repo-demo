// host/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");

const cssLoaderRule = { test: /\.css$/, use: 'css-loader' }
const imageLoaderRule = {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    };



module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const remoteDomain = isProduction ? 'https://cheekyshenanigans.github.io/mono-repo-demo/remote' : 'http://localhost:4000'

  return {
    entry: "./src/index",
    mode: isProduction ? "production" : "development",
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
          Remote: `Remote@${remoteDomain}/moduleEntry.js`,
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
    ],
    resolve: {
      extensions: [".js", ".jsx"],
    },
    target: "web",
  };
};
