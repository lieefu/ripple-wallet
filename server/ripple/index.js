'use strict';
const keypairs = require('ripple-keypairs');
const crypto = require('crypto');
const RippleAPI = require('ripple-lib').RippleAPI;
var rippleApi = new RippleAPI({
    server: 'wss://s-west.ripple.com' // Public rippled server hosted by Ripple, Inc.
    //server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
    //server: 'wss://s-east.ripple.com' // Public rippled server hosted by Ripple, Inc.
});
// const RippleAPI = require('ripple-lib').RippleAPIBroadcast;
// const rippleApi = new RippleAPI(['wss://s-west.ripple.com', 'wss://s-east.ripple.com',  'wss://s1.ripple.com' ]);
//const rippleApi = new RippleAPI(['wss://s2.ripple.com']);
rippleApi.on('error', (errorCode, errorMessage) => {
    console.log(errorCode + ': ' + errorMessage);
});
rippleApi.on('connected', () => {
    console.log('on connected');
});
rippleApi.on('disconnected', (code) => {
    // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
    // will be 1000 if this was normal closure
    console.log('disconnected, code:', code);
});
rippleApi.connect();
const instructions = {
    maxFee: "10000",
    maxLedgerVersionOffset: 9
};
////////////////////////
function reconnect(url) {
    console.log("reconnect:" + url);
    rippleApi = new RippleAPI({
        server: url
    });
    // const RippleAPI = require('ripple-lib').RippleAPIBroadcast;
    // const rippleApi = new RippleAPI(['wss://s-west.ripple.com', 'wss://s-east.ripple.com',  'wss://s1.ripple.com' ]);
    //const rippleApi = new RippleAPI(['wss://s2.ripple.com']);
    rippleApi.on('error', (errorCode, errorMessage) => {
        console.log(errorCode + ': ' + errorMessage);
    });
    rippleApi.on('connected', () => {
        console.log('on reconnected');
    });
    rippleApi.on('disconnected', (code) => {
        // code - [close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) sent by the server
        // will be 1000 if this was normal closure
        console.log('disconnected, code:', code);
    });
    return new Promise(function(resolve, reject) {
        rippleApi.connect().then(() => {
            resolve("reconnected success");
        }).catch(reject);
    })
}
///////////////////////////
function submit(txJSON, secret) {
    return new Promise((resolve, reject) => {
        try {
            const signed = rippleApi.sign(txJSON, secret);
            const txid = signed.id;
            const signedTransaction = signed.signedTransaction;
            rippleApi.submit(signedTransaction).then(result => {
                if (result.resultCode == "tesSUCCESS") {
                    resolve(result);
                } else {
                    reject(result);
                }
            }).catch(error => {
                reject({
                    resultCode: "libError",
                    resultMessage: "submit error:" + error
                });
            });
        } catch (error) {
            reject({
                resultCode: "libError",
                resultMessage: "sign error:" + error
            });
        }
    });
}

function invokeRipple(fname, ...args) {
    return new Promise(function(resolve, reject) {
        if (rippleApi.isConnected()) {
            invoke_ripple(resolve, reject, fname, ...args);
        } else {
            rippleApi.connect().then(() => {
                invoke_ripple(resolve, reject, fname, ...args);
            }).catch(reject);
        }
    })
}

function invoke_ripple(resolve, reject, fname, ...args) {
    try {
        if (rippleApi[fname]) {
            rippleApi[fname](...args).then((data) => {
                resolve(data);
            }).catch(reject);
        } else {
            reject(fname + "not exist.")
        }
    } catch (err) {
        reject(err);
    }
}

function createWallet(options = {}) {
    const seed = keypairs.generateSeed(options);
    const keypair = keypairs.deriveKeypair(seed);
    const address = keypairs.deriveAddress(keypair.publicKey);
    return {
        address,
        seed
    };
}

function createWalletFromSeed(seed) {
    const keypair = keypairs.deriveKeypair(seed);
    const address = keypairs.deriveAddress(keypair.publicKey);
    return {
        address,
        seed
    };
}

function createWalletFromPhrase(phrase) {
    const hash = crypto.createHash('sha256');
    var phraseHash = hash.update(phrase).digest();
    const seed = keypairs.generateSeed({
        entropy: phraseHash
    });
    const keypair = keypairs.deriveKeypair(seed);
    const address = keypairs.deriveAddress(keypair.publicKey);
    return {
        address,
        seed
    };
}

function encryptSeed(seed, password) {
    const crypto = require('crypto');
    const cipher = crypto.createCipher('aes192', password);
    let encrypted = cipher.update(seed, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
    return encrypted;
}

function decryptSeed(data, password) {
    const crypto = require('crypto');
    const decipher = crypto.createDecipher('aes192', password);
    const encrypted = data;
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted);
    return decrypted;
}
//-------------------------------------------------------------------------------------------------------
module.exports = {
    ripple: invokeRipple,
    instructions,
    createWallet,
    createWalletFromSeed,
    createWalletFromPhrase,
    encryptSeed,
    decryptSeed,
    submit,
    reconnect
}
