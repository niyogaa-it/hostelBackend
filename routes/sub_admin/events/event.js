/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const file_upload = require("../../../module/file_upload");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const fs = require("fs");
router.post("/", async (req, res) => {
  try {
    if (
      req.body.StudimagepathBase == undefined ||
      req.body.StudimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select image",
      });
    } else if (req.body.event_name == undefined || req.body.event_name == "") {
      return res.json({
        status: 401,
        message: "Please select event name",
      });
    } else if (
      req.body.event_start_time == undefined ||
      req.body.event_start_time == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter event start time",
      });
    } else if (
      req.body.event_end_time == undefined ||
      req.body.event_end_time == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter event end time",
      });
    } else if (
      req.body.description == undefined ||
      req.body.description == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter description",
      });
    } else {
      var eventUrl = await base64_decode(req.body.StudimagepathBase);
      var isSaveData = await knex("events").insert([
        {
          image_url: eventUrl,
          event_name: req.body.event_name,
          event_start_date: req.body.event_start_time,
          event_end_date: req.body.event_end_time,
          des: req.body.description,
          created_at: new Date(),
          status: 1,
        },
      ]);
      var listData = await knex("student_details").where({
        is_approved: 1,
      });
      listData.forEach(async (element) => {
        await knex("notifications").insert([
          {
            student_id: element.id,
            student_name: element.SFname,
            title: "Events",
            des: "New event added",
            status: 0,
            student_status: 0,
            created_at: new Date(),
          },
        ]);
      });
      // console.log(ok);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Events Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add events",
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
async function base64_decode(base64Image) {
  let base64String = base64Image.split(";base64,").pop();
  // console.log(base64String);
  const image = Buffer.from(base64String, "base64");

  var imageName = "temp/" + Date.now() + ".png";

  fs.writeFileSync(imageName, image);
  var upload = await file_upload(imageName);
  // fs.rmSync(imageName);
  return upload.Location;
}
module.exports = router;
