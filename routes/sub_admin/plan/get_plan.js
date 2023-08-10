const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
router.get("/all", async (req, res) => {
  // console.log(req.notification_unseen);
  const selectedRows = await knex("plan")
    .where({
      status: 1,
    })
    .orderBy("id", "desc");
  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});

router.post("/get_bed", async (req, res) => {
  if (req.body.student_id == undefined || req.body.student_id == "") {
    return res.json({
      status: 401,
      message: "Please enter student id",
    });
  }

  if (req.body.student_type == undefined || req.body.student_type == "") {
    return res.json({
      status: 401,
      message: "Please select student type",
    });
  }
  let data_table=req.body.student_type =="new" ?"plan_new_student":"plan_old_student"

  const get_room_number = await knex("room_occupancy")
    .where({ student_id: req.body.student_id, status: 1 })
    .limit(1);

  if (get_room_number.length > 0) {
    let room_no = `%,${get_room_number[0].room_number},%`;

    const get_bed_type = await knex(`${data_table}`)
      .select(`bed_type`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
      .havingRaw(`rooms LIKE '${room_no}' `);

    // const get_plans = await knex("plan_new_student")
    //   .select(`*`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
    //   .havingRaw(`rooms LIKE '${room_no}' `)
    //   .where({ bed_type: "ub" });

    //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx>>>", get_bed_type);
    return res.json({
      status: 200,
      bed_type: get_bed_type,
    });
  } else {
    return res.json({
      status: 401,
      message: "No room found for the student",
    });
  }
});

router.post("/get_plan", async (req, res) => {
  if (req.body.student_id == undefined || req.body.student_id == "") {
    return res.json({
      status: 401,
      message: "Please enter student id",
    });
  }
  if (req.body.term == undefined || req.body.term == "") {
    return res.json({
      status: 401,
      message: "Please select term",
    });
  }
  if (req.body.student_type == undefined || req.body.student_type == "") {
    return res.json({
      status: 401,
      message: "Please select student type",
    });
  }
  let bed_type = "";
  if (req.body.bed_type == undefined || req.body.bed_type == "") {
    return res.json({
      status: 401,
      message: "Please select bed type",
    });
  } else {
    bed_type = req.body.bed_type == "Upper Berth" ? "ub" : "lb";
  }
  var data_table=req.body.student_type =="new" ?"plan_new_student":"plan_old_student"


  const get_room_number = await knex("room_occupancy")
    .where({ student_id: req.body.student_id, status: 1 })
    .limit(1);

  if (get_room_number.length > 0) {
    let room_no = `%,${get_room_number[0].room_number},%`;

    const get_plans = await knex(`${data_table}`)
      .select(`*`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
      .havingRaw(`rooms LIKE '${room_no}' `)
      .where({ bed_type: bed_type });

    const selectedRows = await knex("student_details")
      .select(
        "SFname",
        "room_id",
        "SmobNo",
        "StudEmail",
        "parking",
        "parking_type",
        "transportation",
        "food_preference"
      )
      .where({ id: req.body.student_id })
      .limit(1);
    var get_parking_price = "";
    var get_bus_price = "";

    //   console.log("selectedRows[0]>>", selectedRows[0]);
    if (selectedRows[0].parking == "Yes") {
      get_parking_price = await knex("packages_price")
        .select("*")
        .where({ package: selectedRows[0].parking_type });
    }
    if (selectedRows[0].transportation == "Yes") {
      get_bus_price = await knex("packages_price")
        .select("*")
        .where({ package: "Bus" });
    }

    var get_food_price = await knex("packages_price")
      .select("*")
      .where({ package: selectedRows[0].food_preference, term: req.body.term });

    var get_laundry_price = await knex("packages_price")
      .select("*")
      .where({ package: "Laundary", term: req.body.term });

    
    let price_obj = {
      meal_price:
        get_food_price.length > 0 ? Number(get_food_price[0].price) : 0,
      bus_price: get_bus_price.length > 0 ? Number(get_bus_price[0].price) : 0,
      laundry:
        get_laundry_price.length > 0 ? Number(get_laundry_price[0].price) : 0,
      parking_fees:
        get_parking_price.length > 0 ? Number(get_parking_price[0].price) : 0,
    };
    return res.json({
      status: 200,
      get_plan: get_plans,
      student_details: selectedRows[0],
      price_obj: price_obj,
      // parking_price: get_parking_price[0],
      // bus_fee: get_bus_price,
    });
  } else {
    return res.json({
      status: 401,
      message: "No room found for the student",
    });
  }
});

router.get("/get_all_monthly_plan", async (req, res) => {
  try {
  
      var listData = await knex("monthly_payment").leftJoin('student_details', 'monthly_payment.student_id', 'student_details.id')


      return res.json({
        status: 200,
        message: "Successfully monthly details fetched",
        result: listData,
      });
     
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_all_plan_history", async (req, res) => {
  try {
  
      //var listData = await knex("student_plan").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname',).leftJoin('student_details', 'student_plan.student_id', 'student_details.id')

      var listData = await knex("student_details").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname','student_details.id','student_plan.monthly_other_fees').leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')




      return res.json({
        status: 200,
        message: "Successfully all plan history details fetched",
        result: listData,
      });
     
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});
module.exports = router;
