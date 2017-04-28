const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require("../config.js");
const Ripple = require("../ripple");
const ripple = Ripple.ripple;
/* GET api listing. */
router.get('/', (req, res) => {
    resultOk(res, 'api works,ok');
});
//////////////////////////////////////
router.get('/getwallets',(req,res)=>{
    fs.readdir(config.dataPath,(err,files)=>{
        if(err){
            return resultError(res,"搜索钱包文件遇到错误");
        }
        let addressarray=[];
        files.forEach(function (filename) {
            console.log(filename);
            let pos = filename.indexOf(".key");
            if(pos>0){
                filename=filename.substring(0,pos);
                addressarray.push(filename);
            }
        });
        return resultOk(res,addressarray);
    })
})

//////////////////////////////////////
router.get("/createwallet/:seed", (req, res) => {
    let seed = req.params.seed;
    let wallet = {};
    if (seed === "new") {
        wallet = Ripple.createWallet();
    } else {
        try {
            wallet = Ripple.createWalletFromSeed(seed);
        } catch (err) {
            return resultError(res, "私钥错误！");
        }
    }
    wallet.ver = "1.0";
    wallet.islocked = false;
    req.session.wallet = wallet;
    console.log(req.session, req.session.id);
    resultOk(res, wallet);
});
//////////////////////////////////////
router.get('/savewallet', (req, res) => {
    console.log(config.dataPath);
    let wallet = req.session.wallet;
    if (!wallet) {
        return resultError(res, "钱包尚未生成");
    }
    let filename = config.dataPath + wallet.address + ".key";
    fs.writeFile(filename, JSON.stringify(wallet), function(err) {
        if (err) {
            return resultError(res, "钱包保存失败！" + err);
        }
        return resultOk(res, wallet);
    });

})
///////////////////////////////
router.get('/decryptwallet/:address/:password',(req,res)=>{
    let address = req.params.address;
    let password = req.params.password;
    let filename = config.dataPath + address + ".key";
    fs.readFile(filename, "utf-8",(err, data) => {
        if (err) {
            return resultError(res, "钱包文件不存在");
        }
        let wallet = JSON.parse(data);
        if(wallet.islocked){
            console.log("解密钱包");
            try{
                wallet.seed = Ripple.decryptSeed(wallet.seed,password);
                wallet.msg = "解密好了，哈";
                wallet.islocked = false;
                return resultOk(res, wallet);
            }catch(err){
                return resultError(res,"口令错误");
            }
        }
        return resultError(res, "钱包文件格式错误");
    });
});
///////////////////////////////
router.get('/encryptwallet/:address/:password', (req, res) => {
    let address = req.params.address;
    let password = req.params.password;
    let filename = config.dataPath + address + ".key";
    fs.readFile(filename, "utf-8",(err, data) => {
        if (err) {
            return resultError(res, "钱包文件不存在");
        }
        let wallet = JSON.parse(data);
        console.log(wallet);
        if(wallet.islocked){
            return resultError(res, "钱包已经被加密过了，不能重复加密！");
        }
        if (wallet.islocked == false) {
            console.log("加密钱包");
            wallet.msg = "加密好了，哈";
            wallet.seed = Ripple.encryptSeed(wallet.seed,password);
            wallet.islocked = true;
            //return resultOk(res, wallet);
            fs.writeFile(filename, JSON.stringify(wallet), function(err) {
                if (err) {
                    return resultError(res, "钱包加密保存文件失败！" + err);
                }
                return resultOk(res, wallet);
            });
            return;
        }
        return resultError(res, "加密失败，因为钱包数据错误！");
    })

})
//////////////////////////////////////
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

function resultOk(res, data) {
    res.status(200).json({
        ok: true,
        data: data
    });
}

function resultError(res, data) {
    res.status(200).json({
        ok: false,
        data: data
    });
}
module.exports = router;
