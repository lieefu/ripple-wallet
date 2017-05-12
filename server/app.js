'use strict';
var path = require('path');
const express=require("express");
const session = require('express-session');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
  secret: 'ripplewalletbuildbylieefu', // 建议使用 128 个字符的随机字符串
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false  }//only https set to true and app.set('trust proxy', 1) // trust first proxy
}));
var server = require('http').Server(app);
var socketio = require('socket.io')(server);
var config = require("./config.js");
// Get our API routes
const routes = require('./routes');
//Soket Io chat
require('./chat')(socketio);
// Set our api routes
app.use('/', routes);
app.use(express.static(path.join(config.root, 'dist')));
// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(config.root,"dist/index.html"));
});

/// Start server
server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
