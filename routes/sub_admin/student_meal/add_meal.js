/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

 const express = require("express");
 const router = express.Router();
 const knex = require("../../../module/knex_connect");
 
 router.post("/", async (req, res) => {

  try {
   
       if (req.body.mealType.length==0 ) {
         return res.json({
           status: 401,
           message: "Please select meal type",
         });
       }

       if (req.body.foodPreference.length==0) {
         return res.json({
           status: 401,
           message: "Please select food preference",
         });
       }

       if(req.body.meal_name == undefined || req.body.meal_name == "") {
         return res.json({
           status: 401,
           message: "Please add meal name",
         });
       }
       var saveData = "";
       var mealtype = req.body.mealType;
       var foodpreference = req.body.foodPreference;
       

       for(let i = 0; i < mealtype.length; i++) { 

         for(let j = 0; j < foodpreference.length; j++) {
           
           var isSaveData = await knex("meal_plan").insert([
             {
               meal_type: mealtype[i].id,
               food_preference: foodpreference[j].id,
               meal_name: req.body.meal_name,
               status: '1',
               created_at: new Date(),
             },
           ]);

           //saveData = insertData(mealtype[i].id,foodpreference[j].id,req.body.meal_name);

         }
       }
     
      if (isSaveData.length == 1) {
        return res.json({
          status: 200,
          message: "Meal Added Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add Meal",
          code : saveData,
        });
      }
    }catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



 async function insertData(meal_type,food_preference,meal_name) {

    var isSaveData = await knex("meal_plan").insert([
      {
        meal_type: meal_type,
        food_preference: food_preference,
        meal_name: meal_name,
        status: '1',
        created_at: new Date(),
      },
    ]);
    //console.log('isSaveData',isSaveData.length);
  return isSaveData.length; 
}



 
 module.exports = router;
 