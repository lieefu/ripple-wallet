'use strict';
const {
    RippleAPI
} = require('ripple-lib');
const api = new RippleAPI({
    server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
});
api.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
api.on('connected', () => {
    console.log('on connected');
});
api.on('disconnected', (code) => {
    // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
    // will be 1000 if this was normal closure
    console.log('disconnected, code:', code);
});
// api.connect().then(() => {
//     console.log("ripple api connected!");
// }).then(() => {
//     //return api.disconnect();
//     console.log("ripple api connected!!");
// }).catch(console.error);
api.on('disconnected', (code) => {
    if (code !== 1000) {
        console.log('Connection is closed due to error.');
    } else {
        console.log('Connection is closed normally.');
    }
});
module.exports = function(fname,...args) {
    return new Promise(function(resolve, reject) {
        api.connect().then(() => {
            try{
                if(api[fname]){
                    api[fname](...args).then((data)=>{
                        resolve(data);
                    }).catch(reject);
                }else{
                    reject(fname+"not exist.")
                }
            }catch(err){
                reject(err);
            }
        }).catch(reject);
    })
};
