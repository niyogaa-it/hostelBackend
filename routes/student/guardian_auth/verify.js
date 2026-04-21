const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const jwt = require("jsonwebtoken");
// veridy
router.post("/", async function (req, res) {
  // phone_number
  // orp
  if (req.body.phone_number == undefined || req.body.phone_number == "") {
    return res.json({
      status: 401,
      message: "Please enter phone_number",
    });
  } else if (req.body.orp == undefined || req.body.orp == "") {
    return res.json({
      status: 401,
      message: "Please enter orp",
    });
  } else {
    
      const selectedRows = await knex("phone_auth")
        .where({
          phone_number: req.body.phone_number,
          otp: req.body.orp,
          user_tyoe: 2,
          status: 1,
        })
        .orderBy("id", "desc")
        .limit(1);
      if (selectedRows.length == 0) {
        return res.json({
          status: 401,
          message: "Please enter valid phone number or otp",
        });
      } else {

        var updateOtp = await knex("phone_auth").where( {
          phone_number: req.body.phone_number
        }).update({
          status: 0,
        });


        var token = jwt.sign(
          {
            user_type: selectedRows[0].user_tyoe,
            user_id: selectedRows[0].user_id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1y",
          }
        );
        return res.json({
          status: 200,
          token: token,
          message: "Verified Successfully",
        });
      }
    
  }
});
module.exports = router;
