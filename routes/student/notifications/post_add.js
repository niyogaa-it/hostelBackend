/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/", async (req, res) => {
  try {
    if (req.body.title == undefined || req.body.title == "") {
      return res.json({
        status: 401,
        message: "Please enter title",
      });
    } else if (req.body.message == undefined || req.body.message == "") {
      return res.json({
        status: 401,
        message: "Please enter message",
      });
    } else if (req.body.student_data == undefined || req.body.student_data.length == 0) {
      return res.json({
        status: 401,
        message: "Please select a student",
      });
    } else {
      // generating array of ids for in conditions
      let student_ids = [];
      let all_students = 'no';
      for (const key in req.body.student_data) {
        if(req.body.student_data[key].id == 0) {
          all_students = 'yes';
        } else {
          student_ids.push(req.body.student_data[key].id);
        }
      }
      // return res.json({
      //   status: 201,
      //   message: student_ids,
      // });
      
      if(all_students == 'yes') {
        var listData = await knex("student_details").where({
          is_approved: 1,
        })
      } else {
        var listData = await knex("student_details").where({
          is_approved: 1,
        }).whereIn('id', student_ids);
      }
      

      listData.forEach(async (element) => {
       
        await knex("notifications").insert([
          {
            student_id: element.id,
            student_name: element.SFname,
            title: req.body.title,
            des: req.body.message,
            status: 0,
            student_status: 0,
            created_at: new Date(),
          },
        ]);
      });
      // console.log(ok);
     
        return res.json({
          status: 201,
          message: "Notification Successfully",
        });
      
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
