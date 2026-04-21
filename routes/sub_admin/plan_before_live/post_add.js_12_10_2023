/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const file_upload = require("../../../module/file_upload");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const fs = require("fs");
var moment = require("moment");
const { sentMailTo } = require("../../../module/mail");
const sentSms = require("../../../module/sent_sms");

router.post("/", async (req, res) => {
  try {
    if (req.body.plan_name == undefined || req.body.plan_name == "") {
      return res.json({
        status: 401,
        message: "Please enter plan name",
      });
    } else if (req.body.plan_price == undefined || req.body.plan_price == "") {
      return res.json({
        status: 401,
        message: "Please enter plan price",
      });
    } else if (req.body.plan == undefined || req.body.plan == "") {
      return res.json({
        status: 401,
        message: "Please select plan ",
      });
    } else if (
      req.body.food_preference == undefined ||
      req.body.food_preference == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select food preference",
      });
    } else if (req.body.room_type == undefined || req.body.room_type == "") {
      return res.json({
        status: 401,
        message: "Please select room type",
      });
    } else if (req.body.parking == undefined || req.body.parking == "") {
      return res.json({
        status: 401,
        message: "Please select parking",
      });
    } else {
      var isSaveData = await knex("plan").insert([
        {
          plan_name: req.body.plan_name,
          plan_price: req.body.plan_price,
          plan: req.body.plan,
          food_preference: req.body.food_preference,
          room_type: req.body.room_type,
          parking: req.body.parking,
          created_at: new Date(),
          status: 1,
        },
      ]);
      // console.log(ok);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Plan Successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add",
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

router.post("/set_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (
      (!req.body.hasOwnProperty("monthly") && req.body.plan_id == undefined) ||
      req.body.plan_id == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter plan id",
      });
    } else if (req.body.bed_type == undefined || req.body.bed_type == "") {
      return res.json({
        status: 401,
        message: "Please select bed type ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.addmission_fee == undefined || req.body.addmission_fee == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter addmission fees ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.admisson_kit == undefined || req.body.admisson_kit == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter addmission kit fees ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.caution_deposit == undefined || req.body.caution_deposit == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter caution deposit ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.cultural_fees == undefined || req.body.cultural_fees == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter cultural fees ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.laundry == undefined || req.body.laundry == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter laundry ",
      });
    } else if (req.body.meal == undefined || req.body.meal == "") {
      return res.json({
        status: 401,
        message: "Please enter meal ",
      });
    } else if (req.body.meal_type == undefined || req.body.meal_type == "") {
      return res.json({
        status: 401,
        message: "Please select meal type ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.plan_type == undefined || req.body.plan_type == "")
    ) {
      return res.json({
        status: 401,
        message: "Please send plan type ",
      });
    } else if (req.body.parking == undefined) {
      return res.json({
        status: 401,
        message: "Please enter parking ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.plan_id == undefined || req.body.plan_id == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter plan id ",
      });
    } else if (req.body.room_no == undefined || req.body.room_no == "") {
      return res.json({
        status: 401,
        message: "Please enter room no ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.term == undefined || req.body.term == "")
    ) {
      return res.json({
        status: 401,
        message: "Please select term ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.room_rent == undefined || req.body.room_rent == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter room rent ",
      });
    } else if (
      req.body.student_type == undefined ||
      req.body.student_type == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select student type ",
      });
    } else if (req.body.StudEmail == undefined || req.body.StudEmail == "") {
      return res.json({
        status: 401,
        message: "Please enter student email ",
      });
    } else if (req.body.SFname == undefined || req.body.SFname == "") {
      return res.json({
        status: 401,
        message: "Please enter student name ",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.to_pay == undefined || req.body.to_pay == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter amount to pay",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.total_one_time == undefined || req.body.total_one_time == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter total one time payment",
      });
    } else if (req.body.SmobNo == undefined || req.body.SmobNo == "") {
      return res.json({
        status: 401,
        message: "Please enter student phone number",
      });
    } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.total == undefined || req.body.total == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter total ",
      });
    } else if (
      req.body.transportation == undefined &&
      !req.body.hasOwnProperty("monthly")
    ) {
      return res.json({
        status: 401,
        message: "Please enter transportation ",
      });
    }  else {
      var check_user = await knex("student_plan").where({
        student_id: req.body.student_id,
        status: 1,
      });
      if (check_user.length > 0) {
        return res.json({
          status: 401,
          message: "Plan already set for this student",
        });
      } else {
        let studentParams = {
          student_id: req.body.student_id,
          plan_id: req.body.plan_id,
          bed_type: req.body.bed_type,
          student_type: req.body.student_type,
          term: req.body.term,
          addmission_fee: req.body.addmission_fee,
          admisson_kit: req.body.admisson_kit,
          caution_deposit: req.body.caution_deposit,
          cultural_fees: req.body.cultural_fees,
          room_no: req.body.room_no,
          room_rent: req.body.room_rent,
          parking: req.body.parking,
          parking_type:
            req.body.parking_type != "" ? req.body.parking_type : null,
          transportation: req.body.transportation,
          meal: req.body.meal,
          meal_type: req.body.meal_type,
          laundry: req.body.laundry,
          total: req.body.total,
          plan_type: req.body.plan_type,
          total_one_time: req.body.total_one_time,
          to_pay: req.body.to_pay,
          created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
          status: 1,
        };
        if (req.body.hasOwnProperty("monthly")) {
          const total_bill = (
            Number(req.body.monthly_four_wheeler_parking_fee) +
            Number(req.body.monthly_two_wheeler_parking_fee) +
            Number(req.body.monthly_water_bill) +
            Number(req.body.monthly_electricity_bill) +
            Number(req.body.monthly_mess_fee) +
            Number(req.body.monthly_laundry_fee) +
            Number(req.body.monthly_room_rent) +
            Number(req.body.monthly_admission_fee) +
            Number(req.body.monthly_other_fees) +
            Number(req.body.monthly_transportation_fee)
          ).toFixed(2);
          console.log("monthly_four_wheeler_parking_fee", Number(req.body.monthly_four_wheeler_parking_fee))
console.log("monthly_two_wheeler_parking_fee", Number(req.body.monthly_two_wheeler_parking_fee))
console.log("monthly_water_bill", Number(req.body.monthly_water_bill))
console.log("monthly_electricity_bill", Number(req.body.monthly_electricity_bill))
console.log("monthly_mess_fee", Number(req.body.monthly_mess_fee))
console.log("monthly_laundry_fee", Number(req.body.monthly_laundry_fee))
console.log("monthly_room_rent", Number(req.body.monthly_room_rent))
console.log("monthly_admission_fee", Number(req.body.monthly_admission_fee))
console.log("monthly_other_fees", Number(req.body.monthly_other_fees))
console.log("monthly_transportation_fee", Number(req.body.monthly_transportation_fee))
          if(total_bill <= 0){
            return res.json({
              status: 401,
              message: "Please enter at least one value in these fields",
            });
          }

          studentParams = {
            student_id: req.body.student_id,
            bed_type: req.body.bed_type,
            student_type: req.body.student_type,
            room_no: req.body.room_no,
            parking: req.body.parking,
            parking_type:
              req.body.parking_type != "" ? req.body.parking_type : null,
            monthly_transportation_fee: req.body.monthly_transportation_fee ? req.body.monthly_transportation_fee : 0,
            meal: req.body.meal,
            meal_type: req.body.meal_type,

            created_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            status: 1,
            monthly: 0,
            monthly_four_wheeler_parking_fee:
              req.body.monthly_four_wheeler_parking_fee ? req.body.monthly_four_wheeler_parking_fee: 0,
            monthly_two_wheeler_parking_fee:
              req.body.monthly_two_wheeler_parking_fee ? req.body.monthly_two_wheeler_parking_fee: 0,
            monthly_water_bill: req.body.monthly_water_bill ? req.body.monthly_water_bill: 0,
            monthly_electricity_bill: req.body.monthly_electricity_bill ? req.body.monthly_electricity_bill : 0,
            monthly_mess_fee: req.body.monthly_mess_fee ? req.body.monthly_mess_fee : 0,
            monthly_laundry_fee: req.body.monthly_laundry_fee ? req.body.monthly_laundry_fee : 0,
            monthly_room_rent: req.body.monthly_room_rent ? req.body.monthly_room_rent : 0,
            monthly_admission_fee: req.body.monthly_admission_fee ? req.body.monthly_admission_fee : 0,
            monthly_other_fees: req.body.monthly_other_fees ? req.body.monthly_other_fees : 0,
            monthly_other_fees_remark: req.body.monthly_other_fees_remark,
            total: total_bill,
            total_one_time: total_bill,
            to_pay: total_bill,
          };
        }

        var insert_data = await knex("student_plan").insert([studentParams]);
       
        if (insert_data.length > 0) {
          let update_student = await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              student_type: req.body.student_type,
              plan_id: insert_data[0],
              bed_type: req.body.bed_type,
              term: !req.body.hasOwnProperty("monthly") ? req.body.term : null,
              monthly: req.body.hasOwnProperty("monthly") ? "yes" : null,
            });
          if (update_student == 1) {
            sentMailTo(
              req.body.StudEmail,
              "Successful Plan Set",
              "Dear Ms. " +
                req.body.SFname +
                " Greetings!\n\n" +
                "This is to inform you that a subscription plan has been set for you.Please log into the app and kindly pay for it.\n\n " +
                "Thanking you.\n\n" +
                "With Regards,\n" +
                "RM Hostel Team"
            );

            sentSms({
              phone_number: req.body.SmobNo,
              msg:
                "Dear Ms. " +
                req.body.SFname +
                ",, This is to inform you that a subscription plan has been set for you.Please log into the app and kindly pay for it.",
            });
            return res.json({
              status: 200,
              message: "Plan added successfully for the student",
            });
          }
        } else {
          return res.json({
            status: 401,
            message: "Failed to add plan",
          });
        }
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

module.exports = router;
