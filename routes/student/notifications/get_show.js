const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/", async (req, res) => {
  try {
    // console.log(req.user);
    var getData = await knex("notifications").where({
      student_id: req.user.id,
      student_status : 0,
    }).orWhere({
      student_id: req.user.id,
      student_status : 1,
    }).orderBy("id", "desc");
    var lengthData = await knex("notifications").where({
        student_id: req.user.id, 
        student_status: 0   
    }).count("id as length");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get Notifications",
      result: getData,
      unseen: lengthData[0].length,
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    console.log(req.user);
    var getData = await knex("notifications").orderBy("id", "desc");
    var lengthData = await knex("notifications").where({
        status: 0   
    }).count("id as length");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get Notifications",
      result: getData,
        unseen: lengthData[0].length,
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

module.exports = router;
