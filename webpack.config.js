const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const packageName = 'FusiongisDemo';
const fileName = 'common-editor'

let config = {
    entry: ['babel-polyfill', './js/main.js'],
    output: {
      path: path.resolve(__dirname, './build'),
      library: packageName,
      pathinfo: true
    },
    mode: 'production',//production | development
    module: {
      rules: [
        {
          test: /\.js$/, //标识出应该被对应的 loader 进行转换的某个或某些文件
          exclude: /node_modules/, //处理除了nodde_modules里的js文件
          use: [
	          {
	            loader: 'babel-loader',
	            options: {
	            	presets: ['babel-preset-env']
	            }
	          }
          ]
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
          		"css-loader"
            ],
        }
      ]
    },
    plugins: [
        new webpack.BannerPlugin({
          banner: "*******Build this package on "+new Date().toLocaleString()+ "*******" //Adds a banner to the top of each generated chunk.
        })/*,
        new MiniCssExtractPlugin({
          filename: fileName + ".css"
        })*/
    ],
    optimization: {
	    minimizer: [
	      new OptimizeCSSAssetsPlugin({})
	    ]
	  }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        webpack.debug = true;
        config.output.filename = fileName + '-debug.js';
        
        config.plugins.push(
            new MiniCssExtractPlugin({
	          filename: fileName + "-debug.css"
	        })
        );
    }

    if (argv.mode === 'production') {
        config.output.filename = fileName + '.js';
        config.plugins.push(
            new UglifyJsPlugin({
		        cache: true,
		        parallel: true,
		        uglifyOptions: {
		          compress: true,
		          ecma: 6,
		          mangle: true
		        },
		        sourceMap: false
		     }),
		     new MiniCssExtractPlugin({
		        filename: fileName + ".css"
		     })
        );
    }

    return config;
};
