const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

var moment = require('moment');

router.get("/", async (req, res) => {
  let selectedRows;
  var d = new Date();
  //var weekly_meal_day = d.getDay();
  var weekly_meal_day = "1";
  selectedRows = await knex("meal_schedule_foods").where("meal_schedule.meal_weekDay_name", weekly_meal_day).orderBy("meal_schedule_foods.id", "desc").join('meal_plan', 'meal_plan.id', 'meal_schedule_foods.meal_id').join('meal_schedule', 'meal_schedule.id', 'meal_schedule_foods.meal_schedule_id');
  
  
  let mealDay= [];
  if(selectedRows.length == 0)
  {
    return res.json({
      status: 401,
      message: "No records present",
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
        if(!mealDay[Day].veg_breakfast){
          mealDay[Day].veg_breakfast = [];
        }
        if(!mealDay[Day].no_veg_breakfast){
          mealDay[Day].no_veg_breakfast = [];
        }
        if(!mealDay[Day].eggetarian_breakfast){
          mealDay[Day].eggetarian_breakfast = [];
        }

        if(element.food_preference == 'VEG') {
          mealDay[Day].veg_breakfast.push(element.meal_name);
        } else if(element.food_preference == 'NON VEG') {
          mealDay[Day].no_veg_breakfast.push(element.meal_name);
        } else if(element.food_preference == 'EGGETERIAN') {
          mealDay[Day].eggetarian_breakfast.push(element.meal_name);
        }
      }
      if(element.meal_type == 'lunch')
      {
        if(!mealDay[Day].veg_lunch){
          mealDay[Day].veg_lunch = [];
        }
        if(!mealDay[Day].no_veg_lunch){
          mealDay[Day].no_veg_lunch = [];
        }
        if(!mealDay[Day].eggetarian_lunch){
          mealDay[Day].eggetarian_lunch = [];
        }
        

        if(element.food_preference == 'VEG') {
          mealDay[Day].veg_lunch.push(element.meal_name);
        } else if(element.food_preference == 'NON VEG') {
          mealDay[Day].no_veg_lunch.push(element.meal_name);
        } else if(element.food_preference == 'EGGETERIAN') {
          mealDay[Day].eggetarian_lunch.push(element.meal_name);
        }
      }
      if(element.meal_type == 'snacks')
      {
        if(!mealDay[Day].veg_snacks){
          mealDay[Day].veg_snacks = [];
        }
        if(!mealDay[Day].no_veg_snacks){
          mealDay[Day].no_veg_snacks = [];
        }
        if(!mealDay[Day].eggetarian_snacks){
          mealDay[Day].eggetarian_snacks = [];
        }
        

        if(element.food_preference == 'VEG') {
          mealDay[Day].veg_snacks.push(element.meal_name);
        } else if(element.food_preference == 'NON VEG') {
          mealDay[Day].no_veg_snacks.push(element.meal_name);
        } else if(element.food_preference == 'EGGETERIAN') {
          mealDay[Day].eggetarian_snacks.push(element.meal_name);
        }
      }
      if(element.meal_type == 'dinner')
      {
        if(!mealDay[Day].veg_dinner){
          mealDay[Day].veg_dinner = [];
        }
        if(!mealDay[Day].no_veg_dinner){
          mealDay[Day].no_veg_dinner = [];
        }
        if(!mealDay[Day].eggetarian_dinner){
          mealDay[Day].eggetarian_dinner = [];
        }

        if(element.food_preference == 'VEG') {
          mealDay[Day].veg_dinner.push(element.meal_name);
        } else if(element.food_preference == 'NON VEG') {
          mealDay[Day].no_veg_dinner.push(element.meal_name);
        } else if(element.food_preference == 'EGGETERIAN') {
          mealDay[Day].eggetarian_dinner.push(element.meal_name);
        }
      }
      
    });
      let meals = [];
      var i = 0;
      for (const key in mealDay) {
        if(i == 0) {
          let m = mealDay[key];
          m.date = key;
          
          m.veg_breakfast = mealDay[key].veg_breakfast.length > 0 ? mealDay[key].veg_breakfast.join(','):"";
          m.no_veg_breakfast = mealDay[key].no_veg_breakfast.length > 0 ? mealDay[key].no_veg_breakfast.join(','):"";
          m.eggetarian_breakfast = mealDay[key].eggetarian_breakfast.length > 0 ? mealDay[key].eggetarian_breakfast.join(','):"";
          
          
          m.veg_lunch = mealDay[key].veg_lunch.length > 0 ? mealDay[key].veg_lunch.join(','):"";
          m.no_veg_lunch = mealDay[key].no_veg_lunch.length > 0 ? mealDay[key].no_veg_lunch.join(','):"";
          m.eggetarian_lunch = mealDay[key].eggetarian_lunch.length > 0 ? mealDay[key].eggetarian_lunch.join(','):"";
          
          if(mealDay[key].veg_snacks != undefined) {
            m.veg_snacks = mealDay[key].veg_snacks.length > 0 ? mealDay[key].veg_snacks.join(','):"";
            m.no_veg_snacks = mealDay[key].no_veg_snacks.length > 0 ? mealDay[key].no_veg_snacks.join(','):"";
            m.eggetarian_snacks = mealDay[key].eggetarian_snacks.length > 0 ? mealDay[key].eggetarian_snacks.join(','):"";
          } else {
            m.veg_snacks = "";
            m.no_veg_snacks = "";
            m.eggetarian_snacks = "";
          }
          

          m.veg_dinner = mealDay[key].veg_dinner.length > 0 ? mealDay[key].veg_dinner.join(','):"";
          m.no_veg_dinner = mealDay[key].no_veg_dinner.length > 0 ? mealDay[key].no_veg_dinner.join(','):"";
          m.eggetarian_dinner = mealDay[key].eggetarian_dinner.length > 0 ? mealDay[key].eggetarian_dinner.join(','):"";
          
          meals.push(m);
        }
        i++;
      }
      
      return res.json({
        status: 200,
        result_data: meals,
        selectedRows:selectedRows
      });
  }
});

router.get("/get_all_meals", async (req, res) => {
  const selectedRows = await knex("today_meal")
    .where({
      status: 1,
    })
    .orderBy("id", "desc");

  return res.json({
    status: 200,
    result: selectedRows,
  });
});

module.exports = router;
