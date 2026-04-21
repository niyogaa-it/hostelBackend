const express = require("express");
const router = express.Router();
var fs = require("fs");
let pdf = require("html-pdf");
var moment = require("moment");
const { inWords,randNumber } = require("../../../module/numbertowords");

const knex = require("../../../module/knex_connect");

router.get("/all", async (req, res) => {
  
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

      //var listData = await knex("student_details").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname','student_details.id','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student').leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')

      var listData = await knex("student_plan")
      .select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','payment_activity.student_name','payment_activity.id as studentId','payment_activity.payment_id','payment_activity.amount','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student')
      .rightJoin('payment_activity', 'student_plan.id', 'payment_activity.plan_id')
      .orderBy("payment_activity.id", "desc");

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

//Annual Get Plan
router.post("/annual_plan", async (req, res) => {
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
    var data_table=req.body.student_type =="new" ?"plan_new_student":"plan_old_student";

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
    
    
    return res.json({
      status: 200,
      get_plan: get_plans,
      student_details: selectedRows[0],
      message: "Data render successfully."

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

router.get("/view_payment_details/:id", async (req, res) => {

  try {
          var planDetail = await knex("student_details").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.*','student_plan.monthly_other_fees','student_plan.invoice_name').leftJoin('student_plan', 'student_plan.student_id', 'student_details.id').where("student_plan.id", req.params.id).limit(1);

          if(planDetail[0].invoice_name !== null){
      
            return res.json({
              status: 200,
              message: "Data fatch successfully",
              result: process.env.BASE_URL+planDetail[0].invoice_name,
            
            });
            

          }else{

            let currentDate = moment().format("YYYY-MM-DD");
            let invoiceDate = moment(planDetail[0].created_at).format("DD-MM-YYYY");
            let studentName = planDetail[0].SFname.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_');
            let pdfName = `${currentDate}_${studentName}_Payment.pdf`;
            let invoiceNo = 'RMH/'+moment().format("YYYY")+'/'+ await randNumber();
            let total_amount = await inWords(planDetail[0].to_pay);


            let file = {
              content: `
                <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: 0 auto 40px;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;"><tbody><tr valign="middle" bgcolor="#45aadc"><td colspan="9" align="center" bgcolor="#45aadc" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">INVOICE</td></tr><tr valign="middle"><td colspan="9" align="center" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 16px;font-weight: bold;line-height: 1.7;padding: 2px 10px;vertical-align: middle;text-align: center;"><p style="margin:0;font-weight: bold;font-size: 9px;">RANI MEYYAMMAI HOSTEL</p><p style="margin:0;font-size: 9px;font-weight: normal;">UNIT OF THE WILLINGDON CHARITABLE TRUST)</p><p style="margin:0;font-size: 9px;">NO.25 ETHIRAJ SALAI, EGMORE, CHENNAI - 600 008</p><p style="margin:0;font-size: 9px;">GSTIN::33AAATT0683N2Z6</p><p style="margin:0;font-size: 9px;">PAN :: AAATT0683N</p></td></tr><tr bgcolor="#45aadc"><td colspan="4" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;width: 50%;"></td>
                <td colspan="5" align="center" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;font-family: Tahoma,Arial,sans-serif;font-weight: bold;font-size: 9px;padding: 5px 0;width: 50%;">BILLED TO</td></tr><tr><td colspan="4" valign="middle" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.8;font-weight: bold;padding: 2px 10px;border-bottom: 1px solid #000;"><p style="margin:0;font-size: 10px;">Invoice No: ${
                  invoiceNo
                }</p><p style="margin:0;font-size: 10px;">Invoice Date: ${
                  invoiceDate
                }.</p><p style="margin:0;font-size: 10px;">Reverse Charge (Y/N):No</p><p style="margin:0;font-size: 10px;">State: TAMILNADU</p><p style="margin:0;font-size: 10px;">Code:33</p></td><td colspan="5" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.7;font-weight: bold;padding: 2px 10px;border-left: 1px solid #000;border-bottom: 1px solid #000;"><p style="margin:0;font-size:10px;">NAME:  ${
                  planDetail[0].SFname
                }</p><p style="margin:0;">ID NO: ${
                  planDetail[0].id
                }</p><p style="margin:0;font-size:10px;">ROOM NO : <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${
                  planDetail[0].room_no
                }</span></p><p style="margin:0;font-size:10px;">Address: ${
                  planDetail[0].SRaddress
                }</p><p style="margin:0;font-size:10px;">GSTIN :</p></td></tr>
                <tr align="center" valign="middle">
                  <td width="8%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">S. No.</td><td width="14%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">Description</td>
                  <td width="13%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">HSN / SAC<br>
                  code, if any</td>
                  <td width="15%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">Taxable Value</td>
                  <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">CGST</td>
                  <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">SGST</td>
                  <td width="14%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Total in Rs.</td>
                  </tr>
                  <tr>
                  <td width="7%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Rate</td>
                  <td width="11%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Amount</td>
                  <td width="7%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Rate</td>
                  <td width="11%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Amount</td>
                </tr>
              <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">1</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Room Rent</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">8814.90</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">8814.90</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent}</td>
              </tr>
    <tr align="center" valign="middle">
    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission fees</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">30.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">30.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee}</td>
      </tr>
      <tr align="center" valign="middle"><td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">3</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission Kit</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">109.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">109.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit}</td>
      </tr>
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">4</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Cultural fees</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">162.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">162.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees}</td>
      </tr>
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px">5</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal_type}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">825.50</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">825.50</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal}</td>
      </tr>
     
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">T I - Laundry</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].laundry}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].laundry}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">127.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">127.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].laundry}</td>
      </tr>
  
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">7</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Parking</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">24.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">24.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking}</td>
      </tr>
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">8</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Transportation<br>fees</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation}</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">0.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">0.00</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation}</td>
      </tr>
      <tr align="center" valign="middle">
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Late fees/ fine</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">999799</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">84.88</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">7.56</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">7.56</td>
      <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">100.00</td>
      </tr>
      <tr>
      <td colspan="4" align="center" valign="middle" bgcolor="#45aadc" style="padding: 5px;font-family: Tahoma,Arial sans-serif;font-weight: bold;"><strong>Total Amount in Words</strong></td>
      <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount before Tax</td>
      <td style="text-align:center;padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">${planDetail[0].to_pay}</td>
      </tr>
      <tr>
        <td colspan="4" rowspan="4" align="center" valign="middle"><p  style="margin:0;font-size:9px;">Rupees ${total_amount} only.</p></td>
        <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: CGST</td>
        <td style="padding: 5px;font-family: Tahoma,Arial,sans-serif;text-align: center;">13,331.96</td>
        </tr><tr><td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: SGST</td><td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">13,331.96</td></tr><tr><td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Total Tax Amount</td><td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">26,663.92</td></tr>
        <tr>
          <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount including Tax</td>
          <td style="text-align:center;font-weight: bold;">${planDetail[0].to_pay}</td>
        </tr>
        <tr>
          <td colspan="4" rowspan="4" valign="middle"></td>
          <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;"><p  style="margin:0;font-size:9px;">Certified that the particulars </p><p  style="margin:0;font-size:9px;">given above are true and correct</p></td>
        </tr>
        <tr>
          <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-size:10px;"><strong>For Rani Meyyammai Hostel</strong></td>
        </tr>
        <tr>
          <td height="125" colspan="5">&nbsp;</td>
        </tr>
        <tr>
          <td colspan="4" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Authorised Signatory</td>
        </tr>
      </tbody></table>
  
      <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
        <tbody><tr bgcolor="#45aadc">
          <td colspan="2" align="center" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">RECEIPT</td>
        </tr><tr>
          <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;padding: 15px;">
          <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${planDetail[0].to_pay}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${total_amount} only.)</p><p  style="margin:0;font-size:9px;">towards settlement of invoice no. ${
            invoiceNo
          } dated <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${currentDate}</span></p></td>
        </tr><tr>
          <td width="535" rowspan="2">&nbsp;</td>
          <td width="535" align="center" style="font-family: Tahoma,Arial,sans-serif;font-weight: normal;padding: 10px;line-height:2;"><p style="margin:0 0 50px"><b>For Rani Meyyammai Hostel</b></p><p style="margin:0">Authorised Signatory</p></td></tr>
        </tbody></table>
            
              `,
            };

            const options = {
              pageFormat: "A4",
              orientation: "portrait",
              border: "10mm",
              fontSize: 10,
              header: {
                height: "3mm",
              },
              type: pdf,
              footer: {
                height: "3mm",
                contents: {
                  default:
                    '<span style="color: #444; font-size:8px;">{{page}}/{{pages}}</span>', // fallback value
                },
              },
            };

            pdf.create(file.content, options)
              .toFile(`public/${pdfName}`, function (err, res) {
              if (err) return console.log(err);
            
            });

            var updateInvoiceName = await knex("student_plan").where({id: req.params.id}).update({
                invoice_name: pdfName,
                invoice_no: invoiceNo,
                send_to_student: "yes",
                updated_at: new Date(),
            });

            return res.json({
              status: 200,
              message: "Data fatch successfully",
              result: process.env.BASE_URL+pdfName,
              
            });

          }
       
    } catch (error) {
      return res.json({
        status: 401,
        message: error.message,
      });
    }
});

router.post("/get_payment_details/:id", async (req, res) => {

  try {

    var viewPlanDetail = await knex("student_details").select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal','student_plan.meal_type','student_plan.laundry','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.*','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student').leftJoin('student_plan', 'student_plan.student_id', 'student_details.id').where("student_plan.id", req.params.id).limit(1);
    
        if(viewPlanDetail[0].invoice_name){

          var updateInvoiceName = await knex("student_plan").where({id: req.params.id}).update({
            send_to_student: "sendto",
            admin_update_payment_date: req.body.admin_update_payment_date,
          });

          
          return res.json({
            status: 200,
            message: "Data fatch successfully",
            result: process.env.BASE_URL+viewPlanDetail[0].invoice_name,
          
          });
               
        }else{
          
          return res.json({
            status: 200,
            message: "Please generate the Receipt first",
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
