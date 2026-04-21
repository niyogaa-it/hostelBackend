/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
var moment = require("moment");


router.get("/:id", async (req, res) => {

  try {

    var current_date = moment().format("YYYY-MM-DD");

    var viewPlanDetail = await knex("student_details").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.*','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student','student_plan.admin_update_payment_date').leftJoin('student_plan', 'student_plan.student_id', 'student_details.id').where("student_plan.id", req.params.id).limit(1);
    
        if(viewPlanDetail[0].admin_update_payment_date>=current_date){
          return res.json({
            status: 200,
            message: "Data fatch successfully",
            data: viewPlanDetail[0],
            result: process.env.BASE_URL+viewPlanDetail[0].invoice_name,
          
          });
               
        }else{
          
          return res.json({
            status: 200,
            message: "Request to admin to send the receipt to you!.",
            result: "",
          
          });

        }
    
    } catch (error) {
      return res.json({
        status: 401,
        message: error.message,
      });
    }
});


module.exports = router;
