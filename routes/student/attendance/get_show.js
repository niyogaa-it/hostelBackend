const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/", async (req, res) => {

  try {
       
    // const getData = {
    //   // existing data
    //   title: "Attendance Rules & Regulation",
    //   url: process.env.BASE_URL+'attendance/RMH-handbook.pdf'
    // };

    const getData = {
     
      title: "Attendance Rules & Regulation",
      url: process.env.BASE_URL+'public/attendance/attendance.html'
    };

    return res.json({
      status: 200,
      message: "Successfully get show",
      result: getData
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


module.exports = router;
