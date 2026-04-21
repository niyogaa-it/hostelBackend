/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMail, sentMailTo } = require("../../../module/mail");

router.post("/", async (req, res) => {
  try {
    // console.log(req.user);
    if (req.body.issue_des == undefined || req.body.issue_des == "") {
      return res.json({
        status: 401,
        message: "Please enter feedback",
      });
    }
    if (req.body.help_category == undefined || req.body.help_category == "") {
      return res.json({
        status: 401,
        message: "Please select issue category",
      });
    }
    var isSaveData = await knex("help_quries").insert([
      {
        student_id: req.user.id,
        student_name: req.user.SFname,
        issue_des: req.body.issue_des,
        help_category: req.body.help_category,
        created_at: new Date(),
        status: 1,
      },
    ]);

    await knex("notifications").insert([
      {
        student_id: req.user.id,
        student_name: req.user.SFname,
        title: "Feedback",
        des: "Feedback request from " + req.user.SFname,
        status: 1,
        student_status: 0,
        created_at: new Date(),
      },
    ]);
    await knex("notifications").insert([
      {
        student_id: req.user.id,
        student_name: req.user.SFname,
        title: "Feedback",
        des: "Your have received feedback from " + req.user.SFname,
        status: 0,
        student_status: 2,
        created_at: new Date(),
      },
    ]);
    sentMailTo(
      req.user.StudEmail,
      "Feedback",
      "Dear Ms. " +
        req.user.SFname +
        ",\nGreetings!\n" +
        "Thank you for reaching out and providing us with your valuable feedback. Wishing you a pleasant stay at Chettinad Rani Meyyammai Hostel.\n" +
        "Thanking you.\n" +
        "With Regards," +
        " RM Hostel Team"
    );
    // console.log(ok);
    if (isSaveData.length == 1) {
      return res.json({
        status: 201,
        message: "Added Query Successfully",
      });
    } else {
      return res.json({
        status: 401,
        message: "Failed to add Query",
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
