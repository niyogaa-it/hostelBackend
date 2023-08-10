/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

 const express = require("express");
 const router = express.Router();
 const knex = require("../../../module/knex_connect");
 
 router.post("/", async (req, res) => {
   try {
     if (req.body.request_type == undefined || req.body.request_type == "") {
       return res.json({
         status: 401,
         message: "Please enter request type",
       });
     }  else   if (req.body.request_value == undefined || req.body.request_value == "") {
      return res.json({
        status: 401,
        message: "Please enter request value",
      });
    }  else {
       var isSaveData = await knex("upgrade_request").insert([
         {
           student_id: req.user.id,
           student_name: req.user.SFname,
           request_type: req.body.request_type,
           request_value: req.body.request_value,
           created_at: new Date(),
           status: 1,
         },
       ]);
       await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: "Upgrade Request",
          des: "Upgrade Request request from " + req.user.SFname,
          status: 0,
          student_status: 0,
          created_at: new Date(),
  
        },
      ]);
       // console.log(ok);
       if (isSaveData.length == 1) {
         return res.json({
           status: 201,
           message: "Upgrade Request Successfully",
         });
       } else {
         return res.json({
           status: 401,
           message: "Failed to add",
         });
       }
     }
   } catch (error) {
     // console.log(ok);
     return res.json({
       status: 401,
       message: error.message,
     });
   }
 });
 
 module.exports = router;
 