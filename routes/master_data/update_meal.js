/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');


 
 
 
 router.post("/", async (req, res) => {
     try {
        if (req.body.meal_type == undefined || req.body.meal_type == "") {
            return res.json({
                status: 401,
                field_name: "Meal Type",
                message: "Please select meal type"
            }); 
        } else if (req.body.food_preference == undefined || req.body.food_preference == "") {
            return res.json({
                status: 401,
                field_name: "Food Preference",
                message: "Please select food preference"
            }); 
        } else if(req.body.meal_name == undefined || req.body.meal_name == ""){
            return res.json({
                status: 401,
                field_name: "Meal Name",
                message: "Please enter meal name"
            });
        } else {
             var isSaveData = await knex('meal_plan').where({
                id: req.body.id,
              })
              .update(
                {
                meal_type: req.body.meal_type,
                food_preference: req.body.food_preference,
                meal_name: req.body.meal_name,
                status: 1,
                created_at: new Date()
                }
              );
             // console.log(ok);
             if (isSaveData.length == 1) {
                 return res.json({
                     status: 200,
                     message: "Updated meal successful"
                 })
             } else {
                 return res.json({
                     status: 200,
                     message: "Updated meal successful"
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