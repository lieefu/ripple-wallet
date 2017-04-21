const express = require('express');
const router = express.Router();
const ripple = require("../ripple");
/* GET api listing. */
router.get('/', (req, res) => {
  res.status(200).json({ok:true,message:'api works,ok'});
});
router.get("/serverinfo",(req,res)=>{
    ripple.getServerInfo().then(info => {
        res.status(200).json({ok:true,message:info});
    });
})
module.exports = router;
