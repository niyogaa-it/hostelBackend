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
    var getData = await knex("emergency").where({
      id: req.body.id,
    });
    console.log("getData", getData);
    var getUser = await knex("student_details").where({
      id: getData[0].student_id,
    });
    // console.log(getUser[0].StudEmail);
    sentMailTo(
      getUser[0].StudEmail,
      "Emergency",
      req.body.status == 2
        ? `Your emergency issue has been resolved. ${req.body.comment}`
        : `Your Emergency query is not resolved. ${req.body.comment}`
    );
    await knex("notifications").insert([
      {
        student_id: getUser[0].id,
        student_name: getUser[0].SFname,
        title: "Emergency",
        des:
          req.body.status == 2
            ? `Your emergency issue has been resolved. ${req.body.comment}`
            : `Your Emergency query is not resolved. ${req.body.comment}`,
        status: 0,
        student_status: 0,
        created_at: new Date(),
      },
    ]);
    var updateData = await knex("emergency")
      .where({
        id: req.body.id,
      })
      .update({
        comment: req.body.comment,
        status: req.body.status,
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
