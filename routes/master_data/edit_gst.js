/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');

 router.post("/", async (req, res) => {
     
     try {
        if (req.body.cgst == undefined || req.body.cgst == "" ) {
            return res.json({
                status: 401,
                field_name: "cgst",
                message: "Please Mention the CGST amount"
            }); 
        }  else if(req.body.sgst == undefined || req.body.sgst == "" ){
            return res.json({
                status: 401,
                field_name: "sgst",
                message: "Please Mention the SGST amount"
            });
        }  else {
            

             var isSaveData = await knex('tax_setting').where({
                id: req.body.id,
              })
              .update(
                {
                    cgst: req.body.cgst,
                    sgst: req.body.sgst,
                    created_at: new Date()
                }
             );
             // console.log(ok);
             
             if (isSaveData == 1) {
 
                 return res.json({
                     status: 201,
                     message: "GST updated successful"
                 })
             } else {
                 return res.json({
                     status: 401,
                     message: "Failed to add building"
                 })
             }}
         
     } catch (error) {
         // console.log(ok);
         return res.json({
             status: 401,
             message: error.message
         })
     }
 });
 
 module.exports = router;