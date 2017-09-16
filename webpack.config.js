const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const CompressionPlugin = require('compression-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', {loader: 'css-loader', options: {importLoaders: 2, localIdentName: 'purify_[hash:base64:5]',modules: true}}, 'postcss-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{loader: 'css-loader', options: { importLoaders: 2, localIdentName: 'purify_[hash:base64:5]'}}, 'postcss-loader', 'sass-loader'],
    publicPath: '../'
});
const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
        app: './src/js/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: cssConfig,
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name].[ext]',
                            limit: 10240
                        }
                    },
                    'image-webpack-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(woff2?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[ext]',
                        limit: 10240
                    }
                },
                exclude: [
                    /node_modules/,
                    /images/
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            title: 'React App Test'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].bundle.[contenthash].css',
            disable: !isProd,
            allChunks: true
        }),
        // new PurifyCSSPlugin({
        //     paths: glob.sync(path.join(__dirname, 'src/*.ejs')),
        //     purifyOptions:{
        //         whitelist: ['*purify*']
        //     },
        //     // minimize: true
        // }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|html|css)$/,
            threshold: 10240,
            minRatio: 0.8

        })

    ]
}