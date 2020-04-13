const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader,'css-loader'] },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [ new HtmlWebpackPlugin(
        {title:"SimplyNote",
            template: 'src/index.html',

        },
    ),
        new MiniCssExtractPlugin()
    ],
    devServer: {
        inline:true,
        port: 10000
    },
};