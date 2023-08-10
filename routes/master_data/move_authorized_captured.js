const express = require("express");
const router = express.Router();
const authorizedToCaptured = require('../../module/authorized_to_captured');


router.post("/", async (req, res) => {
    try {
       if (req.body.amount == undefined || req.body.amount == "") {
           return res.json({
               status: 401,
               field_name: "amount",
               message: "Please enter a amount"
           }); 
       } else if (req.body.payment_id == undefined || req.body.payment_id == "") {
           return res.json({
               status: 401,
               field_name: "PaymentId",
               message: "Please enter a payment id"
           }); 
       } else {
             await authorizedToCaptured(req.body.payment_id,req.body.amount);
             return res.json({
                status: 200,
                message: "Updated  successful"
            })
       }
    } catch (error) {
        // console.log(ok);
        return res.json({
            status: 401,
            message: error.message
        })
    }
});

module.exports = router;