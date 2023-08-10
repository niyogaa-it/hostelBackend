/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/", async (req, res) => {
  try {
    if (req.body.from == undefined || req.body.from == "") {
      return res.json({
        status: 401,
        message: "Please enter from date",
      });
    } else if (req.body.to == undefined || req.body.to == "") {
      return res.json({
        status: 401,
        message: "Please enter to date",
      });
    } else if (req.body.reason == undefined || req.body.reason == "") {
      return res.json({
        status: 401,
        message: "Please enter  reason",
      });
    } else {
      await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: "Leave Application",
          des: "Your leave application has been submited ",
          status: 0,
          student_status: 0,
          created_at: new Date(),
        },
      ]);
    //   console.log(req.user);
      var isSaveData = await knex("leaves_students").insert([
        {
          student_id: req.user.id,
          student_guardian_no: req.user.FatherConNo,
          student_name: req.user.SFname,
          from: new Date(req.body.from),
          to: new Date(req.body.to),
          reason: req.body.reason,
          created_at: new Date(),
          status: 1,
        },
      ]);
      
      // console.log(ok);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Leaves Students Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add Leaves Students",
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
