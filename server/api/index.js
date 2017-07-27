const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const config = require("../config.js");
const Ripple = require("../ripple");
const ripple = Ripple.ripple;
/* GET api listing. */
router.get('/', (req, res) => {
    resultOk(res, 'api works,ok');
});
/////////////////////////////////////
router.post("/reconnect", (req, res) => {
    let url = req.body.url;
    Ripple.reconnect(url).then(info => {
        resultOk(res, info);
    }).catch(err => {
        resultError(res, err);
    })
})
//////////////////////////////////////
function readFile(filename, req, res, okmsg, errmsg) {
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            console.log(errmsg);
            return resultError(res, errmsg)
        } else {
            return resultOk(res, JSON.parse(data));
        }
    });
}
router.get("/getconfig", (req, res) => {
    let filename = config.dataPath + "config.json";
    readFile(filename, req, res, "", "配置文件未找到");
})
router.post("/saveconfig", (req, res) => {
    let configdata = req.body.data;
    let filename = config.dataPath + "config.json";
    saveFile(filename, configdata, req, res, "配置数据保存成功", "配置数据数据保存失败！");
})
router.get("/getdata", (req, res) => {
    let filename = config.walletPath + "data.txt";
    readFile(filename, req, res);
});

function saveFile(filename, data, req, res, okmsg, errmsg) {
    fs.writeFile(filename, JSON.stringify(data), function(err) {
        if (err) {
            return resultError(res, errmsg + err);
        } else {
            return resultOk(res, okmsg);
        }
    });
}
router.post('/savedata', (req, res) => {
    //console.log(config.walletPath);
    let walletdata = req.body.data;
    let filename = config.walletPath + "data.txt";
    saveFile(filename, walletdata, req, res, "联系人等数据保存成功", "联系人等数据保存失败！");
})
//////////////////////////////////////
/**
 * Promise all
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
function promiseAllP(items, block) {
    var promises = [];
    items.forEach(function(item, index) {
        promises.push(function(item, i) {
            return new Promise(function(resolve, reject) {
                return block.apply(this, [item, index, resolve, reject]);
            });
        }(item, index))
    });
    return Promise.all(promises);
} //promiseAll

/**
 * read files
 * @param dirname string
 * @return Promise
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 * @see http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
 */
function readFiles(dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, function(err, filenames) {
            if (err) return reject(err);
            promiseAllP(filenames,
                    (filename, index, resolve, reject) => {
                        fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
                            if (err) return reject(err);
                            return resolve({
                                filename: filename,
                                data: content
                            });
                        });
                    })
                .then(results => {
                    return resolve(results);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    });
}
router.get('/getwallets', (req, res) => {
    let wallets = [];
    readFiles(config.walletPath)
        .then(files => {
            files.forEach((file, index) => {
                //console.log("item", index, "data: ", file.data);
                let data = JSON.parse(file.data);
                if (data.address) {
                    let wallet = {};
                    wallet.address = data.address;
                    if (data.name) wallet.name = `(${data.name})`;
                    wallets.push(wallet);
                }
            });
            resultOk(res, wallets)
        })
        .catch(error => {
            resultError(res, error);;
        });
})
///////////////////////////////////////
router.get("/getwallet/:address", (req, res) => {
    let address = req.params.address;
    let wallet = {};
    let filename = config.walletPath + address + ".key";
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            return resultError(res, "钱包文件不存在");
        } else {
            let wallet = JSON.parse(data);
            req.session.wallet = wallet;
            return resultOk(res, wallet);
        }
    });
});
//////////////////////////////////////
router.get("/brainwallet/:phrase", (req, res) => {
    let phrase = req.params.phrase;
    let wallet = {};
    wallet = Ripple.createWalletFromPhrase(phrase);
    wallet.ver = "1.0";
    wallet.isLocked = false;
    wallet.isSecreted = false;
    req.session.wallet = wallet;
    resultOk(res, wallet);
});
//////////////////////////////////////
router.get("/newwallet", (req, res) => {
    let wallet = {};
    wallet = Ripple.createWallet();
    wallet.ver = "1.0";
    wallet.isLocked = false;
    wallet.isSecreted = false;
    req.session.wallet = wallet;
    console.log(req.session, req.session.id);
    resultOk(res, wallet);
});
//////////////////////////////////////
router.get("/importwallet/:seed", (req, res) => {
    let seed = req.params.seed;
    let wallet = {};
    try {
        wallet = Ripple.createWalletFromSeed(seed);
    } catch (err) {
        return resultError(res, "私钥错误！");
    }
    wallet.ver = "1.0";
    wallet.isLocked = false;
    wallet.isSecreted = false;
    req.session.wallet = wallet;
    resultOk(res, wallet);
});
//////////////////////////////////////
router.get('/setWalletName/:name', (req, res) => {
    let name = req.params.name;
    let wallet = req.session.wallet;
    if (!wallet) {
        return resultError(res, "钱包不存在");
    }
    wallet.name = name;
    savewallet(wallet, req, res);
})
router.get('/savewallet', (req, res) => {
    console.log(config.walletPath);
    let wallet = req.session.wallet;
    if (!wallet) {
        return resultError(res, "钱包尚未生成");
    }
    savewallet(wallet, req, res);
})

function savewallet(wallet, req, res) {
    let filename = config.walletPath + wallet.address + ".key";
    fs.writeFile(filename, JSON.stringify(wallet), function(err) {
        if (err) {
            return resultError(res, "钱包保存失败！" + err);
        }
        return resultOk(res, wallet);
    });
}
///////////////////////////////
router.get('/decryptwallet/:address/:password', (req, res) => {
    let address = req.params.address;
    let password = req.params.password;
    let filename = config.walletPath + address + ".key";
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            return resultError(res, "钱包文件不存在");
        }
        let wallet = JSON.parse(data);
        if (wallet.isSecreted) {
            console.log("解密钱包");
            try {
                wallet.seed = Ripple.decryptSeed(wallet.secret, password);
                //wallet.msg = "解密好了，哈";
                wallet.isLocked = false;
                wallet.isSecreted = true;
                req.session.wallet = wallet;
                return resultOk(res, wallet);
            } catch (err) {
                return resultError(res, "密码错误");
            }
        }
        return resultError(res, "钱包文件格式错误");
    });
});
///////////////////////////////
router.get('/encryptwallet/:address/:password', (req, res) => {
    let address = req.params.address;
    let password = req.params.password;
    let filename = config.walletPath + address + ".key";
    fs.readFile(filename, "utf-8", (err, data) => {
        if (err) {
            return resultError(res, "钱包文件不存在");
        }
        let wallet = JSON.parse(data);
        console.log(wallet);
        if (wallet.isSecreted) {
            return resultError(res, "钱包已经被加密过了，不能重复加密！");
        }
        if (wallet.isSecreted == false) {
            console.log("加密钱包");
            //wallet.msg = "加密好了，哈";
            wallet.secret = Ripple.encryptSeed(wallet.seed, password);
            wallet.seed = "";
            wallet.isSecreted = true; //加密保护了
            wallet.isLocked = true; //锁定了
            //return resultOk(res, wallet);
            fs.writeFile(filename, JSON.stringify(wallet), function(err) {
                if (err) {
                    return resultError(res, "钱包加密保存文件失败！" + err);
                }
                req.session.wallet = wallet;
                return resultOk(res, wallet);
            });
            return;
        }
        return resultError(res, "加密失败，因为钱包数据错误！");
    })

})
//////////////////////////////////////
router.get("/getTransactions/:address/:type", (req, res) => {
    let address = req.params.address;
    let type = req.params.type;
    //let options = req.body.options;
    let options = {
        types: [type]
    }
    console.log("getTransactions", address, options);
    //ripple lib getTransactions 不好用，不能用
    //getTransactions/rGCCp6yGDFNPGKr1mViVA7TrDVRpa9GYYi/payment 结果是 {"ok":false,"data":{"name":"MissingLedgerHistoryError","message":"Server is missing ledger history in the specified range"}}
    ripple("getTransactions", address, options).then(info => {
        resultOk(res, info);
    }).catch(error => {
        resultError(res, error);
    })
})
router.post("/getOrderbook/:address/:limit", (req, res) => {
    let address = req.params.address;
    let limit = +req.params.limit;
    let orderbook = req.body.orderbook;
    console.log(address, orderbook, {
        limit: limit
    });
    ripple("getOrderbook", address, orderbook, {
        limit: limit
    }).then(info => {
        resultOk(res, info);
    }).catch(error => {
        resultError(res, error);
    })
})
router.get("/getMyOrders/:address", (req, res) => {
    var address = req.params.address;
    ripple('getOrders', address, {
        limit: 100
    }).then((info) => {
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
});
router.get("/getfee", (req, res) => {
    ripple("getFee").then(info => {
        resultOk(res, info);
    })
})
router.get("/accountinfo/:address", (req, res) => {
    var address = req.params.address;
    ripple('getAccountInfo', address).then((info) => {
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
});
router.get("/getbalances/:address", (req, res) => {
    var address = req.params.address;
    ripple('getBalances', address, {
        limit: 100
    }).then((info) => {
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
});
router.get("/getTrustlines/:address", (req, res) => {
    var address = req.params.address;
    ripple('getTrustlines', address, {
        limit: 100
    }).then((info) => {
        console.log(info);
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
});
router.get("/getbalancesheet/:address", (req, res) => {
    var address = req.params.address;
    ripple('getBalanceSheet', address).then((info) => {
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
});
router.get("/serverinfo", (req, res) => {
    ripple('getServerInfo').then((info) => {
        resultOk(res, info);
    }).catch((error) => {
        resultError(res, error);
    })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/addOrder/:address", (req, res) => {
    const address = req.params.address;
    const order = req.body.order;
    const wallet = req.session.wallet;
    //console.log("wallet:",wallet);
    if (!wallet || wallet.isLocked) {
        return resultError(res, "钱包未解锁");
    }
    ripple('prepareOrder', address, order, Ripple.instructions).then(prepare => {
        console.log(prepare);
        if (prepare.txJSON) {
            const txJSON = prepare.txJSON;
            const secret = wallet.seed;
            //console.log(txJSON,secret);
            Ripple.submit(txJSON, secret).then(result => {
                resultOk(res, result);
            }).catch(error => {
                resultError(res, error);
            })
        } else {
            resultError(res, "prepareOrder error!不该发生的错误");
        }
    }).catch((error) => {
        resultError(res, {
            resultCode: "libError",
            resultMessage: "prepareOrder error:" + error
        });
    });

});

router.get("/cancellOrder/:address/:sequence", (req, res) => {
    const address = req.params.address;
    const sequence = req.params.sequence;
    const wallet = req.session.wallet;
    //console.log("wallet:",wallet);
    if (!wallet || wallet.isLocked) {
        return resultError(res, "钱包未解锁");
    }
    ripple('prepareOrderCancellation', address, {
        orderSequence: +sequence
    }, Ripple.instructions).then(prepare => {
        console.log(prepare);
        if (prepare.txJSON) {
            const txJSON = prepare.txJSON;
            const secret = wallet.seed;
            //console.log(txJSON,secret);
            Ripple.submit(txJSON, secret).then(result => {
                resultOk(res, result);
            }).catch(error => {
                resultError(res, error);
            })
        } else {
            resultError(res, "prepareOrderCancellation error!不该发生的错误");
        }
    }).catch((error) => {
        resultError(res, {
            resultCode: "libError",
            resultMessage: "prepareOrderCancellation error:" + error
        });
    });

})

router.post("/payment", (req, res) => {
    const payment = req.body.payment;
    const address = payment.source.address;
    const wallet = req.session.wallet;
    //console.log("wallet:",wallet);
    if (!wallet || wallet.isLocked) {
        return resultError(res, "钱包未解锁");
    }
    ripple('preparePayment', address, payment, Ripple.instructions).then(prepare => {
        console.log(prepare);
        if (prepare.txJSON) {
            const txJSON = prepare.txJSON;
            const secret = wallet.seed;
            //console.log(txJSON,secret);
            Ripple.submit(txJSON, secret).then(result => {
                resultOk(res, result);
            }).catch(error => {
                resultError(res, error);
            })
        } else {
            resultError(res, "preparePayment error!不该发生的错误");
        }
    }).catch((error) => {
        resultError(res, {
            resultCode: "libError",
            resultMessage: "preparePayment error:" + error
        });
    });
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/setTrustline/:address", (req, res) => {
    var address = req.params.address;
    var trust = req.body.trust;
    const wallet = req.session.wallet;
    //console.log("wallet:",wallet);
    if (!wallet || wallet.isLocked) {
        return resultError(res, "钱包未解锁");
    }
    const trustline = {
        "currency": trust.currency,
        "counterparty": trust.counterparty,
        "limit": trust.limit,
        //"qualityIn": 1, //"qualityOut": 1,
        "ripplingDisabled": trust.ripplingDisabled,
        "frozen": trust.frozen,
        "memos": [{
            "type": "rippleok.com",
            "format": "plain/text",
            "data": "Lieefu's ripple wallet, lieefu.com"
        }]
    };
    ripple('prepareTrustline', address, trustline, Ripple.instructions).then(prepare => {
        console.log(prepare);
        if (prepare.txJSON) {
            const txJSON = prepare.txJSON;
            const secret = wallet.seed;
            //console.log(txJSON,secret);
            Ripple.submit(txJSON, secret).then(result => {
                resultOk(res, result);
            }).catch(error => {
                resultError(res, error);
            })
        } else {
            resultError(res, "preparePayment error!不该发生的错误");
        }
    }).catch((error) => {
        console.log("error trustline");
        resultError(res, {
            resultCode: "libError",
            resultMessage: "prepareTrustline error:" + error
        });
    });
});
router.post('/getPaths', (req, res) => {
    const pathfind = req.body.pathfind;
    ripple('getPaths', pathfind).then(paths => {
        resultOk(res, paths);
    }).catch(error => {
        resultError(res, error);
    })
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function resultOk(res, data) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    //Prevent Getting Json Response from Cache in Express JS
    res.status(200).json({
        ok: true,
        data: data
    });
}

function resultError(res, data) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    //Prevent Getting Json Response from Cache in Express JS
    res.status(200).json({
        ok: false,
        data: data
    });
}
module.exports = router;
