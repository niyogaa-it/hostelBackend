const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");

router.get("/", async (req, res) => {

  const latestPaymentActivitySubquery = knex('payment_activity')
  .select('id')
  .whereRaw('payment_activity.plan_id = student_plan.id')
  .orderBy('payment_activity.id', 'desc')
  .limit(1);


  const query = knex("student_details")
  .select(
    'student_plan.offline_payment_document',
    'student_plan.offline_payment_ref_dtl',
    'student_plan.offline_payment_type',
    'student_plan.id as planId',
    'student_plan.plan_type',
    'student_plan.student_type',
    'student_plan.room_no',
    'student_plan.parking',
    'student_plan.parking_type',
    'student_plan.transportation',
    'student_plan.meal_type',
    'student_plan.total',
    'student_plan.to_pay',
    'student_plan.created_at',
    'student_plan.paid',
    'student_plan.monthly_other_fees',
    'student_plan.invoice_name',
    'student_plan.send_to_student',
    'student_details.*'
  )
  .leftJoin('student_plan', 'student_details.id', 'student_plan.student_id')
  .where('student_plan.plan_id', '=', 6)
  //.where('student_details.AcademicYear', '=', '2025-2026')
  .whereIn('student_details.AcademicYear', ['2025-2026', '2026-2027'])
  .andWhere(function () {
      this.where(function () {
        this.where('student_details.status', '=', 0)
            .andWhere('student_details.is_approved', '=', 0);
      })
      .orWhere(function () {
        this.where('student_details.status', '=', 2)
            .andWhere('student_details.is_approved', '=', 2);
      });
    })
  .orderBy("student_details.id", "desc");

// 👇 Print full SQL as a string
//console.log(query.toString()); // prints full SQL with values interpolated

// Then execute the query
const selectedRows = await query;

  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});

module.exports = router;
