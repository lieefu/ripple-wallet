'use strict';
const {
    RippleAPI
} = require('ripple-lib');
const keypairs = require('ripple-keypairs');
const crypto = require('crypto');
const rippleApi = new RippleAPI({
    server: 'wss://s1.ripple.com' // Public rippled server hosted by Ripple, Inc.
});
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

module.exports = {
    ripple: function(fname, ...args) {
        return new Promise(function(resolve, reject) {
            if (rippleApi.isConnected()) {
                invokeRipple(resolve, reject, fname, ...args);
            } else {
                rippleApi.connect().then(() => {
                    invokeRipple(resolve, reject, fname, ...args);
                }).catch(reject);
            }
        })
    },
    createWallet,
    createWalletFromSeed,
    createWalletFromPhrase,
    encryptSeed,
    decryptSeed
}
///////////////////////////
function invokeRipple(resolve, reject, fname, ...args) {
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
    const decipher = crypto.createDecipher('aes192',password);
    const encrypted = data;
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted);
    return decrypted;
}
