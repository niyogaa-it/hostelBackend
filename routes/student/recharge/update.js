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
    var getData = await knex("notifications")
      .where({
        student_id: req.user.id,
        id: req.body.id,
      })
      .update({
        student_status: 1,
        updated_at: new Date(),
      });
     
    // console.log(ok);
    if (getData == 1) {
      return res.json({
        status: 200,
        message: "Successfully Notifications",
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
      var getData = await knex("notifications")
        .where({
          // student_id: req.user.id,
          id: req.body.id,
        })
        .update({
          status: req.body.status,
          updated_at: new Date(),
        });
      // console.log(ok);
      if (getData == 1) {
        return res.json({
          status: 200,
          message: "Successfully",
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
