const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
var moment = require("moment");

router.get("/", async (req, res) => {
  try {
    var getData = await knex("laundry")
      .where({
        student_id: req.user.id,
      })
      .orderBy("id", "desc");

    return res.json({
      status: 200,
      message: "Successfully get Laundry Students",
      result: getData,
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    var getData = await knex("laundry").orderBy("id", "desc");

    return res.json({
      status: 200,
      message: "Successfully get Leaves Students",
      result: getData,
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_token", async (req, res) => {
  try {
    var getData = await knex("laundry_token")
      .where({
        student_id: req.user.id,
        status: 1,
      })
      .limit(1);

    let token_expired = true;

    if (getData.length > 0) {
      if (
        moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss") >
        moment(getData[0].expired_at).format("YYYY-MM-DD HH:mm:ss")
      ) {
        token_expired = true;
      } else {
        token_expired = false;
      }
    }

    return res.json({
      status: 200,
      message: "Laundry token fetched",
      result: getData,
      token_expired: token_expired,
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

module.exports = router;
