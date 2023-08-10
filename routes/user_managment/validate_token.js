const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    if (req.body.token == undefined || req.body.token == "") {
        return res.json({
            status: 404,
            message: "Please Enter Token"
        })
    } else {
        return res.json({
            success: true,
            message: "This is the create sub admin route"
        })
    }
  
});

module.exports = router;