const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'backend/wwwroot/js'),
        filename: 'bundle.js',
        publicPath: '/', 
        clean: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|mp3|woff2?)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/styles.css'
        }),
        new webpack.ProvidePlugin({
            React: 'react'
        })
    ],
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, 'public'),
        },
        historyApiFallback: true,
        proxy: [{
            context: ['/api'],
            target: 'http://localhost:5095',
            secure: false,
            changeOrigin: true
        }],
        open: false
    },
    mode: 'development'
};