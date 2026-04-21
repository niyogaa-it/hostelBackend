const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const knex = require("../../module/knex_connect");
var moment = require("moment");
const axios = require('axios').default;

const EASEBUZZ_API_KEY = process.env.EASEBUZZ_API_KEY;
const EASEBUZZ_SALT = process.env.EASEBUZZ_SALT;
const EASEBUZZ_ENV_URL = process.env.EASEBUZZ_ENV_URL;


async function generateHash(params) {
    const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${EASEBUZZ_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    return hash;
}


router.post("/", async (req, res) => {
   
    const txnid = `txn_${Date.now()}`;
    const amount = req.body.amount;
    const productinfo =  req.body.productinfo;
    const firstname = req.body.firstname;
    const email = req.body.email;
    const phone = req.body.phone;
    const min_amount = "10.00";
    const max_amount = "10000000.00";
   
    //const plan_id = req.body.plan_id;

    const postData = {
        key: EASEBUZZ_API_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        min_amount,
        max_amount,
        phone,
        email,
        surl: process.env.EASEBUZZ_SURL,
        furl: process.env.EASEBUZZ_FURL,
      
    };
    
    

    postData.hash = await generateHash(postData);

        const options = {
            method: 'POST',
            url: EASEBUZZ_ENV_URL+'/payment/initiateLink',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Accept: 'application/json',
            },
            data: new URLSearchParams(postData), // Use URLSearchParams for form-urlencoded
        };

           
    try {  
        
        const response = await axios.request(options);

        const resData = response.data;

        if (resData.status === 1) {
            return res.json({
            status: 200,
            message: 'Payment key is generated',
            data: resData.data,
            });
        }

        throw new Error('Payment key generation failed');
        
    } catch (error) {
      
        return res.json({
            status: 401,
            message: error.message
        })
    }
});


async function verifyHash(params) {
    const hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${EASEBUZZ_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    return hash === params.hash;
}


router.post("/callback", async (req, res) => {
    const paymentDetails = req.body;
    try {
        // const isHashValid = await verifyHash(paymentDetails);
        console.log('paymentDetails', paymentDetails);

        if (paymentDetails.status === "success") {

            console.log('req.body.productinfo',req.body.productinfo);
            if (req.body.productinfo) {
                const existingPayment = await knex("student_plan")
                    .where({ student_id: req.body.productinfo })
                    .orderBy("id", "desc") // order by id descending
                    .limit(1);
                console.log('existingPayment',existingPayment);
                if (existingPayment.length > 0) {
                    const studentDetails = await knex("student_details").where({ id: existingPayment[0].student_id }).limit(1);

                    const existingActivity = await knex("payment_activity")
                        .where({ payment_id: req.body.txnid })
                        .first();
                  
                    if (!existingActivity) {
                            await knex("payment_activity").insert([{
                                plan_id: existingPayment[0].id,
                                student_id: existingPayment[0].student_id,
                                student_name: studentDetails[0].SFname,
                                payment_id: req.body.txnid,
                                amount: req.body.amount,
                                type: 'Online',
                                status: 1,
                                created_at: moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss"),
                            }]);
                    }


                        const updateQuery = knex("student_plan")
                            .where({ id: existingPayment[0].id, student_id: existingPayment[0].student_id })
                            .update({
                                paid: "Yes",
                                total: req.body.amount,
                                total_one_time: req.body.amount,
                                to_pay: req.body.amount,
                            });

                      

                        // Execute queries
                
                        await updateQuery;
                }

                return res.redirect('https://connect.ranimeyyammaihostel.org/RegisterSuccess');
        
            }
            
           
        } else {
            throw new Error('Payment Failed');
        }
    } catch (error) {
        console.log('catch section error', error);
        return   res.redirect('https://connect.ranimeyyammaihostel.org/RegisterFailure');
        // return res.status(500).json({
        //     status: 500,
        //     message: error.message
        // });
    }
});




router.get("/failure", async (req, res) => {

    return res.json({
            status: 401,
            message: error.message,
            data: 'https://connect.ranimeyyammaihostel.org/RegisterFailure',
        })
   
   
});


router.get("/success", async (req, res) => {
   
    return res.json({
        status: 200,
        message: 'Payment successfully done',
        data: 'https://connect.ranimeyyammaihostel.org/RegisterSuccess',
        
    })
   
});



module.exports = router;