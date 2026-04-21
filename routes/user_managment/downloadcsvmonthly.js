const express = require("express");
const router = express.Router();
const knex = require('../../module/knex_connect');

const XLSX = require('xlsx');
var moment = require("moment");
const fs = require('fs');
var path = require('path');



router.get("/", async (req, res) => {

  try {


    const listData = await knex("student_plan")
        .select('student_details.SFname','student_details.SRaddress','student_details.student_type','student_details.parking_type','student_plan.id as planId','student_plan.plan_id','student_plan.plan_type','student_plan.student_id','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_plan.monthly_other_fees','student_plan.monthly_other_fees_remark','student_plan.gstIncluded','student_plan.edit_plan_type','student_plan.invoice_name','student_plan.invoice_no','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2','student_plan.total_one_time', 'payment_activity.amount',
        'payment_activity.payment_id',
        'payment_activity.created_at as paid_on')
        .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
        .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 + monthly_laundry_fee as laundry"))
        .leftJoin('payment_activity', 'student_plan.id', 'payment_activity.plan_id')
        .leftJoin('student_details', 'student_plan.student_id', 'student_details.id')
        .where('student_plan.status', '=', 1)
        .where('student_plan.plan_id','=',5)
        .where('student_details.AcademicYear', '=', '2025-2026')
        .orderBy("student_plan.id", "desc");

        let excelData = [];
        let tax_details = await knex("tax_setting").where("status", "=" ,'active');


        listData.forEach(row => {

          let gstIncluded = row.gstIncluded;

          // GST % setup
          let roomrent_totalgst_in_percent = 0;
          let admissionfees_totalgst_in_percent = 0;
          let admissionkitfees_totalgst_in_percent = 0;
          let culturalfees_totalgst_in_percent = 0;
          let mealfees_totalgst_in_percent = 0;
          let laundry_totalgst_in_percent = 0;
          let parking_totalgst_in_percent = 0;
          let transpotation_totalgst_in_percent = 0;
          let waterfees_totalgst_in_percent = 0;
          let electricityfees_totalgst_in_percent = 0;
          let otherfees_totalgst_in_percent = 0;
          let registrationfees_totalgst_in_percent = 0;

          // If room rent GST included then add GST %
          if (gstIncluded === 'yes') {
            roomrent_totalgst_in_percent = ((tax_details[0].cgst + tax_details[0].sgst) / 100);
          } else {
            roomrent_totalgst_in_percent = 0;
          }

             admissionfees_totalgst_in_percent = ((tax_details[1].cgst + tax_details[1].sgst) / 100);
              admissionkitfees_totalgst_in_percent = ((tax_details[2].cgst + tax_details[2].sgst) / 100);
              culturalfees_totalgst_in_percent = ((tax_details[3].cgst + tax_details[3].sgst) / 100);
              mealfees_totalgst_in_percent = ((tax_details[4].cgst + tax_details[4].sgst) / 100);
              laundry_totalgst_in_percent = ((tax_details[5].cgst + tax_details[5].sgst) / 100);
              parking_totalgst_in_percent = ((tax_details[6].cgst + tax_details[6].sgst) / 100);
              transpotation_totalgst_in_percent = ((tax_details[7].cgst + tax_details[7].sgst) / 100);
              waterfees_totalgst_in_percent = ((tax_details[8].cgst + tax_details[8].sgst) / 100);
              electricityfees_totalgst_in_percent = ((tax_details[9].cgst + tax_details[9].sgst) / 100);
              otherfees_totalgst_in_percent = ((tax_details[10].cgst + tax_details[10].sgst) / 100);
              registrationfees_totalgst_in_percent = ((tax_details[11].cgst + tax_details[11].sgst) / 100);

         

          // Push final row to excelData
          excelData.push({
            student_name: row.SFname,
            student_address: row.SRaddress,
            student_type: row.student_type,
            plan_id: row.planId,
            plan_type: row.plan_type,
            roomrent_totalgst_in_percent: roomrent_totalgst_in_percent,
            admissionfees_totalgst_in_percent: admissionfees_totalgst_in_percent,
            admissionkitfees_totalgst_in_percent: admissionkitfees_totalgst_in_percent,
            culturalfees_totalgst_in_percent: culturalfees_totalgst_in_percent,
            mealfees_totalgst_in_percent: mealfees_totalgst_in_percent,
            laundry_totalgst_in_percent: laundry_totalgst_in_percent,
            parking_totalgst_in_percent: parking_totalgst_in_percent,
            transpotation_totalgst_in_percent: transpotation_totalgst_in_percent,
            waterfees_totalgst_in_percent: waterfees_totalgst_in_percent,
            electricityfees_totalgst_in_percent: electricityfees_totalgst_in_percent,
            otherfees_totalgst_in_percent: otherfees_totalgst_in_percent,
            registrationfees_totalgst_in_percent: registrationfees_totalgst_in_percent,
            total: row.total,
            to_pay: row.to_pay,
            paid: row.paid,
            paid_on: row.paid_on,
            payment_id: row.payment_id,
            created_at: row.created_at
          });
        });

         

        return res.json({
          status: 200,
          message: "Data Fetched Successfully",
          data: listData
        });

  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

module.exports = router;