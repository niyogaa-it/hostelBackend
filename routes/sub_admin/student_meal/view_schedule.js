const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
router.get("/", async (req, res) => {
    console.log(req);
  const selectedRows = await knex("meal_schedule_foods")
    .where({
        meal_schedule_id: req.query.id,
    });

    let foodlist = {};
    if(selectedRows.length >0)
    {
        foodlist = await knex("meal_schedule_foods").join('meal_plan', 'meal_plan.id', 'meal_schedule_foods.meal_id').join('meal_schedule', 'meal_schedule.id', 'meal_schedule_foods.meal_schedule_id').where({
            meal_schedule_id: req.query.id
        });
    }
    
  return res.json({
    status: 200,
    result_data: foodlist,
  });
});


module.exports = router;
