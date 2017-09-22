'use strict';

import { resolve } from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const
    extractSass    = new ExtractTextPlugin( './css/main.scss' ),
    extractAssests = new CopyWebpackPlugin( [ {
        from: './assets/',
        to: '../dist/assets/'
    } ] ),
    extractHtml    = new HtmlWebpackPlugin( {
        template: 'index.html',
        filename: '../dist/index.html'
    } ),
    includeModules = new webpack.ProvidePlugin( {
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: [ 'popper.js', 'default' ]
    } );

export default {
    context: resolve( __dirname, '../app' ),
    entry: {
        app: [ './js/index.js' ]
    },
    output: {
        path: resolve( __dirname, '../dist/' ),
        filename: 'js/bundle.js',
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
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require( 'precss' ),
                                    require( 'autoprefixer' )
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'file-loader?publicPath=../&name=/fonts/[name].[ext]'
                }
            },
            {
                test: /\.js/,
                loader: 'babel-loader',
                options: {
                    ignore: resolve( __dirname, 'node_modules/' )
                }
            }
        ]
    },
    plugins: [
        extractSass,
        extractAssests,
        extractHtml,
        includeModules
    ]
};