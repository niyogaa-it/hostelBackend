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
    let total_bill = 0
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
    }  else if (
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
    } else if (req.body.monthly_other_fees>0 && req.body.monthly_other_fees_remark == "") {
      return res.json({
        status: 401,
        message: "Please Enter Other Remark ",
      });
     } else if (
      !req.body.hasOwnProperty("monthly") &&
      (req.body.to_pay == undefined || req.body.to_pay == "")
    ) {
      return res.json({
        status: 401,
        message: "Please enter amount to pay",
      });
    }  else if (req.body.SmobNo == undefined || req.body.SmobNo == "") {
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
    } else {

      let studentDetails =  await knex("student_details").where({id: req.body.student_id}).limit(1);

      if(req.body.plan_id != 5){


        let academic_year = studentDetails[0].AcademicYear;
        let [startYear, endYear] = academic_year.split('-').map(Number);

        const firstDayOfJune = new Date(`${startYear}-06-01`);
        const lastDayOfNovember =  new Date(`${startYear}-11-30`);
        const firstDayOfDecember = new Date(`${startYear}-12-01`);
        const lastDayOfMay = new Date(`${endYear}-05-31`);


        let normal_start_date="";
        let normal_end_date ="";

        if(req.body.plan_id==1){
          normal_start_date = firstDayOfJune ?  firstDayOfJune : null;
          normal_end_date =   lastDayOfMay ?  lastDayOfMay : null;

        } else if(req.body.plan_id==2){

          normal_start_date = firstDayOfJune ?  firstDayOfJune : null;
          normal_end_date =   lastDayOfNovember ?  lastDayOfNovember : null;

        }else if(req.body.plan_id==3){

          normal_start_date = firstDayOfDecember ?  firstDayOfDecember : null;
          normal_end_date =   lastDayOfMay ?  lastDayOfMay : null;

        }else{
          normal_start_date = firstDayOfDecember ?  firstDayOfDecember : null;
          normal_end_date =   lastDayOfMay ?  lastDayOfMay : null;

        }

        let studentParams = {
          student_id: req.body.student_id,
          student_type: req.body.student_type,
          plan_id: req.body.plan_id,
          plan_type: req.body.plan_type,
          term: req.body.term,
          bed_type: req.body.bed_type,
          room_no: req.body.room_no,
          parking_type:req.body.parking_type != "" ? req.body.parking_type : null,
          meal_type: req.body.meal_type,
          normal_start_date: normal_start_date ?  normal_start_date : null,
          normal_end_date:  normal_end_date ?  normal_end_date : null,
          room_rent: req.body.room_rent ? req.body.room_rent : 0,
          cultural_fees: req.body.cultural_fees ? req.body.cultural_fees : 0,
          caution_deposit: req.body.caution_deposit ? req.body.caution_deposit : 0,
          addmission_fee: req.body.addmission_fee ? req.body.addmission_fee : 0,
          admisson_kit: req.body.admisson_kit ? req.body.admisson_kit : 0,
          meal_t1: req.body.meal_t1 ? req.body.meal_t1 : 0,
          laundry_t1:  req.body.laundry_t1 ? req.body.laundry_t1 : 0,
          meal_t2: req.body.meal_t2 ? req.body.meal_t2 : 0,
          laundry_t2: req.body.laundry_t2 ? req.body.laundry_t2 : 0,
          total: req.body.total,
          total_one_time: req.body.total_one_time,
          to_pay: req.body.to_pay,
          paid: 'No',
          created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
          status: 1,
        };
        var insert_data = await knex("student_plan").insert([studentParams]);
      }else{
       

        total_bill = req.body.total;
       
        if(total_bill <= 0){
          return res.json({
            status: 401,
            message: "Total value can not be Zero",
          });
        }
      
      
        let studentParams = {
          student_id: req.body.student_id,
          student_type: req.body.student_type,
          plan_id: req.body.plan_id,
          term: req.body.plan_id,
          plan_type: req.body.plan_type,
          bed_type: req.body.bed_type,
          room_no: req.body.room_no,
          meal_type: req.body.meal_type,
          parking_type: req.body.parking_type != "" ? req.body.parking_type : null,
          //monthly: (req.body.monthly) ? req.body.monthly : 0,
          monthly: (req.body.monthly) ? moment(req.body.monthly, 'MM').format('MMMM') : 0,


          parking_start_date: req.body.parking_start_date ?  moment( req.body.parking_start_date).format("YYYY-MM-DD") : null,
          parking_end_date: req.body.parking_end_date ?  moment(  req.body.parking_end_date).format("YYYY-MM-DD") : null,
          transport_start_date: req.body.transport_start_date ?  moment( req.body.transport_start_date).format("YYYY-MM-DD") : null,
          transport_end_date: req.body.transport_end_date ?   moment( req.body.transport_end_date).format("YYYY-MM-DD") : null,

          addmission_fee: req.body.addmission_fee ? req.body.addmission_fee : 0,
          admisson_kit: req.body.admisson_kit ? req.body.admisson_kit : 0,
          cultural_fees: req.body.cultural_fees ? req.body.cultural_fees : 0,
          caution_deposit: req.body.caution_deposit ? req.body.caution_deposit : 0,
          lateral_start_date: req.body.lateral_start_date ?  moment(req.body.lateral_start_date).format("YYYY-MM-DD") : null,
          lateral_end_date: req.body.lateral_end_date ?  moment(req.body.lateral_end_date).format("YYYY-MM-DD") : null,
          temporary_start_date: req.body.temporary_start_date ?  moment(req.body.temporary_start_date).format("YYYY-MM-DD") : null,
          temporary_end_date: req.body.temporary_end_date ?  moment(req.body.temporary_end_date).format("YYYY-MM-DD") : null,
          room_rent: req.body.room_rent ? req.body.room_rent : 0,
          monthly_mess_fee: req.body.monthly_mess_fee ? req.body.monthly_mess_fee : 0,
          monthly_laundry_fee: req.body.monthly_laundry_fee ? req.body.monthly_laundry_fee : 0,

          parking:  req.body.parking ? req.body.parking: 0,
          transportation: req.body.transportation ? req.body.transportation : 0,
          monthly_water_bill: req.body.monthly_water_bill ? req.body.monthly_water_bill: 0,
          monthly_electricity_bill: req.body.monthly_electricity_bill ? req.body.monthly_electricity_bill : 0,
          monthly_other_fees: req.body.monthly_other_fees ? req.body.monthly_other_fees : 0,
          monthly_other_fees_remark: req.body.monthly_other_fees_remark ? req.body.monthly_other_fees_remark : "" ,
          gstIncluded: req.body.gstIncluded !== undefined ? req.body.gstIncluded : 'no',
         
          total: req.body.total,
          total_one_time: req.body.total,
          to_pay: req.body.to_pay,
          paid: 'No',
          created_at: moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss"),
          status: 1,
        };
        var insert_data = await knex("student_plan").insert([studentParams]);
      }
      
      
      if (insert_data.length > 0) {
        let update_student = await knex("student_details")
        .where({ id: req.body.student_id })
        .update({
          student_type: req.body.student_type,
          plan_id: req.body.plan_id,
          bed_type: req.body.bed_type,
          term: req.body.plan_id,
          monthly: req.body.hasOwnProperty("monthly") ? "yes" : null,
        });
        if (update_student == 1) {
          // sentMailTo(
          //   req.body.StudEmail,
          //   "Successful Plan Set",
          //   "Dear Ms. " +
          //     req.body.SFname +
          //     " Greetings!\n\n" +
          //     "This is to inform you that a subscription plan has been set for you.Please log into the app and kindly pay for it.\n\n " +
          //     "Thanking you.\n\n" +
          //     "With Regards,\n" +
          //     "RM Hostel Team"
          // );

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
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


// router.post("/set_annual_plan", async (req, res) => {
//   try {
    
    
//         let studentParams = {
//           student_id: req.body.student_id,
//           plan_id: req.body.plan_id,
//           bed_type: req.body.bed_type,
//           student_type: req.body.student_type,
//           term: 4,
//           addmission_fee: req.body.addmission_fee,
//           admisson_kit: req.body.admisson_kit,
//           caution_deposit: req.body.caution_deposit,
//           cultural_fees: req.body.cultural_fees,
//           room_no: req.body.room_no,
//           room_rent: req.body.room_rent,
//           parking: req.body.parking,
//           parking_type:
//             req.body.parking_type != "" ? req.body.parking_type : null,
//           meal_type: req.body.meal_type,
//           total: req.body.total,
//           plan_type: req.body.plan_type,
//           total_one_time: req.body.total_one_time,
//           to_pay: req.body.to_pay,
//           created_at: moment()
//             .utcOffset("+05:30")
//             .format("YYYY-MM-DD HH:mm:ss"),
//           status: 1,
//         };
        
//         var insert_data = await knex("student_plan").insert([studentParams]);
       
//         if (insert_data.length > 0) {
//           let update_student = await knex("student_details")
//             .where({ id: req.body.student_id })
//             .update({
//               student_type: req.body.student_type,
//               plan_id: insert_data[0],
//               bed_type: req.body.bed_type,
//               term: 4
//             });

//             return res.json({
//               status: 200,
//               message: "Plan added successfully for the student",
//             });
         
//         } else {
//           return res.json({
//             status: 401,
//             message: "Failed to add plan",
//           });
//         }
      
    
//   } catch (error) {
//     // console.log(ok);
//     return res.json({
//       status: 401,
//       message: error.message,
//     });
//   }
// });

module.exports = router;
