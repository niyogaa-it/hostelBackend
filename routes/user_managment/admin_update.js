/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const { md5 } = require("request/lib/helpers");
 const router = express.Router();
 const knex = require('../../module/knex_connect');
 
 
 
 router.post("/", async (req, res) => {
     try {
         console.log(req.body);
         if (req.body.name == undefined || req.body.name == "") {
             return res.json({
                 status: 401,
                 message: "Please enter name"
             });
         } else if (req.body.phone_no == undefined || req.body.phone_no == "") {
             return res.json({
                 status: 401,
                 message: "Please enter phone number"
             });
         } else if (req.body.email == undefined || req.body.email == "") {
             return res.json({
                 status: 401,
                 message: "Please enter email"
             });
         }   else {
            //  var isExists = await knex('admin').where("email", req.body.email).limit(1);
            //  console.log(isExists.length == 0 && 1 == 1);
            //  if (isExists.length = 1 || req.user.email == req.body.email) {
               
            // return res.json({
            //         status: 401,
            //         message: "This sub admin already exists"
            //     })
            //  }else{
              
                var isSaveData = await knex('admin').where({
                    id: req.user.id
             }).update(
                 {
                     name: req.body.name,
                     email: req.body.email,
                     phone_no: req.body.phone_no,
                    //  password: md5(req.body.password),
                     role: req.body.role,
                     updated_at: new Date()
                 }
             );
              console.log(isSaveData);
             if (isSaveData == 1) {
                 
                 return res.json({
                     status: 201,
                     data: isSaveData,
                     message: "This is the create sub admin route"
                 })
             } else {
                 return res.json({
                     status: 401,
                     message: "Account not create  !!!"
                 })
             }
             
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