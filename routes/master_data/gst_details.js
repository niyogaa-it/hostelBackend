const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");


router.get("/:id", async (req, res) => {
  

  const selectedRows = await knex("tax_setting")
    .where({ id: req.params.id })
    .limit(1);

  if (selectedRows.length > 0) {
    return res.json({
      status: 200,
      details: selectedRows
    });
  } else {
    return res.json({
      status: 401,
      message: "No data found",
    });
  }
});



module.exports = router;
