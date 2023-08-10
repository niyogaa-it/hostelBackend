const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/", async (req, res) => {
  try {
  
    var getData = await knex("help_quries").where({
      student_id: req.user.id,
    }).orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get feedback",
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
  
    var getData = await knex("help_quries").orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      message: "Successfully get feedback",
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
