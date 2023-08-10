const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/", async (req, res) => {
    try {
        
      var getData = await knex("meal_schedule_foods").del()
        .where({
            meal_schedule_id: req.body.id,
        });
      console.log(getData);
      if (getData!=null) {
        let x = [];
        x = req.body.meals;
        var isSaveSchedule ;
        for(var i=0; i< x.length; i++)
        {
          isSaveSchedule = await knex("meal_schedule_foods").insert([
            {
              meal_schedule_id: req.body.id,
              meal_id: x[i],
              created_at: new Date()
            },
          ]);
        }
        return res.json({
          status: 200,
          message: "Foods updated successfully",
        });
      } else {
        return res.json({
          status: 404,
          message: "Not Found",
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
