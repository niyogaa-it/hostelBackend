/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
const fileUpload = require("../../module/file_upload");
const file_upload = require("../../module/file_upload");
const fs = require("fs");
router.post("/", async (req, res) => {
  try {
    if (req.body.docs_name == undefined || req.body.docs_name == "") {
      return res.json({
        status: 401,
        message: "Please enter docs_name",
      });
    } else if (req.body.docs_image == undefined || req.body.docs_image == "") {
      return res.json({
        status: 401,
        message: "Please enter docs_image",
      });
    } else {
      var StudimageUrl = await base64_decode(req.body.docs_image);

      await knex("student_details_image")
        .where({
          student_id: req.user.id,
        })
        .update({
          docs_name: req.body.docs_name,
          docs_image: StudimageUrl,
          updated_at: new Date(),
        });
      return res.status(200).json({
        status: 200,
        message: "docs uploaded",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

async function base64_decode(base64Image) {
  if (base64Image) {
    base64Image = decodeURIComponent(base64Image);
    var strFirstThree = base64Image.substring(0, 4);
    if (strFirstThree == "http") {
      return base64Image;
    } else {
      let base64String = base64Image.split(";base64,").pop();
      // console.log(base64String);
      const image = Buffer.from(base64String, "base64");
      var imageName = "temp/" + Date.now() + ".png";
      fs.writeFileSync(imageName, image);
      var upload = await file_upload(imageName);
      fs.rmSync(imageName);
      return upload.Location;
    }
  }
}
module.exports = router;
