const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/", async (req, res) => {
  try {
    console.log(req.user);
    var getData = await knex("upgrade_request")
      .where({
        student_id: req.user.id,
      })
      .orderBy("id", "desc");
    
    // console.log(ok);

    return res.json({
      status: 200,
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
    var getData = await knex("upgrade_request").orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
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

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
module.exports = router;
