/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMail, sentMailTo } = require("../../../module/mail");
const sentSms = require("../../../module/sent_sms");

router.post("/", async (req, res) => {
  try {
    if (req.body.issue_category == undefined || req.body.issue_category == "") {
      return res.json({
        status: 401,
        message: "Please select issue category",
      });
    } else if (req.body.issue_des == undefined || req.body.issue_des == "") {
      return res.json({
        status: 401,
        message: "Please enter reason",
      });
    } else {
      await sentMail(req.body.issue_category, req.body.issue_des);
      await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: "Emergency",
          des: "Emergency request from " + req.user.SFname,
          status: 0,
          student_status: 0,
          created_at: new Date(),
        },
      ]);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      var getData = await knex("admin").where({
        role: 'admin'
      });

      today = mm + "/" + dd + "/" + yyyy;
      sentSms({
        phone_number: getData[0].phone_no,
        msg:
          "There is an emergency request on " +
          req.body.issue_category +
          " from student " +
          req.user.SFname +
          "of " +
          req.user.building_name +
          "," +
          req.user.room_id +
          ". The request has been raised on " +
          today +
          " at " +
          new Date().getHours() +
          " hours. Parent's contact number: " +
          req.user.FatherConNo +
          ", Guardian's contact number: " +
          req.user.LocGurdConNo +
          ". - RMHostel",
        // msg: "There is an emergency request on "+req.body.issue_category+" from student "+req.user.SFname+" of "+req.user.room_id+" ("+req.user.building_name+", , ). The request has been raised on "+req.body.issue_category+". Parent's contact number: "+req.user.FatherConNo+", Guardian's contact number: "+req.user.LocGurdConNo+". - RMHostel",
      });
      sentMailTo(
        req.user.StudEmail,
        "Emergency",
        "Dear Ms. " +
          req.user.SFname +
          ",\nGreetings!\n" +
          "Thank you for letting us know. We are taking necessary actions on it. Wishing you a pleasant stay at Chettinad Rani Meyyammai Hostel.\n" +
          "Thanking you.\n" +
          "With Regards," +
          "RM Hostel Team"
      );
      //   console.log(req.user);
      var isSaveData = await knex("emergency").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          issue_category: req.body.issue_category,
          issue_des: req.body.issue_des,
          created_at: new Date(),
          status: 1,
        },
      ]);
      // console.log(ok);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Emergency Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add Emergency",
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
