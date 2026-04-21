const request = require("request");


let pdf = require("html-pdf");
var moment = require("moment");
const knex = require("../module/knex_connect");
const { inWords,randNumber } = require("./numbertowords");


function getFinancialYear(date) {
  if (!date || !date.isValid()) return '24-25'; // fallback
  const year = date.year();
  // Financial year starts from April
  if (date.month() >= 3) { // April is month 3 (0-indexed)
    const start = (year % 100).toString().padStart(2, '0');
    const end = ((year + 1) % 100).toString().padStart(2, '0');
    return `${start}-${end}`;
  } else {
    const start = ((year - 1) % 100).toString().padStart(2, '0');
    const end = (year % 100).toString().padStart(2, '0');
    return `${start}-${end}`;
  }
}


async function invoiceGeneration(req) {

    try {
     
          var planDetail = await knex("student_details")
          .select('student_details.SFname','student_details.SRaddress','student_details.student_type','room.room_number','student_plan.id as planId','student_plan.plan_id','student_plan.plan_type','student_plan.student_id','student_plan.addmission_fee','student_plan.admisson_kit','student_plan.cultural_fees','student_plan.caution_deposit','student_plan.room_rent','student_plan.parking','student_plan.parking_type','student_plan.transportation','student_plan.meal_type','student_plan.total','student_plan.to_pay','student_plan.created_at','student_plan.updated_at as paid_on','student_plan.paid','student_plan.monthly_other_fees','student_plan.monthly_other_fees_remark','student_plan.gstIncluded','student_plan.edit_plan_type','student_plan.invoice_name','student_plan.invoice_no','student_plan.monthly_mess_fee','student_plan.monthly_laundry_fee','student_plan.monthly_electricity_bill','student_plan.monthly_water_bill','student_plan.meal_t1','student_plan.meal_t2','student_plan.laundry_t1','student_plan.laundry_t2','student_plan.total_one_time')
          .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
          .columns(knex.raw("student_plan.laundry_t1 + student_plan.laundry_t2 + monthly_laundry_fee as laundry"))
          .leftJoin('student_plan', 'student_plan.student_id', 'student_details.id')
          .leftJoin('room', 'student_details.room_id', 'room.id')
          .where("student_plan.id", "=" ,req.params.id).limit(1);

          let tax_details = await knex("tax_setting").where("status", "=" ,'active');

          let get_last_plan_invoiceno =  await knex("student_plan").whereNotNull("invoice_no").orderBy("id", "desc").limit(1);

          let new_number = 1; // Declare new_number with a default value
          
          if (get_last_plan_invoiceno.length > 0) {
            let last_invoice_no = get_last_plan_invoiceno[0].invoice_no;
            
            // Extract the numeric part using regex
            let match = last_invoice_no.match(/(\d+)$/);
            
            if (match) {
              let last_number = parseInt(match[1], 10);
              new_number = last_number + 1;
            }
          }
          
          let currentDate = moment().format("DD-MM-YYYY");
          //let invoiceDate = moment(req.body.admin_update_payment_date).format("DD-MM-YYYY");
          let invoiceDate = planDetail[0]?.paid_on ? moment(planDetail[0]?.paid_on).format("DD-MM-YYYY")
            : moment(planDetail[0]?.admin_update_payment_date).format("DD-MM-YYYY");

          let studentName = planDetail[0].SFname.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_');
          let pdfName = `${currentDate}_${studentName}_${await randNumber()}_Payment.pdf`;

          const createdAt = planDetail[0]?.created_at ? moment(planDetail[0].created_at) : null;

          const fy = getFinancialYear(createdAt);
          let padded_number = String(new_number).padStart(4, '0');
          let invoiceNo = planDetail[0]?.invoice_no ? planDetail[0].invoice_no : `RMH/${fy}/${padded_number}`;

          let total_amount = 0;
          let total_amount_inwords = "";
          let refudable = 0;

          let registrationrow = '';
          let roomrentrow  = '';
          let admissionfeesrow = '';
          let admissionkitrow = '';
          let culturalfeesrow = '';
          let cautionfeesrow = '';
          let mealfeesrow = '';
          let laundryfeesrow = '';
          let parkingrow = '';
          let transpotationgrow = '';
          let monthlywatebillrow = '';
          let monthlyelectricitybill = '';
          let monthlyOtherFees = '';
         

          let meal = planDetail[0] && planDetail[0].meal 
          ? planDetail[0].meal 
          : planDetail[0]?.monthly_mess_fee || 0;

         
          let laundry = planDetail[0] && planDetail[0].laundry 
          ? planDetail[0].laundry 
          : planDetail[0]?.monthly_laundry_fee || 0;


        const gstIncluded = planDetail[0]?.gstIncluded ?? 'yes';


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

          let roomrent_cgst_in_percent = 0;
          let admissionfees_cgst_in_percent = 0;
          let admissionkitfees_cgst_in_percent = 0;
          let culturalfees_cgst_in_percent = 0;
          let mealfees_cgst_in_percent = 0;
          let laundry_cgst_in_percent = 0;
          let parking_cgst_in_percent = 0;
          let transpotation_cgst_in_percent = 0;
          let waterfees_cgst_in_percent = 0;
          let electricityfees_cgst_in_percent = 0;
          let otherfees_cgst_in_percent = 0;
          let registrationfees_cgst_in_percent = 0;

          let roomrent_sgst_in_percent = 0;
          let admissionfees_sgst_in_percent = 0;
          let admissionkitfees_sgst_in_percent = 0;
          let culturalfees_sgst_in_percent = 0;
          let mealfees_sgst_in_percent = 0;
          let laundry_sgst_in_percent = 0;
          let parking_sgst_in_percent = 0;
          let transpotation_sgst_in_percent = 0;
          let waterfees_sgst_in_percent = 0;
          let electricityfees_sgst_in_percent = 0;
          let otherfees_sgst_in_percent = 0;
          let registrationfees_sgst_in_percent = 0;



          let ori_baseprice_for_room =  (planDetail[0].room_rent !== null) ?  planDetail[0].room_rent : 0 ; 
          let ori_baseprice_for_admission_fee =  (planDetail[0].addmission_fee !== null) ? planDetail[0].addmission_fee : 0 ;  
          let ori_baseprice_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  planDetail[0].admisson_kit : 0 ;  
          let ori_baseprice_for_cultural_fees = (planDetail[0].cultural_fees!== null) ? planDetail[0].cultural_fees : 0 ;  
          let ori_baseprice_for_meal =  (meal!== null) ?  meal : 0 ; 
          let ori_baseprice_for_laundry =    (laundry!== null) ? laundry : 0 ; 
          let ori_baseprice_for_parking = (planDetail[0].parking!== null) ? planDetail[0].parking : 0 ; 
          let ori_baseprice_for_transportation =  (planDetail[0].transportation!== null) ? planDetail[0].transportation : 0 ; 
          let ori_baseprice_for_wc =  (planDetail[0].monthly_water_bill>0) ? planDetail[0].monthly_water_bill : 0 ; 
          let ori_baseprice_for_eb = (planDetail[0].monthly_electricity_bill>0) ? planDetail[0].monthly_electricity_bill : 0 ; 
          let ori_baseprice_for_other = (planDetail[0].monthly_other_fees>0) ? planDetail[0].monthly_other_fees : 0;


          let taxable_for_room_cgst =  0; 
          let taxable_for_admission_fee_cgst =  0; 
          let taxable_for_admisson_kit_cgst =  0; 
          let taxable_for_cultural_fees_cgst =  0; 
          let taxable_for_meal_cgst =  0; 
          let taxable_for_laundry_cgst =  0; 
          let taxable_for_parking_cgst =  0; 
          let taxable_for_transportation_cgst =  0;
          let taxable_for_wc_cgst =  0;
          let taxable_for_eb_cgst =  0;
          let taxable_for_other_cgst =  0;


          //calculate sgst
          let taxable_for_room_sgst =   0; 
          let taxable_for_admission_fee_sgst =  0; 
          let taxable_for_admisson_kit_sgst =  0; 
          let taxable_for_cultural_fees_sgst =  0; 
          let taxable_for_meal_sgst =  0; 
          let taxable_for_laundry_sgst = 0; 
          let taxable_for_parking_sgst =  0; 
          let taxable_for_transportation_sgst =  0;
          let taxable_for_wc_sgst =  0;
          let taxable_for_eb_sgst =  0;
          let taxable_for_other_sgst =  0;




          if (gstIncluded == 'yes') {

              roomrent_totalgst_in_percent = ((tax_details[0].cgst + tax_details[0].sgst) / 100);
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

              roomrent_cgst_in_percent = (tax_details[0].cgst / 100);
              admissionfees_cgst_in_percent = (tax_details[1].cgst / 100);
              admissionkitfees_cgst_in_percent = (tax_details[2].cgst / 100);
              culturalfees_cgst_in_percent = (tax_details[3].cgst / 100);
              mealfees_cgst_in_percent = (tax_details[4].cgst / 100);
              laundry_cgst_in_percent = (tax_details[5].cgst / 100);
              parking_cgst_in_percent = (tax_details[6].cgst / 100);
              transpotation_cgst_in_percent = (tax_details[7].cgst / 100);
              waterfees_cgst_in_percent = (tax_details[8].cgst / 100);
              electricityfees_cgst_in_percent = (tax_details[9].cgst / 100);
              otherfees_cgst_in_percent = (tax_details[10].cgst / 100);
              registrationfees_cgst_in_percent = (tax_details[11].cgst / 100);

              roomrent_sgst_in_percent = (tax_details[0].sgst / 100);
              admissionfees_sgst_in_percent = (tax_details[1].sgst / 100);
              admissionkitfees_sgst_in_percent = (tax_details[2].sgst / 100);
              culturalfees_sgst_in_percent = (tax_details[3].sgst / 100);
              mealfees_sgst_in_percent = (tax_details[4].sgst / 100);
              laundry_sgst_in_percent = (tax_details[5].sgst / 100);
              parking_sgst_in_percent = (tax_details[6].sgst / 100);
              transpotation_sgst_in_percent = (tax_details[7].sgst / 100);
              waterfees_sgst_in_percent = (tax_details[8].sgst / 100);
              electricityfees_sgst_in_percent = (tax_details[9].sgst / 100);
              otherfees_sgst_in_percent = (tax_details[10].sgst / 100);
              registrationfees_sgst_in_percent = (tax_details[11].sgst / 100);


              ori_baseprice_for_room =  (planDetail[0].room_rent !== null) ?  (planDetail[0].room_rent/(1+roomrent_totalgst_in_percent) ) : 0 ; 
              ori_baseprice_for_admission_fee =  (planDetail[0].addmission_fee !== null) ? (planDetail[0].addmission_fee /(1 + admissionfees_totalgst_in_percent)) : 0 ;  
              ori_baseprice_for_admisson_kit =  (planDetail[0].admisson_kit!== null) ?  (planDetail[0].admisson_kit /(1 + admissionkitfees_totalgst_in_percent) ) : 0 ;  
              ori_baseprice_for_cultural_fees = (planDetail[0].cultural_fees!== null) ? (planDetail[0].cultural_fees /(1+ culturalfees_totalgst_in_percent)) : 0 ;  
              ori_baseprice_for_meal =  (meal!== null) ?  (meal /(1+ mealfees_totalgst_in_percent) ) : 0 ; 
              ori_baseprice_for_laundry =    (laundry!== null) ? (laundry/(1+ laundry_totalgst_in_percent) ) : 0 ; 
              ori_baseprice_for_parking = (planDetail[0].parking!== null) ? (planDetail[0].parking /(1+ parking_totalgst_in_percent)) : 0 ; 
              ori_baseprice_for_transportation =  (planDetail[0].transportation!== null) ? (planDetail[0].transportation /(1+ transpotation_totalgst_in_percent )) : 0 ; 
              ori_baseprice_for_wc =  (planDetail[0].monthly_water_bill>0) ? (planDetail[0].monthly_water_bill/(1+ waterfees_totalgst_in_percent) ) : 0 ; 
              ori_baseprice_for_eb = (planDetail[0].monthly_electricity_bill>0) ? (planDetail[0].monthly_electricity_bill/(1+ electricityfees_totalgst_in_percent) ) : 0 ; 
              ori_baseprice_for_other = (planDetail[0].monthly_other_fees>0) ? (planDetail[0].monthly_other_fees/(1+ otherfees_totalgst_in_percent) ) : 0;
          
              //calculate cgst
              taxable_for_room_cgst = (planDetail[0].room_rent !== null) ? (ori_baseprice_for_room * roomrent_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_admission_fee_cgst = (planDetail[0].addmission_fee !== null) ? (ori_baseprice_for_admission_fee * admissionfees_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_admisson_kit_cgst = (planDetail[0].admisson_kit !== null) ? (ori_baseprice_for_admisson_kit * admissionkitfees_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_cultural_fees_cgst = (planDetail[0].cultural_fees !== null) ? (ori_baseprice_for_cultural_fees * culturalfees_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_meal_cgst = (meal !== null) ? (ori_baseprice_for_meal * mealfees_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_laundry_cgst = (laundry !== null) ? (ori_baseprice_for_laundry * laundry_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_parking_cgst = (planDetail[0].parking !== null) ? (ori_baseprice_for_parking * parking_cgst_in_percent).toFixed(2) : 0; 
              taxable_for_transportation_cgst = (planDetail[0].transportation !== null) ? (ori_baseprice_for_transportation * transpotation_cgst_in_percent).toFixed(2) : 0;
              taxable_for_wc_cgst = (planDetail[0].monthly_water_bill > 0) ? (ori_baseprice_for_wc * waterfees_cgst_in_percent).toFixed(2) : 0;
              taxable_for_eb_cgst = (planDetail[0].monthly_electricity_bill > 0) ? (ori_baseprice_for_eb * electricityfees_cgst_in_percent).toFixed(2) : 0;
              taxable_for_other_cgst = (planDetail[0].monthly_other_fees > 0) ? (ori_baseprice_for_other * otherfees_cgst_in_percent).toFixed(2) : 0;


              //calculate sgst
              taxable_for_room_sgst = (planDetail[0].room_rent !== null) ? (ori_baseprice_for_room * roomrent_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_admission_fee_sgst = (planDetail[0].addmission_fee !== null) ? (ori_baseprice_for_admission_fee * admissionfees_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_admisson_kit_sgst = (planDetail[0].admisson_kit !== null) ? (ori_baseprice_for_admisson_kit * admissionkitfees_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_cultural_fees_sgst = (planDetail[0].cultural_fees !== null) ? (ori_baseprice_for_cultural_fees * culturalfees_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_meal_sgst = (meal !== null) ? (ori_baseprice_for_meal * mealfees_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_laundry_sgst = (laundry !== null) ? (ori_baseprice_for_laundry * laundry_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_parking_sgst = (planDetail[0].parking !== null) ? (ori_baseprice_for_parking * parking_sgst_in_percent).toFixed(2) : 0; 
              taxable_for_transportation_sgst = (planDetail[0].transportation !== null) ? (ori_baseprice_for_transportation * transpotation_sgst_in_percent).toFixed(2) : 0;
              taxable_for_wc_sgst = (planDetail[0].monthly_water_bill > 0) ? (ori_baseprice_for_wc * waterfees_sgst_in_percent).toFixed(2) : 0;
              taxable_for_eb_sgst = (planDetail[0].monthly_electricity_bill > 0) ? (ori_baseprice_for_eb * electricityfees_sgst_in_percent).toFixed(2) : 0;
              taxable_for_other_sgst = (planDetail[0].monthly_other_fees > 0) ? (ori_baseprice_for_other * otherfees_sgst_in_percent).toFixed(2) : 0;

          }


          let baseprice_for_room = (planDetail[0].room_rent !== null) ? Number(ori_baseprice_for_room).toFixed(2) : "0.00";
          let baseprice_for_admission_fee = (planDetail[0].addmission_fee !== null) ? Number(ori_baseprice_for_admission_fee).toFixed(2) : "0.00";
          let baseprice_for_admisson_kit = (planDetail[0].admisson_kit !== null) ? Number(ori_baseprice_for_admisson_kit).toFixed(2) : "0.00";
          let baseprice_for_cultural_fees = (planDetail[0].cultural_fees !== null) ? Number(ori_baseprice_for_cultural_fees).toFixed(2) : "0.00";
          let baseprice_for_meal = (meal !== null) ? Number(ori_baseprice_for_meal).toFixed(2) : "0.00";
          let baseprice_for_laundry = (laundry !== null) ? Number(ori_baseprice_for_laundry).toFixed(2) : "0.00";
          let baseprice_for_parking = (planDetail[0].parking !== null) ? Number(ori_baseprice_for_parking).toFixed(2) : "0.00";
          let baseprice_for_transportation = (planDetail[0].transportation !== null) ? Number(ori_baseprice_for_transportation).toFixed(2) : "0.00";
          let baseprice_for_wc = (planDetail[0].monthly_water_bill > 0) ? Number(ori_baseprice_for_wc).toFixed(2) : "0.00";
          let baseprice_for_eb = (planDetail[0].monthly_electricity_bill > 0) ? Number(ori_baseprice_for_eb).toFixed(2) : "0.00";
          let baseprice_for_other = (planDetail[0].monthly_other_fees > 0) ? Number(ori_baseprice_for_other).toFixed(2) : "0.00";
          

         

          let total_base_price = (
            Number(ori_baseprice_for_room) +
            Number(ori_baseprice_for_admission_fee) +
            Number(ori_baseprice_for_admisson_kit) +
            Number(ori_baseprice_for_cultural_fees) +
            Number(ori_baseprice_for_meal) +
            Number(ori_baseprice_for_laundry) +
            Number(ori_baseprice_for_parking) +
            Number(ori_baseprice_for_transportation) +
            Number(ori_baseprice_for_wc) +
            Number(ori_baseprice_for_eb) +
            Number(ori_baseprice_for_other)
          ).toFixed(2);
          let taxable_amount_for_cgst =  (parseFloat(taxable_for_room_cgst)+parseFloat(taxable_for_admission_fee_cgst) + parseFloat(taxable_for_admisson_kit_cgst) + parseFloat(taxable_for_cultural_fees_cgst) + parseFloat(taxable_for_meal_cgst) + parseFloat(taxable_for_laundry_cgst) + parseFloat(taxable_for_parking_cgst) + parseFloat(taxable_for_transportation_cgst) + parseFloat(taxable_for_wc_cgst) + parseFloat(taxable_for_eb_cgst) + parseFloat(taxable_for_other_cgst)).toFixed(2); 
          let taxable_amount_for_sgst =  (parseFloat(taxable_for_room_sgst)+parseFloat(taxable_for_admission_fee_sgst) + parseFloat(taxable_for_admisson_kit_sgst) + parseFloat(taxable_for_cultural_fees_sgst) + parseFloat(taxable_for_meal_sgst) + parseFloat(taxable_for_laundry_sgst) + parseFloat(taxable_for_parking_sgst) + parseFloat(taxable_for_transportation_sgst) + parseFloat(taxable_for_wc_sgst) + parseFloat(taxable_for_eb_sgst) + parseFloat(taxable_for_other_sgst)).toFixed(2); 
          let total_taxable_amount = parseFloat(taxable_amount_for_cgst + taxable_amount_for_sgst).toFixed(2);


          // if (gstIncluded === "no") {
          //   taxable_amount_for_cgst = "0.00";
          //   taxable_amount_for_sgst = "0.00";
          //   total_taxable_amount = "0.00";
          //   total_amount = Number(total_base_price);
          // }

        
          if((planDetail[0].plan_id == 1 || 
            planDetail[0].plan_id == 2 || 
            planDetail[0].plan_id == 3 || 
            planDetail[0].plan_id == 4 || 
            planDetail[0].plan_type == 'lateral' || 
            planDetail[0].plan_type == 'temporary') 
            && planDetail[0].edit_plan_type === null){

            if(planDetail[0].caution_deposit>0){
              total_amount = Math.round(parseInt(planDetail[0].to_pay)-parseInt(planDetail[0].caution_deposit));
              total_amount_inwords = await inWords(total_amount);
              refudable = await inWords(planDetail[0].caution_deposit); 

            }else{
              total_amount = Math.round(parseInt(planDetail[0].to_pay));
              total_amount_inwords = await inWords(total_amount);
            }

      
            roomrentrow =  planDetail[0].room_rent>0 ? `<tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Room Rent</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_room}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[0].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[0].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].room_rent.toFixed(2)}</td>
            </tr>`: '';

            admissionfeesrow =  planDetail[0].addmission_fee>0 ?  `<tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission fees</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admission_fee}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[1].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[1].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admission_fee_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].addmission_fee.toFixed(2)}</td>
            </tr>` : '';

            admissionkitrow =  planDetail[0].admisson_kit>0 ? `<tr align="center" valign="middle">
              <td  colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Admission Kit</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_admisson_kit}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[2].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[2].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_admisson_kit_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].admisson_kit.toFixed(2)}</td>
            </tr>` : '';

            culturalfeesrow =  planDetail[0].cultural_fees>0 ? `<tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Cultural fees</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_cultural_fees}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[3].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[3].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_cultural_fees_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].cultural_fees.toFixed(2)}</td>
            </tr>`: '';

            mealfeesrow =  planDetail[0].meal>0 ? ` <tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Meal Fees (${planDetail[0].meal_type})</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996333</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_meal}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[4].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[4].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].meal>0 ? planDetail[0].meal.toFixed(2) : 0}</td>
            </tr>`: '';

            laundryfeesrow =  planDetail[0].laundry > 0 ? ` <tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Laundry</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_laundry}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[5].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[5].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_laundry_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].laundry > 0 ? planDetail[0].laundry.toFixed(2) : 0}</td>
            </tr>`: '';

            parkingrow =  planDetail[0].parking==0 ? '': `<tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Parking</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_parking}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[6].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[6].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${(Number(planDetail[0].parking) || 0).toFixed(2)}</td>
            </tr>`;

            transpotationgrow =  planDetail[0].transportation==0 ? '': `<tr align="center" valign="middle">
              <td  colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Transportation<br>fees</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996411</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_transportation}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[7].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[7].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${(Number(planDetail[0].transportation) || 0).toFixed(2)}</td>
            </tr>`;

            monthlywatebillrow =  planDetail[0].monthly_water_bill>0 ? `<tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Water Can Fees</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_wc}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[8].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[8].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${(Number(planDetail[0].monthly_water_bill) || 0).toFixed(2)}</td>
            </tr>`: '';

            monthlyelectricitybill =  planDetail[0].monthly_electricity_bill>0 ? `<tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Electricity Fees</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_eb}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[9].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[9].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${(Number(planDetail[0].monthly_electricity_bill) || 0).toFixed(2)}</td>
              </tr>`: '';

            monthlyOtherFees =  planDetail[0].monthly_other_fees ? `<tr align="center" valign="middle">
            <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_other_fees_remark}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">99799</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_other}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[10].cgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other_cgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[10].sgst}%</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other_sgst}</td>
            <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${(Number(planDetail[0].monthly_other_fees) || 0).toFixed(2)}</td>
            </tr>`: '';


            cautionfeesrow =  planDetail[0].caution_deposit>0 ? `<table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: auto;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;">
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
              <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>`: '';
          }

         

          
          if(planDetail[0].plan_type== 'prepaid'){

            total_amount = planDetail[0].to_pay;
            total_amount_inwords = await inWords(total_amount);

            total_base_price =  (parseFloat(baseprice_for_parking) + parseFloat(baseprice_for_transportation)).toFixed(2);

            taxable_amount_for_cgst = (parseFloat(taxable_for_parking_cgst) + parseFloat(taxable_for_transportation_cgst)).toFixed(2); 
            taxable_amount_for_sgst = (parseFloat(taxable_for_parking_sgst) + parseFloat(taxable_for_transportation_sgst)).toFixed(2); 
            total_taxable_amount = (parseFloat(taxable_amount_for_cgst) + parseFloat(taxable_amount_for_sgst)).toFixed(2);

            parkingrow =  planDetail[0].parking==0 ? '': `<tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Parking</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_parking}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[6].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[6].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_parking_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].parking.toFixed(2)}</td>
            </tr>`;


              transpotationgrow =  planDetail[0].transportation==0 ? '': `<tr align="center" valign="middle">
                <td  colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Transportation<br>fees</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996411</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_transportation}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[7].cgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation_cgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[7].sgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_transportation_sgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].transportation.toFixed(2)}</td>
              </tr>`;
          }

          if(planDetail[0].plan_type== 'postpaid'){

            total_amount = Math.round(planDetail[0].to_pay);
            total_amount_inwords = await inWords(total_amount);

            total_base_price = (parseFloat(baseprice_for_wc) + parseFloat(baseprice_for_eb) + parseFloat(baseprice_for_other)).toFixed(2); 

            taxable_amount_for_cgst =  (parseFloat(taxable_for_wc_cgst) + parseFloat(taxable_for_eb_cgst) + parseFloat(taxable_for_other_cgst)).toFixed(2); 

            taxable_amount_for_sgst =  (parseFloat(taxable_for_wc_sgst) + parseFloat(taxable_for_eb_sgst) + parseFloat(taxable_for_other_sgst)).toFixed(2); 

            total_taxable_amount = (parseFloat(taxable_amount_for_cgst) + parseFloat(taxable_amount_for_sgst)).toFixed(2);



            monthlywatebillrow =  planDetail[0].monthly_water_bill>0 ? `<tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Water Can Fees</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_wc}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[8].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[8].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_wc_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_water_bill.toFixed(2)}</td>
              </tr>`: '';


              monthlyelectricitybill =  planDetail[0].monthly_electricity_bill>0 ? `<tr align="center" valign="middle">
                <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Electricity Fees</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_eb}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[9].cgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb_cgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[9].sgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_eb_sgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_electricity_bill.toFixed(2)}</td>
                </tr>`: '';


                monthlyOtherFees =  planDetail[0].monthly_other_fees ? `<tr align="center" valign="middle">
                <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_other_fees_remark}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">99799</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_other}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[10].cgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other_cgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[10].sgst}%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_other_sgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${planDetail[0].monthly_other_fees.toFixed(2)}</td>
                </tr>`: '';
          }


          if(planDetail[0].plan_id =='6'){

            total_amount = planDetail[0].to_pay;
            total_amount_inwords = await inWords(total_amount);

            let ori_baseprice_for_reg = (planDetail[0].to_pay > 0) 
              ? planDetail[0].to_pay / (1 + registrationfees_totalgst_in_percent) 
              : 0;

            let baseprice_for_reg = ori_baseprice_for_reg.toFixed(2);   
            let taxable_for_reg_cgst = (planDetail[0].to_pay > 0) ? (ori_baseprice_for_reg * registrationfees_cgst_in_percent).toFixed(2) : 0;
            let taxable_for_reg_sgst = (planDetail[0].to_pay > 0) ? (ori_baseprice_for_reg * registrationfees_sgst_in_percent).toFixed(2) : 0;

            taxable_amount_for_cgst =  (parseFloat(taxable_for_reg_cgst)).toFixed(2); 
            taxable_amount_for_sgst =  (parseFloat(taxable_for_reg_sgst)).toFixed(2);  
            total_taxable_amount = parseFloat(taxable_amount_for_cgst + taxable_amount_for_sgst).toFixed(2);

            registrationrow = `<tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Application Fee</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_reg}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[11].cgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_reg_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${tax_details[11].sgst}%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_reg_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_amount.toFixed(2)}</td>
            </tr>`;

          }

          if(planDetail[0].edit_plan_type== 'Room change'){

              total_amount = Math.round(planDetail[0].total);
              total_amount_inwords = await inWords(total_amount);

          
                // let taxableforroom =  (planDetail[0].total !== null) ?  Math.round(((planDetail[0].total / 112)*100)) : 0 ;
                // baseprice_for_room = taxableforroom;
                // taxable_for_room =  Math.round(((taxableforroom *0.12))/2);
                // total_base_price = (planDetail[0].total);
                // taxable_amount = taxable_for_room;
                // total_base_price = baseprice_for_room;
                // total_taxable_amount = (taxable_for_room * 2);


                baseprice_for_room =  (total_amount>0) ?  ((total_amount / 112)*100).toFixed(2) : 0 ;
                taxable_for_room_cgst =  (parseFloat(baseprice_for_room * roomrent_cgst_in_percent)).toFixed(2);
                taxable_for_room_sgst =  (parseFloat(baseprice_for_room * roomrent_sgst_in_percent)).toFixed(2);
                taxable_amount_for_cgst =  (parseFloat(taxable_for_room_cgst)).toFixed(2); 
                taxable_amount_for_sgst =  (parseFloat(taxable_for_room_sgst)).toFixed(2); 
                total_taxable_amount = parseFloat(taxable_amount_for_cgst + taxable_amount_for_sgst).toFixed(2);


               

                roomrentrow =  planDetail[0].room_rent>0 ? `<tr align="center" valign="middle">
                <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Room Rent</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996322</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_room}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room_cgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">6%</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_room_sgst}</td>
                <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_amount.toFixed(2)}</td>
                </tr>`: '';
             
          }


          if(planDetail[0].edit_plan_type == 'Meal change'){

            total_amount = Math.round(planDetail[0].total);
            total_amount_inwords = await inWords(total_amount);

              // let taxableformeal =  (planDetail[0].total !== null) ?  Math.round(((planDetail[0].total / 105)*100)) : 0 ;
              // baseprice_for_meal =   taxableformeal;
              // taxable_for_meal = Math.round(((taxableformeal *0.05))/2); 
              // taxable_amount = taxable_for_meal;
              // total_base_price = baseprice_for_meal;
              // total_taxable_amount = (taxable_for_meal * 2);

              baseprice_for_meal =  (planDetail[0].total !== null) ?  (((planDetail[0].total / 105)*100)).toFixed(2) : 0 ;
              taxable_for_meal_cgst =  (parseFloat(baseprice_for_meal * mealfees_cgst_in_percent)).toFixed(2);
              taxable_for_meal_sgst =  (parseFloat(baseprice_for_meal * mealfees_sgst_in_percent)).toFixed(2);
              taxable_amount_for_cgst =  (parseFloat(taxable_for_meal_cgst)).toFixed(2); 
              taxable_amount_for_sgst =  (parseFloat(taxable_for_meal_sgst)).toFixed(2);
              total_taxable_amount = parseFloat(taxable_amount_for_cgst + taxable_amount_for_sgst).toFixed(2);

              mealfeesrow =  planDetail[0].meal>0 ? ` <tr align="center" valign="middle">
              <td colspan="2" style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">Meal Fees (${planDetail[0].meal_type})</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">996333</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${baseprice_for_meal}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal_cgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">2.5%</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_for_meal_sgst}</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${total_amount.toFixed(2)}</td>
              </tr>`: '';
          }  
        
          let file = {
            content: `
              <table width="100%" border="1" cellspacing="0" cellpadding="0" align="center" style="table-layout: fixed;border-collapse: collapse;border-spacing:0;font-family:Tahoma,Arial,sans-serif;color:#231f20;margin: 0 auto 40px;width: 100%;min-width:500px;max-width: 500px;border: 1px solid #000;background-color: #ffffff;padding: 10px 0;font-size: 6px;"><tbody><tr valign="middle" bgcolor="#45aadc"><td colspan="9" align="center" bgcolor="#45aadc" style="text-align: center;font-family:Tahoma,Arial,sans-serif;padding: 10px 0;font-size: 14px;font-weight: bold;color: #000000;border-top: 1px solid #000;border-bottom: 1px solid #000;">INVOICE</td></tr><tr valign="middle"><td colspan="9" align="center" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 16px;font-weight: bold;line-height: 1.7;padding: 2px 10px;vertical-align: middle;text-align: center;"><p style="margin:0;font-weight: bold;font-size: 9px;">RANI MEYYAMMAI HOSTEL</p><p style="margin:0;font-size: 9px;font-weight: normal;">UNIT OF THE WILLINGDON CHARITABLE TRUST)</p><p style="margin:0;font-size: 9px;">NO.25 ETHIRAJ SALAI, EGMORE, CHENNAI - 600 008</p><p style="margin:0;font-size: 9px;">GSTIN::33AAATT0683N2Z6</p><p style="margin:0;font-size: 9px;">PAN :: AAATT0683N</p></td></tr><tr bgcolor="#45aadc"><td colspan="4" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;border-right: 1px solid #000;width: 50%;"></td>
              <td colspan="5" align="center" valign="middle" style="border-top: 1px solid #000;border-bottom: 1px solid #000;font-family: Tahoma,Arial,sans-serif;font-weight: bold;font-size: 9px;padding: 5px 0;width: 50%;">BILLED TO</td></tr><tr><td colspan="4" valign="middle" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.8;font-weight: bold;padding: 2px 10px;border-bottom: 1px solid #000;"><p style="margin:0;font-size: 10px;">Invoice No: ${invoiceNo} </p><p style="margin:0;font-size: 10px;">Invoice Date:  ${invoiceDate}.</p><p style="margin:0;font-size: 10px;">Reverse Charge (Y/N):No</p><p style="margin:0;font-size: 10px;">State: TAMILNADU</p><p style="margin:0;font-size: 10px;">Code:33</p></td><td colspan="5" style="font-family: Tahoma,Arial,sans-serif;color: #000000;font-size: 10px;line-height: 1.7;font-weight: bold;padding: 2px 10px;border-left: 1px solid #000;border-bottom: 1px solid #000;"><p style="margin:0;font-size:10px;">NAME:  ${
                planDetail[0].SFname.toUpperCase()
              }</p><p style="margin:0;">ID NO: ${
                planDetail[0].student_id
              }</p><p style="margin:0;font-size:10px;">ROOM NO : <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${
                planDetail[0].room_number
              }</span></p><p style="margin:0;font-size:10px;">Address: ${
                planDetail[0].SRaddress
              }</p></td></tr>
              <tr align="center" valign="middle">
                <td width="8%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;"></td>
                <td width="14%" rowspan="2" style="font-family: Tahoma,Arial,sans-serif;color: #000000;padding: 2px 10px;font-weight: bold;">Description</td>
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
          
              ${registrationrow}
              ${roomrentrow}
              ${admissionfeesrow}
              ${admissionkitrow}
              ${culturalfeesrow}
              ${mealfeesrow}
              ${laundryfeesrow}
              ${parkingrow}
              ${transpotationgrow}
              ${monthlywatebillrow}
              ${monthlyelectricitybill}
              ${monthlyOtherFees}
        

            <tr>
              <td colspan="4" align="center" valign="middle" bgcolor="#45aadc" style="padding: 5px;font-family: Tahoma,Arial sans-serif;font-weight: bold;"><strong>Total Amount in Words</strong></td>
              <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">Total Amount before Tax</td>
              <td style="text-align:center;padding: 5px;font-family: Tahoma,Arial,sans-serif;font-weight: bold;">${total_base_price}</td>
            </tr>
    
            <tr>
                <td colspan="4" rowspan="4" align="center" valign="middle"><p  style="margin:0;font-size:9px;">Rupees ${total_amount_inwords} only.</p></td>
                <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: CGST</td>
                <td style="padding: 5px;font-family: Tahoma,Arial,sans-serif;text-align: center;">${taxable_amount_for_cgst}</td>
            </tr>
    
            <tr>
              <td colspan="4" style="padding: 5px;font-family: Tahoma,Arial,sans-serif;">Add: SGST</td>
              <td style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${taxable_amount_for_sgst}</td>
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
                  <p  style="margin:0;font-size:9px;">Received with thanks from ${planDetail[0].SFname} a sum of Rs.${total_amount}/-</p><p  style="margin:0;font-size:9px;">(Rupees ${total_amount_inwords} only.)</p><p  style="margin:0;font-size:9px;">towards settlement of invoice no. ${invoiceNo} dated <span style="text-align:center;font-family: Tahoma,Arial,sans-serif;padding: 5px 2px;">${currentDate}</span></p></td>
                </tr>

                </tbody>
              </table>
              <br/>
              <p  style="margin:0;font-size:9px;"> This is a system generated receipt that does not required signature.</p>
              <br/>

                ${cautionfeesrow}
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

          

          //res.json({ message: 'Success' });
          return { message: 'Success' };
    } catch (error) {

      //res.status(500).json({ error: error });
      //return { message: error };
      throw error;
      
    }
 
}

module.exports = {invoiceGeneration};
