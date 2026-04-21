/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMail } = require("../../../module/mail");

router.post("/", async (req, res) => {
  try {
    // console.log(req.user);
    var isSaveData = await knex("water_can").insert([
      {
        student_id: req.user.id,
        student_name: req.user.SFname,
        room_id: req.user.room_id,
        created_at: new Date(),
        status: 1,
      },
    ]);
    await knex("notifications").insert([
      {
        student_id: req.user.id,
        student_name: req.user.SFname,
        title: "Water Can",
        des: "Water can request from " + req.user.SFname,
        status: 0,
        student_status: 0,
        created_at: new Date(),

      },
    ]);
    // console.log(ok);
    if (isSaveData.length == 1) {
      return res.json({
        status: 201,
        message: "Added Water Can Successfully",
      });
    } else {
      return res.json({
        status: 401,
        message: "Failed to add Water Can",
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
