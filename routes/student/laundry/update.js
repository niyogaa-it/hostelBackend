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
    var data = await knex("laundry")
    .where({
      id: req.body.id,
    })
    var updateData = await knex("laundry")
      .where({
        id: req.body.id,
      })
      .update({
        status: req.body.status,
        updated_at: new Date(),
      });
    await knex("notifications").insert([
      {
        student_id: data[0].student_id,
              student_name: data[0].student_name,
        title: "Laundry",
        des:
          req.body.status == 1
            ? "Your Laundry is processed"
            : req.body.status == 2
            ? "Your Laundry is accepted"
            : req.body.status == 3
            ? "Your Laundry is done"
            : req.body.status == 4
            ? "Your clothes has been dispatched"
            : req.body.status == 5
            ? "Your clothes has been delivered "
            : "unknown " + req.body.status,
        status: 0,
        student_status: 0,
        created_at: new Date(),
      },
    ]);
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
