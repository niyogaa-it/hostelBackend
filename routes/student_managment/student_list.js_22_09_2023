const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/", async (req, res) => {


 const selectedRows = await knex('student_details').orderBy("student_details.id", "desc").leftJoin('student_details_image', 'student_details.id', 'student_details_image.student_id')
//  ;
    return res.json({
        status: 200,
        result_data: selectedRows
    })

    
});

module.exports = router;