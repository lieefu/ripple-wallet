'use strict';
var path = require('path');
module.exports = {
    env: process.env.NODE_ENV,
    // Server port
    port: process.env.PORT || 3000,
    // Root path of server
    root: path.normalize(__dirname + '/../client'),
    dataPath:path.normalize(__dirname + '/data/')
}
