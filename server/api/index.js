const express = require('express');
const router = express.Router();
const ripple = require("../ripple");
/* GET api listing. */
router.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'api works,ok'
    });
});
router.get("/accountinfo/:address", (req, res) => {
    var address = req.params.address;
    console.log(address);
    ripple('getAccountInfo',address).then((info) => {
        console.log("get account info", info);
        res.status(200).json({
            ok: true,
            message: info
        });
    }).catch((error) => {
        console.log("ripple error", error);
        res.status(200).json({
            ok: false,
            message: error
        });
    })
});
router.get("/serverinfo", (req, res) => {
    console.log("get server info begin");
    if (!ripple.isConnected()) {
        return res.status(200).json({
            ok: false,
            message: 'ripple disconnected!'
        });
    }
    ripple.getServerInfo().then(
        info => {
            console.log("get server info");
            res.status(200).json({
                ok: true,
                message: info
            });
        }
    )
})
module.exports = router;
