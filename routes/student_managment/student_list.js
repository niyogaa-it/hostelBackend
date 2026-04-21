const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");

router.get("/", async (req, res) => {

 const selectedRows = await knex('student_details')
 .select('student_details.*','student_details_image.StudimagepathBase','student_details_image.LocalimagepathBase','student_details_image.FatherimagepathBase','student_details_image.MotherimagepathBase','room.room_number as roomNumber')
 .leftJoin('student_details_image', 'student_details.id', 'student_details_image.student_id')
 .leftJoin('room', 'student_details.room_id', 'room.id')
 .where('student_details.AcademicYear', '=', '2025-2026')
  .andWhere(function () {
      this.where(function () {
        this.where('student_details.status', '=', 1)
            .andWhere('student_details.is_approved', '=', 1);
      })
      .orWhere(function () {
        this.where('student_details.status', '=', 3)
            .andWhere('student_details.is_approved', '=', 3);
      });
    })

 .orderBy("student_details.id", "desc");
  
 
    return res.json({
        status: 200,
        result_data: selectedRows
    })  
});


router.get("/oldlist", async (req, res) => {

    const selectedRows = await knex('student_details')
    .where('student_details.AcademicYear', '=', '2024-2025')
    .orderBy("student_details.id", "desc");

       return res.json({
           status: 200,
           result_data: selectedRows
       }); 
});

router.get("/academic_year_list", async (req, res) => {

    const selectedRows = await knex('academic_year')
    .where("status","=",'active')
    .orderBy("id", "asc");

       return res.json({
           status: 200,
           result_data: selectedRows
       })  
});

module.exports = router;