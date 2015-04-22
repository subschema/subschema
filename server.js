#!/usr/bin/env node
var express  = require('express'),path=require('path'), app = express();
var webpackMiddleware = require("webpack-dev-middleware");
var config = require('./webpack.config.js');
config.output = {
	        path: "/",
	filename:"app.js"
}
var webpack = require('webpack');
app.use(express.static(path.join(__dirname, 'public')));
app.use(webpackMiddleware(webpack(config)));
console.log('app is listenening on 3002');
app.listen(3002);
