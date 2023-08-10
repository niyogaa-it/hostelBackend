/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMailTo } = require("../../../module/mail");
var moment = require("moment");

router.post("/", async (req, res) => {
  try {
    if (req.body.payment_id == undefined || req.body.payment_id == "") {
      return res.json({
        status: 401,
        message: "Please enter payment_id",
      });
    } else if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    } else if (req.body.amount == undefined) {
      return res.json({
        status: 401,
        message: "Please enter amount",
      });
    } else if (req.body.type == undefined || req.body.type == "") {
      return res.json({
        status: 401,
        message: "Please enter type",
      });
    } else {
      var payment_type = "";
      if (req.body.type == "OneTime") {
        payment_type = "One Time";
      } else if (req.body.type == "MealChange") {
        payment_type = "Meal Change";
      } else if (req.body.type == "RoomChange") {
        payment_type = "Room Change";
      }
      else if (req.body.type == "TermChange") {
        payment_type = "Term Change";
      }
      await knex("notifications").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          title: req.body.type,
          des: `${payment_type} payment made by ${req.user.SFname}`,
          status: 0,
          student_status: 0,
          created_at: new Date(),
        },
      ]);
      await knex("payment_activity").insert([
        {
          student_id: req.user.id,
          student_name: req.user.SFname,
          payment_id: req.body.payment_id,
          amount: req.body.amount,
          type: req.body.type,
          plan_id: req.body.id,
          status: 1,
          created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      let update_payment_plan = await knex("student_plan")
        .where({
          student_id: req.user.id,
          id: req.body.id,
        })
        .update({
          //  status: 2,
          paid: "Yes",
          updated_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      if (update_payment_plan == 1) {
        sentMailTo(
          req.user.StudEmail,
          "Renew Plan",
          "Dear Ms. " +
            req.user.SFname +
            "We have received your payment of Rs. " +
            req.body.amount +
            " towards " +
            payment_type +
            ". Thank you. - RMHostel" 
        );

        return res.json({
          status: 201,
          message: "Successfully Recharged. Please reload the app.",
        });
      } else {
        return res.json({
          status: 401,
          message: "Payment failed",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});
router.post("/monthly", async (req, res) => {
  try {
    if (req.body.payment_id == undefined || req.body.payment_id == "") {
      return res.json({
        status: 401,
        message: "Please enter payment_id",
      });
    } else if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    } else if (req.body.amount == undefined) {
      return res.json({
        status: 401,
        message: "Please enter amount",
      });
    } else {
      var listData = await knex("student_details").where({
        id: req.user.id,
        //  is_approved: 1,
      });

      var update_payment = await knex("monthly_payment")
        .where({
          student_id: req.user.id,
          id: req.body.id,
        })
        .update({
          paid: "Yes",
          paid_on: moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss"),
        });

      if (update_payment == 1) {
        await knex("notifications").insert([
          {
            student_id: req.user.id,
            student_name: listData[0].SFname,
            title: "Monthly Payment",
            des: `Monthly payment made by ${listData[0].SFname}`,
            status: 0,
            student_status: 0,
            created_at: new Date(),
          },
        ]);

        sentMailTo(
          listData[0].StudEmail,
          "Monthly Payment",
          "Dear Ms. " +
          listData[0].SFname +
          "We have received your payment of Rs. " +
          req.body.amount +
          " towards " +
          payment_type +
          ". Thank you. - RMHostel" 
        );

        return res.json({
          status: 201,
          message: "Successfully Monthly Recharged. Please reload the app.",
        });
      } else {
        return res.json({
          status: 401,
          message: "Monthly Payment failed",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
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
