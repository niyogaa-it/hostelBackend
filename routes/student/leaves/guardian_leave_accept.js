const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/", async (req, res) => {
  try {
    // console.log(req.headers);
    if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    }
    
    var getData = await knex("leaves_students")
      .where({
        student_id: req.user.id,
        id: req.body.id,
      })
      .update({
        status: 2,
        updated_at: new Date(),
      });
      await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: "Leave Application",
          des: "Guardian accepted your leave",
          status: 0,
          student_status: 0,
          created_at: new Date(),
        },
      ]);
      await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: "Leave Request",
          des: "Leave request has been accepted by the guardian of the student",
          status: 0,
          student_status: 0,
        created_at: new Date(),

        },
      ]);
    // console.log(ok);
    if (getData == 1) {
      return res.json({
        status: 200,
        message: "Successfully Leaves Approved",
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


router.post("/update", async (req, res) => {
    try {
      // console.log(req.headers);
      if (req.body.id == undefined || req.body.id == "") {
        return res.json({
          status: 401,
          message: "Please enter id",
        });
      }
      var data = await knex("leaves_students")
      .where({
        // student_id: req.user.id,
        id: req.body.id,
      });
      // console.log(req.body.status);
      var getData = await knex("leaves_students")
        .where({
          // student_id: req.user.id,
          id: req.body.id,
        })
        .update({
          status: req.body.status,
          updated_at: new Date(),
        });
        if (req.body.status == 0) {
          await knex("notifications").insert([
            {
              student_id: data[0].student_id,
              student_name: data[0].student_name,
              title: "Leave Request",
              des: "Leave request has been rejected"   ,
              status: 0,
              student_status: 0,
            created_at: new Date(),
    
            },
          ]);
        }

        if (req.body.status == 3) {
          await knex("notifications").insert([
            {
              student_id: data[0].student_id,
              student_name: data[0].student_name,
              title: "Leave Request",
              des: "Leave request has been approved",
              status: 0,
              student_status: 0,
            created_at: new Date(),
    
            },
          ]);
        }
        
      // console.log(ok);
      if (getData == 1) {
        return res.json({
          status: 200,
          message: "Successfully Leaves Approved",
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
