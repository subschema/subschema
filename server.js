#!/usr/bin/env node
var express  = require('express'),path=require('path'), app = express();

app.use(express.static(path.join(__dirname, '.build')));
app.use(express.static(path.join(__dirname, 'public')));

console.log('app is listenening on 3002');
app.listen(3002);
