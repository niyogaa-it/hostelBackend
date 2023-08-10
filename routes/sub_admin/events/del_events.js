const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
router.post("/", async (req, res) => {
  
  if (req.body.id == undefined || req.body.id == "") {
    return res.json({
      status: 401,
      message: "Please enter id",
    });
  } else {
    var isSaveData = await knex("events")
      .where({
        id: req.body.id,
      })
      .update({
        status: 0,
        updated_at: new Date(),
      });
    console.log(isSaveData);
    if (isSaveData == 1) {
      return res.json({
        status: 201,
        data: isSaveData,
        message: "Deleted Successfully",
      });
    } else {
      return res.json({
        status: 401,
        message: "Failed to delete",
      });
    }
  }
});

module.exports = router;
