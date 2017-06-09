'use strict';
var path = require('path');
module.exports = {
    env: process.env.NODE_ENV,
    // Server port
    port: process.env.PORT || 3000,
    // Root path of server
    clientRoot: path.normalize(__dirname + '/../client'),
    dataPath:path.normalize(__dirname + '/data/'),
    walletPath:path.normalize(__dirname + '/wallet/')
}
