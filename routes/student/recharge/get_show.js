const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.post("/get", async (req, res) => {
  try {
    var listData = await knex("student_details").where({
      id: req.user.id,
      is_approved: 1,
    });

    return res.json({
      status: 200,
      message: "Successfully details fetched",
      result: listData[0],
    });
    var plan = await knex("plan").where({
      plan: req.body.plan_type,
      food_preference: listData[0].food_preference,
      room_type: listData[0].occupancy,
      parking: listData[0].parking,
    });

    var data = await knex("recharge").where({
      student_id: req.user.id,
    });
    var dateNow;
    if (data.length == 0) {
      dateNow = new Date(
        new Date().getFullYear() + "-" + new Date().getMonth() + "-" + "05"
      );
    } else {
      dateNow = new Date(data[data.length - 1].end_date);
    }
    return res.json({
      status: 200,
      message: "Successfully get Notifications",
      result: plan,
      end_date:
        plan.length > 0
          ? addDays(dateNow, plan[0].plan == "Monthly" ? 30 : 365)
          : "",
      current_plan: data.length == 0 ? {} : data[data.length - 1],
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    console.log(req.user);
    var getData = await knex("payment_activity")
      .where({
        student_id: req.user.id,
      })
      .orderBy("id", "desc");
    var data = await knex("recharge").where({
      student_id: req.user.id,
    });
    var dateNow;
    if (data.length == 0) {
      dateNow = new Date(
        new Date().getFullYear() + "-" + new Date().getMonth() + "-" + "05"
      );
    } else {
      dateNow = new Date(data[0].end_date);
    }
    // console.log(ok);

    return res.json({
      status: 200,
      result: getData,
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_my_plan", async (req, res) => {
  try {
    var listData = await knex("student_plan").where({
      student_id: req.user.id,
      status: 1
    });

    var studentData = await knex("student_details").where({
      id: req.user.id
    }).select("id",  "SFname");

    if (listData.length > 0) {
      return res.json({
        status: 200,
        message: "Successfully plan fetched",
        plan_details: listData[0],
        studentData: studentData[0]
      });
    } else {
      return res.json({
        status: 401,
        data:req.user.id,
        message: "No plans found for you",
      });
    }
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/payment/all", async (req, res) => {
  try {
    console.log(req.user);
    var getData = await knex("payment_activity").orderBy("id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      result: getData,
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_monthly_plan", async (req, res) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    let month_name = monthNames[d.getMonth()];
    var listData = await knex("monthly_payment").where({
      student_id: req.user.id,
      status: 1,
      for_month: month_name,
    //  paid: null,
    });

   

    return res.json({
      status: 200,
      message: "Successfully monthly details fetched",
      result: listData.length > 0 ? listData[0] : [],
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
module.exports = router;
