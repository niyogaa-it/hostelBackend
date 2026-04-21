const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");

router.get("/:id", async (req, res) => {
  if (req.params.id == undefined || req.params.id == "") {
    return res.json({
      status: 401,
      message: "Please enter id",
    });
  }

  const selectedRows = await knex("student_plan")
    .where({ student_id: req.params.id })
    .limit(1);

  if (selectedRows.length > 0) {
    if (selectedRows[0].status !== 1) {
      return res.json({
        status: 204,
        message: "No active plan found for the student.",
      });
    }

    const selectedStudent = await knex("student_details")
      .where({ id: req.params.id })
      .limit(1);

    selectedRows[0].student_name = selectedStudent[0].SFname;
    selectedRows[0].student_email = selectedStudent[0].StudEmail;
    selectedRows[0].student_phone_no = selectedStudent[0].SmobNo;

    return res.json({
      status: 200,
      details: selectedRows[0],
      dd: true
    });
  } else {
    return res.json({
      status: 401,
      message: "No data found",
    });
  }
});

module.exports = router;
