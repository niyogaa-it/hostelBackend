const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

var moment = require('moment');

router.get("/", async (req, res) => {
  let selectedRows;
  let currentday = req.query.date;

  if(currentday == 'all'){
    selectedRows = await knex("meal_schedule_foods").orderBy("meal_schedule_foods.id", "desc").join('meal_plan', 'meal_plan.id', 'meal_schedule_foods.meal_id').join('meal_schedule', 'meal_schedule.id', 'meal_schedule_foods.meal_schedule_id');
  } else if(currentday != undefined && currentday != '') {
    var d = new Date(currentday);
    var weekly_meal_day = d.getDay();
    selectedRows = await knex("meal_schedule_foods").where("meal_schedule.meal_weekDay_name", weekly_meal_day).orderBy("meal_schedule_foods.id", "desc").join('meal_plan', 'meal_plan.id', 'meal_schedule_foods.meal_id').join('meal_schedule', 'meal_schedule.id', 'meal_schedule_foods.meal_schedule_id');
  } else {
    return res.json({
      status: 401,
      message: "Invalid Input",
    });
  }

  
  let mealDay= [];
if(selectedRows.length == 0)
{
  return res.json({
    status: 401,
    message: "No records present1",
  });
}else{
  selectedRows.forEach(element => {
    let Day = moment(element.meal_day).format('MM/DD/YYYY');
    if(!mealDay[Day]){
      mealDay[Day] = {};
      mealDay[Day].id = element.meal_schedule_id;
    }
     if(element.meal_type == 'breakfast')
     {
      if(!mealDay[Day].breakfast){
        mealDay[Day].breakfast = [];
      }
      mealDay[Day].breakfast.push(element.meal_name);
     }
     if(element.meal_type == 'lunch')
     {
      if(!mealDay[Day].lunch){
        mealDay[Day].lunch = [];
      }
      mealDay[Day].lunch.push(element.meal_name);
     }
     if(element.meal_type == 'dinner')
     {
      if(!mealDay[Day].dinner){
        mealDay[Day].dinner = [];
      }
      mealDay[Day].dinner.push(element.meal_name);
     }
    
  });
    let meals = [];
    for (const key in mealDay) {
      let m = mealDay[key];
      m.date = key;
      meals.push(m);
    }
    console.log(meals);
    return res.json({
      status: 200,
      result_data: meals
    });
}
 
  
});


module.exports = router;
