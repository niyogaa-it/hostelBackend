/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
var moment = require("moment");
//const csv = require('csv-parser');
const fs = require('fs');
const csv=require('csvtojson');

router.get("/", async (req, res) => {
  try {
    let results = [];

    // creating the pipe for formatting data from csv
    const csvFilePath='/var/www/admin_ranimey_attendance/DailyAttendanceLogsDetails.csv';
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
      console.log(jsonObj); 
    })

    // fetching the json object from csv file
    const jsonArray=await csv().fromFile(csvFilePath);

    // iterating the json object and inserting it to the attendance table
    for(const infoObj of jsonArray) {
      // checking for student department
      if(infoObj['Department'] == 'Student') {
        // inserting the data to student_attandance table
        var isSaveData = await knex("student_attendance").insert([
          {
              email: infoObj['Degination'],
              in_time: infoObj['Out Time'],
              out_time: infoObj['In Time'],
              created: moment(infoObj['Date']).format("YYYY-MM-DD"),
          },
        ]);
      }
    }

    
    return res.json({
      status: 201,
      message: "successfull3",
      data: jsonArray,
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


module.exports = router;
