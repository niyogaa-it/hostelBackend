const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/", async (req, res) => {
  const selectedRows = await knex("student_details")
    .where({ status: 0 })
    .whereNot({is_approved: 2})
    // .orWhere({ status: 2 })
    .orderBy("id", "desc");
  // let room_no = "%,5,%";
  // const get_plans = await knex("plan_new_student")
  //   .select(`*`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
  //   .havingRaw(`rooms LIKE '${room_no}' `)
  //   .where({ bed_type: "ub" });

  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>>>", get_plans);

  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});

module.exports = router;
