const webpack = require('webpack');
const path = require('path');
const WebpackNotifier = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = {
    entry: {
        app: path.join(__dirname, './src/app.js')
    },
    output: {
        path: path.join(__dirname, './dist/'),
        filename: '[name].bundle.js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }, {
                test: /\.css$/,
                use: 'css-loader'
            }, {
                test: /\.(woff|woff2|ttf|svg|eot|png|jpg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            }, {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new ExtractTextPlugin('[name].bundle.css')
    ],
    resolve: {
        modules: ['node_modules', path.resolve('./src/client')],
        extensions: ['.js', '.json', '.scss', '.css']
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};

if (process.env.NODE_ENV === 'production') {
    const additionalPlugins = [
        new webpack.optimize.OccurrenceOrderPlugin(false),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    ];
    webpackConfig.plugins = webpackConfig.plugins.concat(additionalPlugins);
} else {
    webpackConfig.plugins.push(new WebpackNotifier());
    webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;