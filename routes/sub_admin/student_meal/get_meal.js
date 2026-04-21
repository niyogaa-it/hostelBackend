const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
router.get("/", async (req, res) => {
  const selectedRows = await knex("meal_plan")
    .whereNot({
      status: '3',
    })
    .orderBy("id", "desc");
  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});


module.exports = router;
