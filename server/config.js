'use strict';
var path = require('path');
let dirname= __dirname;
if(process.resourcesPath){//run in electron 或者用 process.noAsar
  dirname = process.resourcesPath;
}
module.exports = {
    env: process.env.NODE_ENV,
    // Server port
    port: process.env.PORT || 3000,
    // Root path of server
    clientRoot: path.normalize(__dirname + '/../client'),
    dataPath:path.normalize(dirname + '/data/'),
    walletPath:path.normalize(dirname + '/wallet/')
}
