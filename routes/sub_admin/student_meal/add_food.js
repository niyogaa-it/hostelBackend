/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

 const express = require("express");
const moment = require("moment");
 const router = express.Router();
 const knex = require("../../../module/knex_connect");
 
 router.post("/", async (req, res) => {
   try {
    var currentDay = moment(req.body.meal_day).isoWeekday();
    
      var getData = await knex("meal_schedule").where({
        meal_weekDay_name: currentDay,
        meal_day: req.body.meal_day
      });
      if(getData.length == 0)
      {
        
        var isSaveData = await knex("meal_schedule").insert([
          {
             meal_day: req.body.meal_day,
             meal_weekDay_name: currentDay,
             created_at: new Date()
          },
        ]);
        if (isSaveData.length == 1) {
         let x = [];
         x = req.body.meals;
         var isSaveSchedule ;
         for(var i=0; i< x.length; i++)
         {
           isSaveSchedule = await knex("meal_schedule_foods").insert([
             {
               meal_schedule_id: isSaveData[0],
               meal_id: x[i],
               created_at: new Date()
             },
           ]);
         }
         
           return res.json({
             status: 200,
             message: "Added Meal Schedule Successfully",
           });
         
        } else {
          return res.json({
            status: 401,
            message: "Failed to add Meal",
          });
        }
      }else{
        return res.json({
          status: 401,
          message: "Meal exist for the day.",
        });
      }
    
     }catch (error) {
     // console.log(ok);
     return res.json({
       status: 401,
       message: error.message,
     });
   }
 });
 
 module.exports = router;
 