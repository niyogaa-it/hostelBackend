const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
var moment = require("moment");

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


router.post("/update", async (req, res) => {

    try {
        
        let insert_transaction_dtl =  await knex("transaction").insert([
            {
            student_id: req.body.student_id,
            payment_id: req.body.payment_id === null ? null : req.body.payment_id,
            status: req.body.payment_id === null ? 'fail' :'success',
            created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        }]);


        if(req.body.payment_id){
           
            let insert_payment_activity =  await knex("payment_activity").insert([
                {

                plan_id: req.body.plan_id,
                student_id: req.body.student_id,
                student_name: req.body.student_name,
                payment_id: req.body.payment_id === null ? null : req.body.payment_id,
                amount: req.body.amount,
                type: 'Online',
                status: 1,
                created_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
            }]);

            var updateInvoiceName = await knex("student_plan").where({id: req.body.plan_id,student_id:  req.body.student_id}).update({
                paid: "Yes",
                //send_to_student: "sendto",
                total: req.body.amount,
                total_one_time:  req.body.amount,
                to_pay: req.body.amount,
               
              });

            return res.json({
                status: 200,
                message: "Updated  successful"
            })

        }
       
        
       
    } catch (error) {
         console.log(error);
        return res.json({
            status: 401,
            message: error
        })
    }
});

module.exports = router;