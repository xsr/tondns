const path = require("path"), CopyPlugin = require("copy-webpack-plugin"), HtmlWebpackPlugin = require("html-webpack-plugin"), PolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "app.js",
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html", publicPath: "./"}),
        new PolyfillPlugin(),
        new CopyPlugin({
            patterns: [
                {from: "public"}
            ]
        })
    ],
    module: {
        rules: [
            {
               test: /\.(js|jsx)$/,
               exclude: /node_modules/,
               use: {
                 loader: "babel-loader"
               }
             },
             {
               test: /\.css$/,
               use: ["style-loader", "css-loader"]
             },
        ]
    },
    devServer: {
        port: 2021,
        historyApiFallback: true,
        server: "http",
    },
    experiments: {
        asyncWebAssembly: true,
    },
}