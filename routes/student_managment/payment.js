/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
//const Razorpay = require('razorpay');


// const razorpay = new Razorpay({
//   key_id: 'rzp_test_yfp9xPZKoXY3cg',
//   key_secret: 'SAcv31p0vYk9IJbMhIiTwDdH',
// });

// router.post("/create-order", async (req, res) => {

//     const payment_capture = 1;
//     const amount = 500; // amount in paise (500 paise = 5 INR)
//     const currency = 'INR';

//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt: shortid.generate(),
//       payment_capture,
//     };

//     try {

//       const response = await razorpay.orders.create(options);
      
//       let paymentParams = {
//         id: response.id,
//         currency: response.currency,
//         amount: response.amount,
//       }


//       return res.json({
//         status: 200,
//         message: 'Creating order',
//         details: paymentParams,
//       });

//     } catch (error) {
//       console.error(error);

//       return res.json({
//         status: 401,
//         message: 'Error creating order',
//       });
      
//     }
 
// });


// router.get('/update-payments', async (req, res) => {
//   try {
//       const payments = await razorpay.payments.all();

//       console.log(payments);


//       const paymentPromises = payments.items.map(async payment => {
         

//           const existingPayment =  await knex("payment_activity").where({payment_id: payment.id});

//           if (existingPayment) {
//               var updatePaymentDtl = await knex("payment_activity").where( {
//                 payment_id: payment.id
//               }).update({
//                 payment_id: payment.id,
//                 amount: ((payment.amount) / 100),
//                 type: "Online",
//                 updated_at: payment.updated_at
//               });
    
//           } else {
            
//               const newPayment = await knex("payment_activity").insert([
//                 {
//                   payment_id: payment.id,
//                   amount: ((payment.amount) / 100),
//                   type : 'Online',
//                   status: 1,
//                   created_at:  payment.created_at,
//                   updated_at: payment.updated_at
//                 },
//               ]);
//           }
//       });

//       await Promise.all(paymentPromises);
//       res.json({ message: 'Payments updated successfully' });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

router.get('/update-others', async (req, res) => {

  try {
 
      const payments =  await knex("student_details");

      

      const paymentPromises = payments.map(async payment => {
     
      
          const existingPayment =  await knex("student_plan").where({student_id: payment.id}).limit(1);
        
        
          if (existingPayment) {
          

              var updatePaymentDtl = await knex("student_plan").where( {
                student_id: payment.id
              }).update({
                meal_type: payment.food_preference,
                //parking_type: (payment.parking_type === null) ? 0 : payment.parking_type,
              });
    
          } 
      });

      await Promise.all(paymentPromises);
      res.json({ message: 'Payments updated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
