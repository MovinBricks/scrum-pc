const webpack = require('webpack');
const merge = require('webpack-merge');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.config');

const config = merge(base, {
    entry: {
        app: './client/entry-client.js',
        // vendor: ['vue', 'vue-router', 'vuex', 'vue-router-sync', 'axios']
    },
    plugins: [
        // strip dev-only code in Vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"',
        }),
        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module) {
                // a module is extracted into the vendor chunk if...
                return (
                    // it's inside node_modules
                    /node_modules/.test(module.context)
                    // and not a CSS and SCSS file (due to extract-text-webpack-plugin limitation)
                    && !/\.(css|scss)$/.test(module.request)
                );
            },
        }),
        new HtmlWebpackPlugin({
            favicon: './client/assets/favicon.ico'
        }),
        // extract webpack runtime & manifest to avoid vendor chunk hash changing
        // on every build.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new VueSSRClientPlugin(),
    ],
});

// if (process.env.NODE_ENV === 'production') {
//     config.plugins.concat([
//         // auto generate service worker
//         new SWPrecachePlugin({
//             cacheId: 'vue-hn',
//             filename: 'service-worker.js',
//             minify: true,
//             dontCacheBustUrlsMatching: /./,
//             staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
//             runtimeCaching: [
//                 {
//                     urlPattern: '/',
//                     handler: 'networkFirst',
//                 },
//             ],
//         }),
//     ]);
// }

module.exports = config;
