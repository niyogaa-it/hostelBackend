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

  const selectedStudent = await knex("student_details")
  .select('student_details.*','room.room_number as roomNumber')
  .leftJoin('room', 'student_details.room_id', 'room.id')
  .where("student_details.id","=", req.params.id)
  .limit(1);


  const selectedRows = await knex("student_plan")
      .where({
        student_id: req.params.id,
        status: 1
      })
  .orderBy("id", "desc");



   return res.json({
      status: 200,
      student_plan:selectedRows,
      student_details: selectedStudent[0]
    });

});


module.exports = router;
