const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");

router.post("/", async (req, res) => {
    
  if (req.body.id == undefined || req.body.id == "") {
    return res.json({
      status: 401,
      message: "Please enter id",
    });
  } else if (req.body.status == undefined) {
    return res.json({
      status: 401,
      message: "Please enter status",
    });
  } 
  else {
    var isSaveData = await knex("admin")
      .where({
        id: req.body.id,
      })
      .update({
        status: req.body.status,
        updated_at: new Date(),
      });
    console.log(isSaveData);
    if (isSaveData == 1) {
      return res.json({
        status: 200,
        data: isSaveData,
        message: "Status Update",
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
