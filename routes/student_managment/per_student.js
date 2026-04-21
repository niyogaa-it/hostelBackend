const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");


router.get("/:id", async (req, res) => {
  if (req.params.id == undefined || req.params.id == "") {
    return res.json({
      status: 401,
      message: "Please enter id",
    });
  }

  const selectedRows = await knex("student_details")
    .where({ id: req.params.id })
    .limit(1);

  if (selectedRows.length > 0) {
    const photoBase = await knex("student_details_image")
      .where({ student_id: req.params.id })
      .limit(1);

    return res.json({
      status: 200,
      details: selectedRows,
      photo: photoBase,
    });
  } else {
    return res.json({
      status: 401,
      message: "No data found",
    });
  }
});



module.exports = router;
