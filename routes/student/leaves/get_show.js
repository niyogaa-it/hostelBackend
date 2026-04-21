const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/", async (req, res) => {
  try {
    // console.log(req.user);
    var getData = await knex("leaves_students").where({
      student_id: req.user.id,
    }).orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get Leaves Students",
      result: getData,
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
    var getData = await knex("leaves_students").orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get Leaves Students",
      result: getData,
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
