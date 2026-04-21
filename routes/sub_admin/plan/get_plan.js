const express = require("express");
const router = express.Router();
var fs = require("fs");
let pdf = require("html-pdf");
var moment = require("moment");
const file_upload = require("../../../module/file_upload");
const { invoiceGeneration } = require("../../../module/invoice_pdf");
const { inWords,randNumber } = require("../../../module/numbertowords");
const knex = require("../../../module/knex_connect");

router.get("/all", async (req, res) => {
 
  const selectedRows = await knex("plan")
    .where({
      status: 1,
    })
    .orderBy("id", "asc");

  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});


router.get("/student_plan_history/:id", async (req, res) => {
 
  const student_plan_history = await knex("student_plan")
    .where("student_id", req.params.id)
      .andWhere("status", 1)
      .andWhere("created_at", ">=", "2025-06-01")
      .orderBy("id", "asc");

  return res.json({
    status: 200,
    result_data: student_plan_history,
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

  const get_room_id = await knex("room_occupancy")
    .where({ student_id: req.body.student_id, status: 1 })
    .limit(1);

  

  if (get_room_id.length > 0) {
    let room_id = `%,${get_room_id[0].room_number},%`;

    let get_room_no =  await knex("room")
    .where({ id: get_room_id[0].room_number, status: 1 })
    .limit(1);

    let room_no = `%,${get_room_no[0].room_number},%`;



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

    var roomdtl = await knex("room")
    .where({
      id: get_room_number[0].room_number
    })
    .limit(1);


    let room_no = `%,${roomdtl[0].room_number},%`;

    const get_plans = await knex(`${data_table}`)
      .select(`*`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
      .havingRaw(`rooms LIKE '${room_no}' `)
      .where({ bed_type: bed_type });

   

    const selectedRows = await knex("student_details")
      .select(
        'student_details.*',
        'room.room_number as roomNumber'
      )
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id","=",  req.body.student_id)
      .limit(1);
   

    //That value will come only on monthly Prepaid (Change on 17/11/2023);
    if(req.body.term==5){
        
        var get_parking_price = await knex("packages_price")
          .select("*")
          .where({ package: selectedRows[0].parking_type })
          .limit(1);

        var get_bus_price = await knex("packages_price")
          .select("*")
          .where({ package: "Bus" })
          .limit(1);

          var get_food_price = await knex("packages_price")
          .sum({total_food_price:'price'})
          .where({ package: selectedRows[0].food_preference }).limit(1);

          var get_laundry_price = await knex("packages_price")
          .sum({total_laundry_price:'price'})
          .where({ package: "Laundary" }).limit(1);

  
          var room_occupied = await knex("room_occupancy").where({
            room_number: selectedRows[0].room_id,
            status: 1,
          });
        
          return res.json({
            status: 200,
            oneTime: get_plans,
            student_details: selectedRows[0],
            room_occupied: room_occupied.length > 0 ? Number(room_occupied.length) : 0,
            transportPrice: get_bus_price.length > 0 ? Number(get_bus_price[0].price) : 0,
            parkingPrice: get_parking_price.length > 0 ? Number(get_parking_price[0].price) : 0,
            laundryfees:  get_laundry_price.length > 0 ? Number(get_laundry_price[0].total_laundry_price) : 0,
            messFees: get_food_price.length > 0 ? Number(get_food_price[0].total_food_price) : 0,
          });

    /*if(req.body.term==1 || req.body.term==4){

      var get_food_price = await knex("packages_price")
      .select("*")
      .where({ package: selectedRows[0].food_preference, term: 1 })
      .orWhere({ term: 2 });

      var get_laundry_price = await knex("packages_price")
      .select("*")
      .where({ package: "Laundary", term: 1 })
      .orWhere({ term: 2 });

    }*/


    }
   


    if(req.body.term==1 || req.body.term==2 || req.body.term==3 || req.body.term==4){

      var get_food_price_t1 = await knex("packages_price")
      .select("*")
      .where({ package: selectedRows[0].food_preference, term: 1 });

      var get_laundry_price_t1 = await knex("packages_price")
      .select("*")
      .where({ package: "Laundary", term: 1 });


      var get_food_price_t2 = await knex("packages_price")
      .select("*")
      .where({ package: selectedRows[0].food_preference, term: 2 });

      var get_laundry_price_t2 = await knex("packages_price")
      .select("*")
      .where({ package: "Laundary", term: 2 });

    }

    let termI = {
      meal_price_t1:
      get_food_price_t1.length > 0 ? Number(get_food_price_t1[0].price) : 0,
      laundry_t1:
      get_laundry_price_t1.length > 0 ? Number(get_laundry_price_t1[0].price) : 0,
    };


    let termII = {
      meal_price_t2:
      get_food_price_t2.length > 0 ? Number(get_food_price_t2[0].price) : 0,
      laundry_t2:
      get_laundry_price_t2.length > 0 ? Number(get_laundry_price_t2[0].price) : 0,
     
    };

    
    return res.json({
      status: 200,
      student_details: selectedRows[0],
      oneTime: get_plans,
      termI: termI,
      termII: termII,
      
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
  
      //var listData = await knex("monthly_payment").leftJoin('student_details', 'monthly_payment.student_id', 'student_details.id')

      var listData = await knex("student_plan")
      .select('student_plan.offline_payment_document','student_plan.offline_payment_ref_dtl','student_plan.offline_payment_type','student_plan.offline_payment_document','student_plan.id as planId','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.parking_start_date','student_plan.parking_end_date','student_plan.transport_start_date','student_plan.transport_end_date','student_plan.monthly','student_plan.monthly_water_bill','student_plan.monthly_electricity_bill','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.gstIncluded','student_plan.lateral_start_date','student_plan.lateral_end_date','student_plan.total','student_plan.to_pay','student_plan.created_at','payment_activity.created_at as paid_on','student_plan.paid','payment_activity.student_name','payment_activity.id as paymentId','payment_activity.payment_id','payment_activity.amount','student_plan.monthly_other_fees_remark','student_plan.edit_plan_type','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student','student_details.SFname','student_details.AcademicYear','student_plan.admin_update_payment_date','payment_activity.type')
      .leftJoin('payment_activity', 'student_plan.id','payment_activity.plan_id')
      .leftJoin('student_details', 'student_plan.student_id','student_details.id')
      .where('student_plan.plan_id','=',5)
      .where('student_plan.status','=',1)
      //.where('student_details.AcademicYear','=','2025-2026')
      .whereIn('student_details.AcademicYear', ['2025-2026', '2026-2027'])
      .orderBy("student_plan.id", "desc");

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

    var listData = await knex("student_plan")
    .select('student_plan.offline_payment_document','student_plan.offline_payment_ref_dtl','student_plan.offline_payment_type','student_plan.offline_payment_document','student_plan.id as planId','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_t1','student_plan.meal_t2','student_plan.meal_type','student_plan.laundry_t1','student_plan.laundry_t2','student_plan.total','student_plan.to_pay','student_plan.edit_plan_type','student_plan.created_at','payment_activity.created_at as paid_on','student_plan.paid','student_plan.gstIncluded','payment_activity.student_name','payment_activity.id as paymentId','payment_activity.payment_id','payment_activity.amount','payment_activity.type','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.send_to_student','student_details.SFname','student_details.AcademicYear','student_plan.admin_update_payment_date')
    .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 as meal"))
    .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 as laundry"))

    .leftJoin('payment_activity', function () {
      this.on('student_plan.id', '=', 'payment_activity.plan_id')
          .andOn('student_plan.student_id', '=', 'payment_activity.student_id');
    })
    .leftJoin('student_details', 'student_plan.student_id','student_details.id')
    //.where('student_details.AcademicYear','=','2025-2026')
    .whereIn('student_details.AcademicYear', ['2025-2026', '2026-2027'])
    .where('student_plan.plan_id','!=',5)
    .where('student_plan.status','=',1)
    .orderBy("student_plan.id", "desc");

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




// router.get("/view_payment_details/:id", async (req, res) => {

 
//   try {
//         var planDetail = await knex("student_details")
//         .select('student_details.SFname','student_details.SRaddress','student_details.student_type','room.room_number','student_plan.id as planId','student_plan.plan_id','student_plan.plan_type','student_plan.student_id','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_plan.monthly_other_fees','student_plan.monthly_other_fees_remark','student_plan.invoice_name','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2','student_plan.total_one_time')
//         .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
//         .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 + monthly_laundry_fee as laundry"))
//         .leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')
//         .leftJoin('room', 'student_details.room_id', 'room.id')
//         .where("student_plan.id", "=" ,req.params.id).limit(1);


//         if(planDetail[0].paid=='Yes'){

//           if(typeof planDetail[0].invoice_name !== 'undefined' && planDetail[0].invoice_name !== null){

//             return res.json({
//               status: 200,
//               message: "Data fatch successfully",
//               result: process.env.BASE_URL+'/public/'+planDetail[0].invoice_name,
             
            
//             });
            
//           }else{

        
//             var updateInvoiceName = await knex("student_plan").where({id: req.params.id}).update({
//               send_to_student: "yes",
//               updated_at: new Date()
//             });


            

//             let currentDate = moment().format("DD-MM-YYYY");
//             let invoiceDate = moment(req.body.admin_update_payment_date).format("DD-MM-YYYY");
//             let studentName = planDetail[0].SFname.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_');
//             let pdfName = `${currentDate}_${studentName}_${await randNumber()}_Payment.pdf`;
//             let invoiceNo = 'RMH/24-25/'+ planDetail[0].planId;

//             let total_amount = 0;
//             let total_amount_inwords = "";
//             let refudable = 0;

//             let total_reg_cgst_amount = 0;
//             let total_reg_taxable_income =  0;
//             let total_reg_taxable_amount = 0;


//             let registrationrow = '';
//             let roomrentrow  = '';
//             let admissionfeesrow = '';
//             let admissionkitrow = '';
//             let culturalfeesrow = '';
//             let cautionfeesrow = '';
//             let mealfeesrow = '';
//             let laundryfeesrow = '';
//             let parkingrow = '';
//             let transpotationgrow = '';
//             let monthlywatebillrow = '';
//             let monthlyelectricitybill = '';
//             let monthly_other_fees = '';
//             let roomChange = '';
//             let mealChange = '';

//             let meal = planDetail[0].meal ?  planDetail[0].meal : 	planDetail[0].monthly_laundry_fee;
//             let laundry = planDetail[0].laundry ?  planDetail[0].laundry : 	planDetail[0].monthly_laundry_fee;


//             let baseprice_for_room =  (planDetail[0].room_rent !== null) ?  Math.round((planDetail[0].room_rent/(1+0.12) )) : 0 ; 
//             let baseprice_for_admission_fee =  (planDetail[0].addmission_fee !== null) ?  Math.round((planDetail[0].addmission_fee /(1+0.12))) : 0 ;  
//             let baseprice_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  Math.round((planDetail[0].admisson_kit /(1+0.12) )) : 0 ;  
//             let baseprice_for_cultural_fees = (planDetail[0].cultural_fees!== null) ? Math.round((planDetail[0].cultural_fees /(1+0.12))) : 0 ;  
//             let baseprice_for_meal =  (meal!== null) ?  Math.round((meal /(1+0.05) )) : 0 ; 
//             let baseprice_for_laundry =    (laundry!== null) ? Math.round((laundry/(1+0.12) )) : 0 ; 
//             let baseprice_for_parking = (planDetail[0].parking!== null) ? Math.round((planDetail[0].parking /(1+0.12))) : 0 ; 
//             let baseprice_for_transportation =  (planDetail[0].transportation!== null) ? Math.round((planDetail[0].transportation /(1+0.09))) : 0 ; 

      
//             let taxable_for_room =  (planDetail[0].room_rent !== null) ?  Math.round(baseprice_for_room * 0.06) : 0 ; 
//             let taxable_for_admission_fee =  (planDetail[0].addmission_fee !== null) ?  Math.round(baseprice_for_admission_fee * 0.06) : 0 ; 
//             let taxable_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  Math.round(baseprice_for_admisson_kit * 0.06) : 0 ; 
//             let taxable_for_cultural_fees =     (planDetail[0].cultural_fees!== null) ?  Math.round(baseprice_for_cultural_fees * 0.06) : 0 ; 
//             let taxable_for_meal =  (meal!== null) ?  Math.round(baseprice_for_meal * 0.025) : 0 ; 
//             let taxable_for_laundry =    (laundry!== null) ?  Math.round(baseprice_for_laundry * 0.06) : 0 ; 
//             let taxable_for_parking = (planDetail[0].parking!== null) ?  Math.round(baseprice_for_parking * 0.06) : 0 ; 
//             let taxable_for_transportation =  (planDetail[0].transportation!== null) ?  Math.round(baseprice_for_transportation * 0.09) : 0 ;


//             let total_base_price = (parseInt(baseprice_for_room) + parseInt(baseprice_for_admission_fee) + parseInt(baseprice_for_admisson_kit) + parseInt(baseprice_for_cultural_fees) + parseInt(baseprice_for_meal) + parseInt(baseprice_for_laundry) + parseInt(baseprice_for_parking) + parseInt(baseprice_for_transportation)); 

//             let taxable_amount =  (parseInt(taxable_for_room)+parseInt(taxable_for_admission_fee) + parseInt(taxable_for_admisson_kit) + parseInt(taxable_for_cultural_fees) + parseInt(taxable_for_meal) + parseInt(taxable_for_laundry) + parseInt(taxable_for_parking) + parseInt(taxable_for_transportation)); 

//             let total_taxable_amount = (taxable_amount * 2);

          
//             if(planDetail[0].plan_id==1 || planDetail[0].plan_id==2 || planDetail[0].plan_id==3 || planDetail[0].plan_id==4 || planDetail[0].plan_type=='lateral' || planDetail[0].plan_type=='temporary'){

//               if(planDetail[0].caution_deposit>0){
//                 total_amount = Math.round(parseInt(planDetail[0].to_pay)-parseInt(planDetail[0].caution_deposit));
//                 total_amount_inwords = await inWords(total_amount);
//                 refudable = await inWords(planDetail[0].caution_deposit); 

//               }else{
//                 total_amount = Math.round(parseInt(planDetail[0].to_pay));
//                 total_amount_inwords = await inWords(total_amount);
//               }

        
//               roomrentrow =  planDetail[0].room_rent>0 ? `<tr align="center" valign="middle">
              
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Room Rent</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_room}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent}</td>
//               </tr>`: '';

//               admissionfeesrow =  planDetail[0].addmission_fee>0 ?  `<tr align="center" valign="middle">
             
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission fees</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admission_fee}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee}</td>
//               </tr>` : '';

            
//               admissionkitrow =  planDetail[0].admisson_kit>0 ? `<tr align="center" valign="middle">
               
//                 <td  colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission Kit</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admisson_kit}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit}</td>
//               </tr>` : '';


//               cautionfeesrow =  planDetail[0].caution_deposit>0 ? `<table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
//                 <tbody><tr bgcolor="#45aadc">
//                   <td colspan="2" align="center" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">RECEIPT</td>
//                 </tr><tr>
//                   <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;padding: 15px;">
//                   <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${planDetail[0].caution_deposit}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${refudable} only.)</p><p  style="margin:0;font-size:9px;">towards
//                   refundable caution deposit.</p></td>
//                 </tr>
                
//                 </tbody>
//               </table>
//               <br/>
//               <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>`: '';


//              culturalfeesrow =  planDetail[0].cultural_fees>0 ? `<tr align="center" valign="middle">
            
//              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Cultural fees</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_cultural_fees}</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees}</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees}</td>
//              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees}</td>
//               </tr>`: '';


//               mealfeesrow =  planDetail[0].meal>0 ? ` <tr align="center" valign="middle">
             
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Meal Fees (${planDetail[0].meal_type})</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996333</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_meal}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal>0 ? planDetail[0].meal : 0}</td>
//               </tr>`: '';



//               laundryfeesrow =  planDetail[0].laundry > 0 ? ` <tr align="center" valign="middle">
             
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Laundry</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_laundry}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].laundry > 0 ? planDetail[0].laundry : 0}</td>
//               </tr>`: '';


//             }

//             if(planDetail[0].plan_type== 'prepaid'){

//               total_amount = planDetail[0].to_pay;
//               total_amount_inwords = await inWords(total_amount);


//               total_base_price =    (baseprice_for_parking + baseprice_for_transportation);
//               total_taxable_amount  = ((taxable_for_parking*2) + (taxable_for_transportation*2));
//               taxable_amount =   Math.round(taxable_for_parking + taxable_for_transportation);

//               parkingrow =  planDetail[0].parking==0 ? '': `<tr align="center" valign="middle">
               
//                 <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Parking</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_parking}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking}</td>
//               </tr>`;


//             transpotationgrow =  planDetail[0].transportation==0 ? '': `<tr align="center" valign="middle">
               
//                 <td  colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Transportation<br>fees</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996411</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_transportation}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation}</td>
//               </tr>`;
//             }

//             if(planDetail[0].plan_type== 'postpaid'){

//               total_amount = Math.round(planDetail[0].to_pay);
//               total_amount_inwords = await inWords(total_amount);


//               let baseprice_for_wc =    (planDetail[0].monthly_water_bill>0) ? Math.round((planDetail[0].monthly_water_bill/(1+0.12) )) : 0 ; 
//               let baseprice_for_eb =    (planDetail[0].monthly_electricity_bill>0) ? Math.round((planDetail[0].monthly_electricity_bill/(1+0.12) )) : 0 ; 
//               let baseprice_for_other =    (planDetail[0].monthly_other_fees>0) ? Math.round((planDetail[0].monthly_other_fees/(1+0.18) )) : 0 ; 

              
//               let taxable_for_wc =  (planDetail[0].monthly_water_bill>0) ?  Math.round(baseprice_for_wc * 0.06) : 0 ;
//               let taxable_for_eb =  (planDetail[0].monthly_electricity_bill>0) ?  Math.round(baseprice_for_eb * 0.06) : 0 ;
//               let taxable_for_other =  (planDetail[0].monthly_other_fees>0) ?  Math.round(baseprice_for_other * 0.09) : 0 ; 

//               total_base_price = (parseInt(baseprice_for_wc) + parseInt(baseprice_for_eb) + parseInt(baseprice_for_other)); 

//               taxable_amount =  (parseInt(taxable_for_wc)+parseInt(taxable_for_eb) + parseInt(taxable_for_other)); 
//               total_taxable_amount = (taxable_amount * 2);
              


//               monthlywatebillrow =  planDetail[0].monthly_water_bill>0 ? `<tr align="center" valign="middle">
              
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Water Can Fees</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_wc}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_water_bill}</td>
//             </tr>`: '';



//             monthlyelectricitybill =  planDetail[0].monthly_electricity_bill>0 ? `<tr align="center" valign="middle">
             
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Electricity Fees</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_eb}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${Math.round(planDetail[0].monthly_electricity_bill)}</td>
//             </tr>`: '';


//             monthly_other_fees =  planDetail[0].monthly_other_fees ? `<tr align="center" valign="middle">
             
//               <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_other_fees_remark}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">99799</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_other}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other}</td>
//               <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_other_fees}</td>
//             </tr>`: '';


//             }


//             if(planDetail[0].plan_id =='6'){

//               total_amount = planDetail[0].to_pay;
//               total_amount_inwords = await inWords(total_amount);


//               total_base_price =    (total_amount!== null) ? Math.round(total_amount/ (1+0.12)) : 0;
//               total_taxable_amount  = (Math.round((12/100) * total_base_price)>0) ? Math.round((12/100) * total_base_price) : 0;
//               taxable_amount = Math.round(total_taxable_amount/2);

//               registrationrow = `<tr align="center" valign="middle">
               
//                 <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Application Fee</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_base_price}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_amount}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_amount}</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_amount}</td>
//               </tr>`;

//             }
           
        

//             let file = {
//               content: `
//                 <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: 0 auto 40px;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;"><tbody><tr valign="middle" bgcolor="#45aadc"><td colspan="9" align="center" bgcolor="#45aadc" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">INVOICE</td></tr><tr valign="middle"><td colspan="9" align="center" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 16px;font-weight: bold;line-height: 1.7;padding: 2px 10px;vertical-align: middle;text-align: center;"><p style="margin:0;font-weight: bold;font-size: 9px;">RANI MEYYAMMAI HOSTEL</p><p style="margin:0;font-size: 9px;font-weight: normal;">UNIT OF THE WILLINGDON CHARITABLE TRUST)</p><p style="margin:0;font-size: 9px;">NO.25 ETHIRAJ SALAI, EGMORE, CHENNAI - 600 008</p><p style="margin:0;font-size: 9px;">GSTIN::33AAATT0683N2Z6</p><p style="margin:0;font-size: 9px;">PAN :: AAATT0683N</p></td></tr><tr bgcolor="#45aadc"><td colspan="4" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;width: 50%;"></td>
//                 <td colspan="5" align="center" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;font-family: Tahoma,Arial,sans-serif;font-weight: bold;font-size: 9px;padding: 5px 0;width: 50%;">BILLED TO</td></tr><tr><td colspan="4" valign="middle" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.8;font-weight: bold;padding: 2px 10px;border-bottom: 1px solid #000;"><p style="margin:0;font-size: 10px;">Invoice No: ${invoiceNo} </p><p style="margin:0;font-size: 10px;">Invoice Date:  ${invoiceDate}.</p><p style="margin:0;font-size: 10px;">Reverse Charge (Y/N):No</p><p style="margin:0;font-size: 10px;">State: TAMILNADU</p><p style="margin:0;font-size: 10px;">Code:33</p></td><td colspan="5" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.7;font-weight: bold;padding: 2px 10px;border-left: 1px solid #000;border-bottom: 1px solid #000;"><p style="margin:0;font-size:10px;">NAME:  ${
//                   planDetail[0].SFname.toUpperCase()
//                 }</p><p style="margin:0;">ID NO: ${
//                   planDetail[0].student_id
//                 }</p><p style="margin:0;font-size:10px;">ROOM NO : <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${
//                   planDetail[0].room_number
//                 }</span></p><p style="margin:0;font-size:10px;">Address: ${
//                   planDetail[0].SRaddress
//                 }</p></td></tr>
//                 <tr align="center" valign="middle">
//                   <td width="8%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;"></td>
//                   <td width="14%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">Description</td>
//                   <td width="13%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">HSN / SAC<br>
//                   code, if any</td>
//                   <td width="15%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">Taxable Value</td>
//                   <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">CGST</td>
//                   <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">SGST</td>
//                   <td width="14%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Total in Rs.</td>
//                   </tr>
//                   <tr>
//                   <td width="7%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Rate</td>
//                   <td width="11%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Amount</td>
//                   <td width="7%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Rate</td>
//                   <td width="11%" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;vertical-align: middle;text-align: center;">Amount</td>
//                 </tr>
             
//                 ${registrationrow}
//                 ${roomrentrow}
//                 ${admissionfeesrow}
//                 ${admissionkitrow}
//                 ${culturalfeesrow}
//                 ${mealfeesrow}
//                 ${laundryfeesrow}
//                 ${parkingrow}
//                 ${transpotationgrow}
//                 ${monthlywatebillrow}
//                 ${monthlyelectricitybill}
//                 ${monthly_other_fees}
          

//               <tr>
//                 <td colspan="4" align="center" valign="middle" bgcolor="#45aadc" style="padding: 5px;font-family: Tahoma,Arial sans-serif;font-weight: bold;"><strong>Total Amount in Words</strong></td>
//                 <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount before Tax</td>
//                 <td style="text-align:center;padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">${total_base_price}</td>
//               </tr>
      
//               <tr>
//                   <td colspan="4" rowspan="4" align="center" valign="middle"><p  style="margin:0;font-size:9px;">Rupees ${total_amount_inwords} only.</p></td>
//                   <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: CGST</td>
//                   <td style="padding: 5px;font-family: Tahoma,Arial,sans-serif;text-align: center;">${taxable_amount}</td>
//               </tr>
      
//               <tr>
//                 <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: SGST</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_amount}</td>
//               </tr>
      
//               <tr>
//                 <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Total Tax Amount</td>
//                 <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_taxable_amount}</td>
//               </tr>
      
//               <tr>
//                 <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount including Tax</td>
//                 <td style="text-align:center;font-weight: bold;">${total_amount}</td>
//               </tr>
//                   <tr>
//                     <td colspan="4" rowspan="4" valign="middle"></td>
//                     <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;"><p  style="margin:0;font-size:9px;">Certified that the particulars </p><p  style="margin:0;font-size:9px;">given above are true and correct</p></td>
//                   </tr>
//                   <tr>
//                     <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-size:10px;"><strong>For Rani Meyyammai Hostel</strong></td>
//                   </tr>
//                   <tr>
//                     <td height="100" colspan="5">&nbsp;</td>
//                   </tr>
                
//                 </tbody></table>
             
//                 <p  style="margin:0;font-size:9px;"> This is a system generated invoice that does not required signature.</p>
//                 <br/>
//                 <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
//                   <tbody><tr bgcolor="#45aadc">
//                     <td colspan="2" align="center" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">RECEIPT</td>
//                   </tr><tr>
//                     <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;padding: 15px;">
//                     <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${total_amount}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${total_amount_inwords} only.)</p><p  style="margin:0;font-size:9px;">towards settlement of invoice no. ${invoiceNo} dated <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${currentDate}</span></p></td>
//                   </tr>
    
//                   </tbody>
//                 </table>
//                 <br/>
//                  <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>
//                 <br/>

//                    ${cautionfeesrow}
//                 `,
//             };

//             const options = {
//               pageFormat: "A4",
//               orientation: "portrait",
//               border: "10mm",
//               fontSize: 10,
//               header: {
//                 height: "3mm",
//               },
//               childProcessOptions: {
//                      env: {
//                       OPENSSL_CONF: '/dev/null',
//                     },
//               },
//               type: pdf,
//               footer: {
//                 height: "3mm",
//                 contents: {
//                   default:
//                     '<span style="color: #444; font-size:8px;">{{page}}/{{pages}}</span>', // fallback value
//                 },
//               },
//             };
      
//             pdf.create(file.content, options)
//               .toFile(`public/${pdfName}`, function (err, res) {
//               if (err) return console.log(err);
            
//             });


//             var updateInvoiceName = await knex("student_plan").where({id: req.params.id}).update({
//               invoice_name: pdfName,
//               invoice_no: invoiceNo,
//               send_to_student: "sendto",
//               updated_at: new Date()
//             });

//             return res.json({
//               status: 200,
//               message: "Data fatch successfully",
//               result: process.env.BASE_URL+'/public/'+pdfName,
              
//             });   
            
//           }


//         }else{

//           return res.json({
//             status: 401,
//             message: "It is not Paid yet",
//             result: process.env.BASE_URL+'/public/'+'nonpaid.png',
            
//           }); 
//         }
       
//     } catch (error) {
//       return res.json({
//         status: 401,
//         message: error.message,
//       });
//     }
// });



router.get("/view_payment_details/:id", async (req, res) => {

 
  try {
        var planDetail = await knex("student_details")
        .select('student_details.SFname','student_details.SRaddress','student_details.student_type','room.room_number','student_plan.id as planId','student_plan.plan_id','student_plan.plan_type','student_plan.student_id','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_plan.monthly_other_fees','student_plan.monthly_other_fees_remark','student_plan.invoice_name','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2','student_plan.total_one_time')
        .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
        .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 + monthly_laundry_fee as laundry"))
        .leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')
        .leftJoin('room', 'student_details.room_id', 'room.id')
        .where("student_plan.id", "=" ,req.params.id).limit(1);


        if (planDetail[0].paid === 'Yes') {
          if (planDetail[0].invoice_name) {
            return res.json({
              status: 200,
              message: "Data fetched successfully",
              result: process.env.BASE_URL+'public/'+planDetail[0].invoice_name,
    
            });
          } else {

            let generate_pdf = await invoiceGeneration(planDetail[0].planId);
    
            var pdfNameDetail = await knex("student_plan").where("id", req.params.id).limit(1);
            
            return res.json({
              status: 200,
              message: "Data fetched successfully",
              result: process.env.BASE_URL+'public/'+pdfNameDetail[0].invoice_name,
            });
          }
        } else {
          return res.json({
            status: 401,
            message: "It is not paid yet",
            result: process.env.BASE_URL+'public/nonpaid.png',
          });
        }
       
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({
          status: 500,
          message: "An error occurred",
          error: error.message
        });
      }
    }
});

router.post("/get_payment_details/:id", async (req, res) => {

  try {

    var planDetail = await knex("student_details")
    .select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname','student_details.SRaddress','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2','room.room_number')
    .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 as meal"))
    .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 as laundry"))
    .leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')
    .leftJoin('room', 'student_details.room_id', 'room.id')
    .where("student_plan.id", req.params.id).limit(1);
    
    if(typeof planDetail[0].invoice_name !== 'undefined' && planDetail[0].invoice_name !== null){

      return res.json({
        status: 200,
        message: "Data fatch successfully",
        result: process.env.BASE_URL+'public/'+planDetail[0].invoice_name,
      
      });
      
    }else{


      let currentDate = moment().format("YYYY-MM-DD");
      let invoiceDate = moment(req.body.admin_update_payment_date).format("DD-MM-YYYY");
      let studentName = planDetail[0].SFname.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_');
      let pdfName = `${currentDate}_${studentName}_${await randNumber()}_Payment.pdf`;
      let invoiceNo = 'RMH/'+moment().format("YYYY")+'/'+ await randNumber();
      let total_amount = Math.round(parseInt(planDetail[0].to_pay)-parseInt(planDetail[0].caution_deposit));
      let total_amount_inwords = await inWords(total_amount);

      let meal = planDetail[0].meal ?  planDetail[0].meal : 	planDetail[0].monthly_laundry_fee;
      let laundry = planDetail[0].laundry ?  planDetail[0].laundry : 	planDetail[0].monthly_laundry_fee;

      let refudable = await inWords(planDetail[0].caution_deposit); 


      let baseprice_for_room =  (planDetail[0].room_rent !== null) ?  Math.round((planDetail[0].room_rent/(1+0.12) )) : 0 ; 
      let baseprice_for_admission_fee =  (planDetail[0].addmission_fee !== null) ?  Math.round((planDetail[0].addmission_fee /(1+0.12))) : 0 ;  
      let baseprice_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  Math.round((planDetail[0].admisson_kit /(1+0.12) )) : 0 ;  
      let baseprice_for_cultural_fees = (planDetail[0].cultural_fees!== null) ? Math.round((planDetail[0].cultural_fees /(1+0.12))) : 0 ;  
      let baseprice_for_meal =  (meal!== null) ?  Math.round((meal /(1+0.05) )) : 0 ; 
      let baseprice_for_laundry =    (laundry!== null) ? Math.round((laundry/(1+0.12) )) : 0 ; 
      let baseprice_for_parking = (planDetail[0].parking!== null) ? Math.round((planDetail[0].parking /(1+0.12))) : 0 ; 
      let baseprice_for_transportation =  (planDetail[0].transportation!== null) ? Math.round((planDetail[0].transportation /(1+0.09))) : 0 ; 

      let taxable_for_room =  (planDetail[0].room_rent !== null) ?  Math.round(baseprice_for_room * 0.06) : 0 ; 
      let taxable_for_admission_fee =  (planDetail[0].addmission_fee !== null) ?  Math.round(baseprice_for_admission_fee * 0.06) : 0 ; 
      let taxable_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  Math.round(baseprice_for_admisson_kit * 0.06) : 0 ; 
      let taxable_for_cultural_fees =     (planDetail[0].cultural_fees!== null) ?  Math.round(baseprice_for_cultural_fees * 0.06) : 0 ; 
      let taxable_for_meal =  (meal!== null) ?  Math.round(baseprice_for_meal * 0.025) : 0 ; 
      let taxable_for_laundry =    (laundry!== null) ?  Math.round(baseprice_for_laundry * 0.06) : 0 ; 
      let taxable_for_parking = (planDetail[0].parking!== null) ?  Math.round(baseprice_for_parking * 0.06) : 0 ; 
      let taxable_for_transportation =  (planDetail[0].transportation!== null) ?  (baseprice_for_transportation * 0.09).toFixed(2) : 0 ;



      let total_base_price = (parseInt(baseprice_for_room) + parseInt(baseprice_for_admission_fee) + parseInt(baseprice_for_admisson_kit) + parseInt(baseprice_for_cultural_fees) + parseInt(baseprice_for_meal) + parseInt(baseprice_for_laundry) + parseInt(baseprice_for_parking) + parseInt(baseprice_for_transportation)); 
      let taxable_amount =  (parseInt(taxable_for_room)+parseInt(taxable_for_admission_fee) + parseInt(taxable_for_admisson_kit) + parseInt(taxable_for_cultural_fees) + parseInt(taxable_for_meal) + parseInt(taxable_for_laundry) + parseInt(taxable_for_parking) + parseInt(taxable_for_transportation)); 
      let total_taxable_amount = (taxable_amount * 2);
      
      
      let parkingrow =  planDetail[0].parking==0 ? '': `<tr align="center" valign="middle">
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">7</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Parking</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_parking}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking}</td>
        </tr>`;


        let transpotationgrow =  planDetail[0].transportation==0 ? '': `<tr align="center" valign="middle">
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">8</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Transportation<br>fees</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996411</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_transportation}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">9%</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation}</td>
        <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation}</td>
        </tr>`;


        let file = {
          content: `
            <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: 0 auto 40px;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;"><tbody><tr valign="middle" bgcolor="#45aadc"><td colspan="9" align="center" bgcolor="#45aadc" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">INVOICE</td></tr><tr valign="middle"><td colspan="9" align="center" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 16px;font-weight: bold;line-height: 1.7;padding: 2px 10px;vertical-align: middle;text-align: center;"><p style="margin:0;font-weight: bold;font-size: 9px;">RANI MEYYAMMAI HOSTEL</p><p style="margin:0;font-size: 9px;font-weight: normal;">UNIT OF THE WILLINGDON CHARITABLE TRUST)</p><p style="margin:0;font-size: 9px;">NO.25 ETHIRAJ SALAI, EGMORE, CHENNAI - 600 008</p><p style="margin:0;font-size: 9px;">GSTIN::33AAATT0683N2Z6</p><p style="margin:0;font-size: 9px;">PAN :: AAATT0683N</p></td></tr><tr bgcolor="#45aadc"><td colspan="4" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;width: 50%;"></td>
            <td colspan="5" align="center" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;font-family: Tahoma,Arial,sans-serif;font-weight: bold;font-size: 9px;padding: 5px 0;width: 50%;">BILLED TO</td></tr><tr><td colspan="4" valign="middle" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.8;font-weight: bold;padding: 2px 10px;border-bottom: 1px solid #000;"><p style="margin:0;font-size: 10px;">Invoice No: ${
              invoiceNo
            }</p><p style="margin:0;font-size: 10px;">Invoice Date: ${
              invoiceDate
            }.</p><p style="margin:0;font-size: 10px;">Reverse Charge (Y/N):No</p><p style="margin:0;font-size: 10px;">State: TAMILNADU</p><p style="margin:0;font-size: 10px;">Code:33</p></td><td colspan="5" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.7;font-weight: bold;padding: 2px 10px;border-left: 1px solid #000;border-bottom: 1px solid #000;"><p style="margin:0;font-size:10px;">NAME:  ${
              planDetail[0].SFname.toUpperCase()
            }</p><p style="margin:0;">ID NO: ${
              planDetail[0].student_id
            }</p><p style="margin:0;font-size:10px;">ROOM NO : <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${
              planDetail[0].room_number
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
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_room}</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room}</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room}</td>
                    <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent}</td>
                </tr>
        
        
                 <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission fees</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admission_fee}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee}</td>
                </tr>
        
        
                 <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">3</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission Kit</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admisson_kit}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit}</td>
                </tr>
        
                <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">4</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Cultural fees</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_cultural_fees}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees}</td>
                </tr>
        
        
                <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">5</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Meal Fees (${planDetail[0].meal_type})</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996333</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_meal}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${meal>0 ? meal : 0}</td>
                </tr>
        
                <tr align="center" valign="middle">
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Laundry</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_laundry}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry}</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${laundry > 0 ? laundry : 0}</td>
                </tr>
                 
                ${parkingrow}
                ${transpotationgrow}
        
         
  
              <tr>
                  <td colspan="4" align="center" valign="middle" bgcolor="#45aadc" style="padding: 5px;font-family: Tahoma,Arial sans-serif;font-weight: bold;"><strong>Total Amount in Words</strong></td>
                  <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount before Tax</td>
                  <td style="text-align:center;padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">${total_base_price}</td>
                </tr>
        
                <tr>
                    <td colspan="4" rowspan="4" align="center" valign="middle"><p  style="margin:0;font-size:9px;">Rupees ${total_amount_inwords} only.</p></td>
                    <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: CGST</td>
                    <td style="padding: 5px;font-family: Tahoma,Arial,sans-serif;text-align: center;">${taxable_amount}</td>
                </tr>
        
                <tr>
                  <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: SGST</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_amount}</td>
                </tr>
        
                <tr>
                  <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Total Tax Amount</td>
                  <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_taxable_amount}</td>
                </tr>
        
                <tr>
                  <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount including Tax</td>
                  <td style="text-align:center;font-weight: bold;">${total_amount}</td>
                </tr>
                    <tr>
                      <td colspan="4" rowspan="4" valign="middle"></td>
                      <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;"><p  style="margin:0;font-size:9px;">Certified that the particulars </p><p  style="margin:0;font-size:9px;">given above are true and correct</p></td>
                    </tr>
                    <tr>
                      <td colspan="5" align="center" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-size:10px;"><strong>For Rani Meyyammai Hostel</strong></td>
                    </tr>
                    <tr>
                      <td height="100" colspan="5">&nbsp;</td>
                    </tr>
                  
                  </tbody></table>
  
  
                  <p  style="margin:0;font-size:9px;"> This is a system generated invoice that does not required signature.</p>
                  <br/>
        
             <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
                    <tbody><tr bgcolor="#45aadc">
                      <td colspan="2" align="center" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">RECEIPT</td>
                    </tr><tr>
                      <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;padding: 15px;">
                      <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${total_amount}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${total_amount_inwords} only.)</p><p  style="margin:0;font-size:9px;">towards settlement of invoice no. ${invoiceNo} dated <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${invoiceDate}</span></p></td>
                    </tr>
      
                    </tbody>
                  </table>
                  <br/>
                   <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>
        
  
                  <br/>
                
                  <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
                    <tbody><tr bgcolor="#45aadc">
                      <td colspan="2" align="center" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">RECEIPT</td>
                    </tr><tr>
                      <td colspan="2" style="font-family: Tahoma,Arial,sans-serif;padding: 15px;">
                      <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${planDetail[0].caution_deposit}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${refudable} only.)</p><p  style="margin:0;font-size:9px;">towards
        refundable caution deposit.</p></td>
                    </tr>
                     
                    </tbody>
                  </table>
                  <br/>
                   <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>
                  
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
        childProcessOptions: {
               env: {
                OPENSSL_CONF: '/dev/null',
              },
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
          send_to_student: "sendto",
          updated_at: new Date()
      });

      return res.json({
        status: 200,
        message: "Data fatch successfully",
        result: process.env.BASE_URL+'public/'+pdfName,
        
      });
      
    }
    
    } catch (error) {
      return res.json({
        status: 401,
        message: error.message,
      });
    }
});


// router.get("/get_plandtl/:id", async (req, res) => {


//   try {

//         var planDetail = await knex("student_plan")
//         .select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname','student_details.SRaddress','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2')
//         .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 as meal"))
//         .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 as laundry"))
//         .leftJoin('student_details', 'student_details.id', 'student_plan.student_id')
//         .where("student_plan.id", req.params.id).limit(1);

//         return res.json({
//               status: 200,
//               message: "Data fatch successfully",
//               result: planDetail,
              
//         }); 
             
//   } catch (error) {
//     return res.json({
//       status: 401,
//       message: error.message,
//     });
//   }
// });



router.get("/get_plandtl/:id", async (req, res) => {

  try {
   
        var planDetail = await knex("student_plan")
        .select('student_plan.id as plan_id','student_plan.plan_type','student_plan.student_id','student_plan.student_type','student_plan.room_no','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_details.SFname','student_details.SRaddress','student_plan.monthly_other_fees','student_plan.invoice_name','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2')
        .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 as meal"))
        .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 as laundry"))
        .leftJoin('student_details', 'student_details.id', 'student_plan.student_id')
        .where("student_plan.id", req.params.id).limit(1);

        return res.json({
              status: 200,
              message: "Data fatch successfully",
              result: planDetail,
              
        }); 
             
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



router.post("/update_offline_paymentdtl/:id", async (req, res) => {

  try {
   
        var viewPlanDetail = await knex("student_plan").where("id", req.params.id).limit(1);
        var offline_payment_document = await base64_decode(req.body.offline_payment_document);

        var updateInvoiceName = await knex("student_plan").where({id: req.params.id}).update({
          paid: "Yes",
          send_to_student: "yes",
          offline_payment_document : offline_payment_document,
          offline_payment_ref_dtl: req.body.offline_payment_ref_dtl,
          offline_payment_type: req.body.offline_payment_type,
          admin_update_payment_date: req.body.offline_payment_date,
          updated_at: req.body.offline_payment_date,
        });

 
        let selectedStudent = await knex("student_details")
        .where("id", viewPlanDetail[0].student_id)
        .limit(1);

       
        var viewPaymentDetail = await knex("payment_activity").where({plan_id: req.params.id}).limit(1);

        if(viewPaymentDetail.length != 0){

          var updatePaymentDtl = await knex("payment_activity").where( {
            plan_id: req.params.id,
            student_id: viewPlanDetail[0].student_id,
          }).update({
            payment_id: "",
            type: "Offline",
          });

        }else{

          var updatePaymentDtl = await knex("payment_activity").insert({
            plan_id:  req.params.id,
            student_id: viewPlanDetail[0].student_id,
            student_name: selectedStudent[0].SFname,
            payment_id: "",
            amount:  Math.round(req.body.offline_payment_amout),
            type: "Offline",
            status: 1,
            created_at: req.body.offline_payment_date,
            updated_at: req.body.offline_payment_date 
          });
        }

        if(typeof viewPlanDetail[0].invoice_name !== 'undefined' && viewPlanDetail[0].invoice_name !== null){

          return res.json({
            status: 200,
            message: "Data fatch successfully",
          
          });
        }else{

          let generate_pdf = await invoiceGeneration(req);

          return res.json({
            status: 200,
            message: "Data fatch successfully",
          });

        }

     
             
  } catch (error) {

   
      return res.json({
        status: 401,
        message: error.message,
      });
  }
  
});


router.get("/get_current_regular_plan/:id", async (req, res) => {

  try {
        var user_current_plan_dtl = await knex("student_plan")
          //.whereRaw('plan_id = term')
          .where("student_plan.plan_id","<=", 5)
          .where({
            student_id: req.params.id,
            status: 1
          })
          .andWhere("student_plan.plan_type","!=",'postpaid')
          .andWhere("student_plan.plan_type","!=", 'prepaid')
          .orderBy("id", "desc").limit(1);

         

        return res.json({
          status: 200,
          message: "Data fatch successfully",
          result: user_current_plan_dtl,
        
        }); 
       
    } catch (error) {
      return res.json({
        status: 401,
        message: error.message,
      });
    }
});

router.post("/calculate_gst", async (req, res) => {

  try {
         
        const taxDetail = await knex("tax_setting").where("tax_slug", req.body.field).first();

        if (!taxDetail) {
          // Handle case where no tax setting is found
          return res.json({
            status: 200,
            data: req.body.amount,
            message: "Data fatch successfully",
          });
        }else{

          const baseAmount = parseFloat(req.body.amount); 
          const cgst = parseFloat(taxDetail.cgst); 
          const sgst = parseFloat(taxDetail.sgst); 

          const totalTaxPercent = cgst + sgst;
          const gstAmount = (baseAmount * totalTaxPercent) / 100;
          const totalAmount = baseAmount + gstAmount;

            return res.json({
              status: 200,
              data: totalAmount,
              taxDetail: taxDetail,
              message: "Data fatch successfully",
            });
        }
               
  } catch (error) {

   
      return res.json({
        status: 401,
        message: error.message,
      });
  }
  
});


router.get("/delete_plan/:id", async (req, res) => {

  try {

        var plan_id = req.params.id;
   
         var updateInvoiceName = await knex("student_plan").where({id: plan_id}).update({
          status: 0
        });

        return res.json({
              status: 200,
              message: "Data Deleted successfully"
              
        }); 
             
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



async function base64_decode(base64Image) {
  let base64String = base64Image.split(";base64,").pop();
  const image = Buffer.from(base64String, "base64");
  var imageName = "temp/" + Date.now() + ".png";
  fs.writeFileSync(imageName, image);
  var upload = await file_upload(imageName);
  fs.rmSync(imageName);
  return upload.Location;
}

module.exports = router;
