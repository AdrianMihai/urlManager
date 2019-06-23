const appName = 'mainApp';

const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
		template:  './public/js/react-apps/' +  appName + '/index.html',
		filename: 'index.html',
		inject: 'body'
});

module.exports = {
	entry: __dirname + '/public/js/react-apps//'+ appName +'/indexApp.js',
	module : {
		rules: [
			{
				test: /\.(js|jsx)$/,
				/*include: [
					__dirname + 'app/static/js/react-apps/' + appName,
					__dirname + 'app/static/js/material-kit-react-master/src'
				],*/
				exclude: [
					/node_modules/
				],

				use: {
          			loader: "babel-loader"
        		}
			}
		],
	},
	output:{
		filename: 'indexApp.js',
		path: __dirname + '/public/js/transformedApps/' + appName
	},
	plugins: [HTMLWebpackPluginConfig],
	mode: 'development'
};