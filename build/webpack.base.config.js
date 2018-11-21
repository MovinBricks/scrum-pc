const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var echartsName = require('echarts/lib/echarts');
// 引入k线图
require('echarts/lib/chart/candlestick');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/legend") //官网没有加这句话，导致报错


const { VueLoaderPlugin } = require('vue-loader');
const resolve = file => path.resolve(__dirname, file);

const isProd = process.env.NODE_ENV === 'production';

// TODO:打包结构未整理，待重写，做拆包
module.exports = {
    devtool: isProd
        ? false
        : '#cheap-module-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js',
    },
    resolve: {
        modules: [path.resolve(__dirname, 'client'), 'node_modules'],
        extensions: ['.js', '.vue'],
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: ExtractTextPlugin.extract({
                            fallback: 'vue-style-loader',
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: { minimize: true },
                                },
                                {
                                    loader: 'postcss-loader?sourceMap',
                                    options: {
                                        plugins: () => [autoprefixer({
                                            browsers: ['last 2 versions']
                                        })]
                                    }
                                },
                                'sass-loader'
                            ]
                        }),
                    },
                    compilerOptions: {
                        preserveWhitespace: false,
                    },
                    cssModules: {
                        localIdentName: '[path][name]---[local]---[hash:base64:5]',
                        camelCase: true
                    },
                    extractCSS: true
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                include: [resolve('../client/icons')],
                loader: 'url-loader?name=icons/[name].[md5:hash:hex:7].[ext]',
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                exclude: [resolve('../client/icons')],
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.(sc|c)ss$/,
                // extract css file from js file, that will reduce the js file size and optimize page loading.
                use: isProd
                    ? ExtractTextPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: { minimize: true },
                            },
                            'sass-loader'
                        ]
                    })
                    : ['vue-style-loader', 'css-loader', 'sass-loader']
            },
        ],
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false,
    },
    plugins: (isProd
        ? [
            new VueLoaderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ]
        : [
            new VueLoaderPlugin(),
            new FriendlyErrorsPlugin(),
        ]).concat([
            new ExtractTextPlugin('style-[contenthash:8].css'),
        ]),
};
