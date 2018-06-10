var webpack = require('webpack');

var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isBuild = ENV === 'build';

var srcPath = __dirname + '/www';
var destPath = __dirname + '/dist';

var config = {
	mode: isBuild ? 'production' : 'development',
	entry: {
		app: srcPath + '/app/main.js',
		module: srcPath + '/app/module.js',
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
			test: /\.scss/,
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
		}, {
			test: /\.html$/,
			use: 'html-loader',
		}, {
			test: /\.(png|jpg|ico)$/,
			use: 'file-loader',
		}],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true,
		// }),
		new MiniCssExtractPlugin({
			filename: 'bundle/[name].css',
		}),
	],
};

if(isBuild)
{
	config.plugins.push(
		new CopyPlugin([{from: srcPath}]),
	);
}

module.exports = config;