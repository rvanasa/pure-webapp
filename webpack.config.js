'use strict'

var webpack = require('webpack');

var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var WorkboxPlugin = require('workbox-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isBuild = ENV === 'build';

var srcPath = __dirname + '/www';
var destPath = __dirname + '/dist';

var config = {
	mode: isBuild ? 'production' : 'development',
	entry: {
		login: srcPath + '/app/login.js',
		webapp: srcPath + '/app/webapp.js',
	},
	output: {
		path: destPath,
		publicPath: '/',
		// filename: isBuild ? '[name].[hash].js' : '[name].bundle.js',
		// chunkFilename: isBuild ? '[name].[hash].js' : '[name].bundle.js',
		filename: 'bundle/[name].js',
		chunkFilename: 'bundle/[name].js',
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.scss$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader', {
				loader: 'postcss-loader',
				options: {
					plugins: () => [
						require('autoprefixer'),
					],
				},
			}, 'sass-loader'],
		}, {
			test: /\.html$/,
			use: 'html-loader',
		}, {
			test: /\.(png|jpg|ico)$/,
			use: 'file-loader',
		}],
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true,
		// }),
		new MiniCssExtractPlugin({
			filename: 'bundle/[name].css',
		}),
		new WorkboxPlugin.InjectManifest({
			swSrc: srcPath + '/app/sw.js',
			// globPatterns: [srcPath + '/www/**/*'],
		}),
	],
	externals: {
		'angular': 'angular',
		'socket.io-client': 'io',
		'push.js': 'Push',
		'aos': 'AOS',
	},
};

if(isBuild)
{
	config.plugins.push(
		new CopyPlugin([{from: srcPath}]),
	);
}
else
{
	// for(var key in config.entry)
	// {
	// 	config.entry[key] = [config.entry[key], 'webpack-hot-middleware/client'];
	// }
	// config.plugins.push(
	// 	new webpack.HotModuleReplacementPlugin(),
	// );
}

module.exports = config;