'use strict';

import { resolve } from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const
    extractSass    = new ExtractTextPlugin( './css/main.css' ),
    extractAssests = new CopyWebpackPlugin( [ {
        from: './assets/',
        to: '../dist/assets/'
    } ] );

export default {
    context: resolve( __dirname, '../app' ),
    entry: {
        app: [ './js/index.js' ]
    },
    output: {
        path: resolve( __dirname, '../dist' ),
        filename: './js/bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                include: resolve( __dirname, '../app/assets' )
            },
            {
                test: /\.scss$/,
                include: resolve( __dirname, '../app/css' ),
                use: extractSass.extract( {
                    fallback: 'style-loader',
                    use: [ 'css-loader', 'sass-loader' ]
                } )
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'file-loader?publicPath=../&name=/fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        extractSass,
        extractAssests
    ],
    devServer: {
        compress: true,
        port: 8080
    }
};