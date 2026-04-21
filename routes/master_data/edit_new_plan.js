/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');

 router.post("/", async (req, res) => {
     
     try {
        if (req.body.id == undefined || req.body.id == "" ) {
            return res.json({
                status: 401,
                field_name: "id",
                message: "Id is required"
            }); 
        } else if(req.body.addmission_fee == undefined || req.body.addmission_fee == "" ){
            return res.json({
                status: 401,
                field_name: "addmission_fee",
                message: "Please Mention the addmission fee amount"
            });
        }else if(req.body.admisson_kit == undefined || req.body.admisson_kit == "" ){
            return res.json({
                status: 401,
                field_name: "admisson_kit",
                message: "Please Mention the admisson kit amount"
            });
        }else if(req.body.caution_deposit == undefined || req.body.caution_deposit == "" ){
            return res.json({
                status: 401,
                field_name: "caution_deposit",
                message: "Please Mention the caution deposit amount"
            });
        }else if(req.body.room_rent == undefined || req.body.room_rent == "" ){
            return res.json({
                status: 401,
                field_name: "room_rent",
                message: "Please Mention the room rent amount"
            });
        } else {
            

             var isSaveData = await knex('plan_new_student').where({
                id: req.body.id,
              })
              .update(
                {
                    addmission_fee: req.body.addmission_fee,
                    admisson_kit: req.body.admisson_kit,
                    cultural_fees: req.body.cultural_fees,
                    caution_deposit: req.body.caution_deposit,
                    room_rent: req.body.room_rent,
                    total: req.body.total,
                    created_at: new Date()
                   
                }
             );
             // console.log(ok);
             
             if (isSaveData == 1) {
 
                 return res.json({
                     status: 201,
                     message: "Data updated successful"
                 })
             } else {
                 return res.json({
                     status: 401,
                     message: "Failed to update data"
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