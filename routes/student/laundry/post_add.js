/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMail } = require("../../../module/mail");
var moment = require("moment");

router.post("/", async (req, res) => {
  try {
    var get_laundry_token = await knex("laundry_token").where({
      student_id: req.user.id,
      status: 1,
    });

    //return
    if (get_laundry_token.length == 0) {
      return res.json({
        status: 401,
        message: "No laundry token found for you",
      });
    } else {
      if (
        moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss") >
        moment(get_laundry_token[0].expired_at).format("YYYY-MM-DD HH:mm:ss")
      ) {
        return res.json({
          status: 401,
          message:
            "Your laundry token has expired. Please wait till new token is issued.",
        });
      } else {
        if (req.body.no_cloth == undefined || req.body.no_cloth == "") {
          return res.json({
            status: 401,
            message: "Please enter no of cloth",
          });
        } else if (
          req.body.cloths_json == undefined ||
          req.body.cloths_json == ""
        ) {
          return res.json({
            status: 401,
            message: "Please enter to which cloths",
          });
        } else {
          await sentMail(req.body.issue_category, req.body.issue_des);
          //   console.log(req.user);
          await knex("notifications").insert([
            {
              student_id: req.user.id,
              student_name: req.user.SFname,
              title: "Laundry",
              des: "Laundry request from " + req.user.SFname,
              status: 0,
              student_status: 2,
              created_at: new Date(),
            },
          ]);
          var isSaveData = await knex("laundry").insert([
            {
              student_id: req.user.id,
              student_name: req.user.SFname,
              no_cloth: req.body.no_cloth,
              floor: req.user.room_id,
              cloths_json: req.body.cloths_json,
              created_at: new Date(),
              laundry_token: get_laundry_token[0].id,
              status: 1,
            },
          ]);
          var change_token_status = await knex("laundry_token")
            .where({ student_id: req.user.id, status: 1 })
            .update({
              status: 0,
            });
          // console.log(ok);
          if (isSaveData.length == 1) {
            return res.json({
              status: 201,
              message: "Added Laundry Successfully",
            });
          } else {
            return res.json({
              status: 401,
              message: "Failed to add Laundry",
            });
          }
        }
      }
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
