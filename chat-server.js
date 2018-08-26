'use strict';

const express = require('express');
const app = express();
const ip = require('ip');
const path = require('path');


const port = process.env.PORT || 3333;


const server = app.listen(port, function () {
    console.log(`listening at port : ${port}`);
    console.log(ip.address());
});


app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));


require('./socket/socketio')(server);

