const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMailTo } = require("../../../module/mail");

router.post("/", async (req, res) => {
  try {
    // console.log(req.headers);
    if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    }
    // var getData = await knex("help_quries").where({
    //   id: req.body.id,
    // });
    var data = await knex("help_quries").where({
      id: req.body.id,
    });
    await knex("notifications").insert([
      {
        student_id: data[0].student_id,
        student_name: data[0].student_name,
        title: "Feedback",
        des: "Admin has been seen your feedback",
        status: 0,
        student_status: 0,
        created_at: new Date(),
      },
    ]);
    var updateData = await knex("help_quries")
      .where({
        id: req.body.id,
      })
      .update({
        status: req.body.status,
        comment: req.body.comment,
        updated_at: new Date(),
      });
    // console.log(ok);
    if (updateData == 1) {
      return res.json({
        status: 200,
        message: "Successfully Resolved",
      });
    } else {
      return res.json({
        status: 404,
        message: "Not Found",
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
