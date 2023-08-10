/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');


 
 
 
 router.post("/", async (req, res) => {
     try {
        if (req.body.building_name == undefined || req.body.building_name == "") {
            return res.json({
                status: 401,
                field_name: "Building name",
                message: "Please select building name"
            }); 
        } else if(req.body.no_of_floor == undefined || req.body.no_of_floor == ""){
            return res.json({
                status: 401,
                field_name: "Floor no",
                message: "Please enter no of ffloor"
            });
        } else {
             var isSaveData = await knex('building').where({
                id: req.body.id,
              })
              .update(
                {
                building_name: req.body.building_name,
                no_of_floor: req.body.no_of_floor,
                status: 1,
                created_at: new Date(),
                updated_at: new Date()
                }
              );
             // console.log(ok);
             if (isSaveData.length == 1) {
                 return res.json({
                     status: 200,
                     message: "Updated room successful"
                 })
             } else {
                 return res.json({
                     status: 200,
                     message: "Updated room successful"
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