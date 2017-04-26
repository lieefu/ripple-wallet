const express = require('express');
const router = express.Router();
const Ripple = require("../ripple");
const ripple = Ripple.ripple;
/* GET api listing. */
router.get('/', (req, res) => {
    resultOk(res,'api works,ok');
});
router.get("/createwallet/:seed",(req,res)=>{
    var seed = req.params.seed,wallet={};
    if(seed==="new"){
        wallet =  Ripple.createWallet();
    }else{
        try{
            wallet =  Ripple.createWalletFromSeed(seed);
        }catch(err){
            resultError(res,"私钥错误！");
            return;
        }
    }
    resultOk(res,wallet);
});
router.get("/accountinfo/:address", (req, res) => {
    var address = req.params.address;
    ripple('getAccountInfo',address).then((info) => {
        resultOk(res,info);
    }).catch((error) => {
        resultError(res,error);
    })
});
router.get("/getbalances/:address", (req, res) => {
    var address = req.params.address;
    ripple('getBalances',address,{limit:100}).then((info) => {
        resultOk(res,info);
    }).catch((error) => {
        resultError(res,error);
    })
});
router.get("/getbalancesheet/:address", (req, res) => {
    var address = req.params.address;
    ripple('getBalanceSheet',address).then((info) => {
        resultOk(res,info);
    }).catch((error) => {
        resultError(res,error);
    })
});
router.get("/serverinfo", (req, res) => {
    ripple('getServerInfo').then((info) => {
        resultOk(res,info);
    }).catch((error) => {
        resultError(res,error);
    })
})

function resultOk(res,data){
    res.status(200).json({
        ok: true,
        data: data
    });
}
function resultError(res,data){
    res.status(200).json({
        ok: false,
        data: data
    });
}
module.exports = router;
