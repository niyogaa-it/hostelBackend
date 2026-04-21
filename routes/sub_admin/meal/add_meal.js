/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/", async (req, res) => {
  try {
    if (req.body.veg_breakfast == undefined || req.body.veg_breakfast == "") {
      return res.json({
        status: 401,
        message: "Please enter veg breakfast",
      });
    } else if (req.body.veg_lunch == undefined || req.body.veg_lunch == "") {
      return res.json({
        status: 401,
        message: "Please enter veg lunch",
      });
    } else if (req.body.veg_dinner == undefined || req.body.veg_dinner == "") {
      return res.json({
        status: 401,
        message: "Please enter veg dinner",
      });
    } else if (
      req.body.no_veg_breakfast == undefined ||
      req.body.no_veg_breakfast == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter non veg breakfast",
      });
    } else if (
      req.body.no_veg_lunch == undefined ||
      req.body.no_veg_lunch == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter non veg lunch",
      });
    } else if (
      req.body.no_veg_dinner == undefined ||
      req.body.no_veg_dinner == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter non veg dinner",
      });
    } else if (
      req.body.eggetarian_breakfast == undefined ||
      req.body.eggetarian_breakfast == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter eggetarian breakfast",
      });
    } else if (
      req.body.eggetarian_lunch == undefined ||
      req.body.eggetarian_lunch == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter eggetarian lunch",
      });
    } else if (
      req.body.eggetarian_dinner == undefined ||
      req.body.eggetarian_dinner == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter eggetarian dinner",
      });
    } else {
      console.log(req.body);
      var listData = await knex("student_details").where({
        is_approved: 1,
      });
      listData.forEach(async (element) => {
        await knex("notifications").insert([
          {
            student_id: element.id,
            student_name: element.SFname,
            title: "Today Meal",
            des: "New meal added",
            status: 0,
            student_status: 0,
            created_at: new Date(),
          },
        ]);
      });
      var isSaveData = await knex("today_meal").insert([
        {
          veg_breakfast: req.body.veg_breakfast,
          veg_lunch: req.body.veg_lunch,
          veg_dinner: req.body.veg_dinner,
          no_veg_breakfast: req.body.no_veg_breakfast,
          no_veg_lunch: req.body.no_veg_lunch,
          no_veg_dinner: req.body.no_veg_dinner,
          eggetarian_breakfast: req.body.eggetarian_breakfast,
          eggetarian_lunch: req.body.eggetarian_lunch,
          eggetarian_dinner: req.body.eggetarian_dinner,
          status: 1,
          created_at: new Date(),
        },
      ]);
      // console.log(ok);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Meal Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add Meal",
        });
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
