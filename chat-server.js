'use strict';

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ip = require('ip');


var chatServer = express();

chatServer.use(logger('dev'));
chatServer.use(express.json());
chatServer.use(express.urlencoded({extended: false}));
chatServer.use(cookieParser());

chatServer.use(express.static(path.join(__dirname, 'public')));
chatServer.use('/css',express.static(path.join(__dirname,'public/css')));
chatServer.use('/js',express.static(path.join(__dirname,'public/js')));
chatServer.use('/jquery',express.static(path.join(__dirname,'node_modules/jquery/dist')));


module.exports = chatServer;
