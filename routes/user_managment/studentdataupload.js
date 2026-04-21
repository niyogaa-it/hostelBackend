const express = require("express");
const router = express.Router();
const knex = require('../../module/knex_connect');
const { customInvoiceGeneration } = require("../../module/cutomeinvoice_pdf");
const XLSX = require('xlsx');
var moment = require("moment");
const fs = require('fs');
var path = require('path');


function excelSerialToDate(serial) {
  const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

router.post("/", async (req, res) => {



    try {
            const base64Data = req.body.bulkuploadDoc.split(',')[1]; // Get the part after "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
            const buffer = Buffer.from(base64Data, 'base64'); // Decode the base64 data
           
            // Read the workbook from the buffer
            const workbook = XLSX.read(buffer, { type: 'buffer' });
  
            // Assuming you want to read the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
  
            // Convert the sheet data to JSON
            const data = XLSX.utils.sheet_to_json(worksheet);


            let failedInserts = [];
            let successInserts = [];
                    
          
          for (const key of Object.keys(data)) {


            const ifInvoiceExists = await knex('student_plan')
            .where('invoice_no', data[key]?.InvoiceNumber)
            .first();

             const ifPaymentIDExists = await knex('payment_activity')
            .where('payment_id', data[key]?.PaymentId)
            .first();


            if (ifInvoiceExists || ifPaymentIDExists) {
              console.log(`Skipping ApplicationNo: ${data[key]?.ApplicationNo} — already exists`);
              continue; 
              
            }

           

            let student_plan_dtl;
            let update_student;
            let user_details = [];
            let roomdetails = [];
            let generate_pdf; 
            let isSaveData;
            let room_number = 0;
            let planId = 0;
            let plan_id = 0;

              let paymentDate = data[key]?.paymentDate;

              if (!isNaN(paymentDate)) {
                // Excel serial → JS date
                let jsDate = excelSerialToDate(paymentDate);
                paymentDate = moment(jsDate).format("YYYY-MM-DD");
              } else if (
                paymentDate &&
                moment(paymentDate, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"], true).isValid()
              ) {
                paymentDate = moment(paymentDate, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
              } else {
                // fallback → current date
                paymentDate = moment().format("YYYY-MM-DD");
              }

              let InvoiceDate = data[key]?.InvoiceDate;

              if (!isNaN(InvoiceDate)) {
                let jsDate = excelSerialToDate(InvoiceDate);
                InvoiceDate = moment(jsDate).format("YYYY-MM-DD");
              } else if (
                InvoiceDate &&
                moment(InvoiceDate, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"], true).isValid()
              ) {
                InvoiceDate = moment(InvoiceDate, ["DD/MM/YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
              } else {
                // fallback → current date
                InvoiceDate = moment().format("YYYY-MM-DD");
              }

          
            if(data[key]?.ApplicationNo){

              user_details = await knex("student_details")
              .select('student_details.*')
              //.leftJoin('room', 'student_details.room_id', 'room.id')
              .where("student_details.id", data[key]?.ApplicationNo)
              .limit(1);

             


              if (user_details && user_details.length > 0) {
               
                //Raise the demand

                if((data[key]?.plantype === 'One Time Fees + Term I + Term II') || (data[key]?.plantype === 'One Time Fees + Term I') || (data[key]?.plantype === 'One Time Fees + Term II') || (data[key]?.plantype === 'Term II')){

                  let academic_year = user_details[0].AcademicYear;
                  let [startYear, endYear] = academic_year.split('-').map(Number);
                  
                  let firstDayOfJune = new Date(`${startYear}-06-01`);
                  let lastDayOfNovember =  new Date(`${startYear}-11-30`);
                  let firstDayOfDecember = new Date(`${startYear}-12-01`);
                  let lastDayOfMay = new Date(`${endYear}-05-31`);
          
                  let normal_start_date="";
                  let normal_end_date ="";

                  if(data[key]?.plantype=='One Time Fees + Term I + Term II'){
                    normal_start_date = firstDayOfJune ? firstDayOfJune : null;
                    normal_end_date =   lastDayOfMay ? lastDayOfMay : null;
                    planId = 1;
                  } else if(data[key]?.plantype=='One Time Fees + Term I'){
          
                    normal_start_date = firstDayOfJune ? firstDayOfJune : null;
                    normal_end_date =   lastDayOfNovember ? lastDayOfNovember : null;
                    planId = 2;
                  }else if(data[key]?.plantype=='One Time Fees + Term II'){
          
                    normal_start_date = firstDayOfDecember ? firstDayOfDecember : null;
                    normal_end_date =   lastDayOfMay ? lastDayOfMay : null;
                    planId = 3;
                  }else{
                    normal_start_date = firstDayOfDecember ? firstDayOfDecember : null;
                    normal_end_date =   lastDayOfMay ? lastDayOfMay : null;
                    planId = 4;
                  }
          
                  let studentParams = {
                    student_id: user_details[0].id,
                    student_type: user_details[0].student_type,
                    plan_id: planId,
                    plan_type: data[key]?.plantype,
                    term: planId,
                    normal_start_date: normal_start_date ? normal_start_date : null,
                    normal_end_date:  normal_end_date ? normal_end_date : null,

                    room_rent:  (!data[key]?.Total_Room_Rent || isNaN(data[key]?.Total_Room_Rent) || (typeof data[key]?.Total_Room_Rent != 'number')) ?0 : Math.round(data[key]?.Total_Room_Rent),
                    cultural_fees:  (!data[key]?.Total_Cultural_Fee || isNaN(data[key]?.Total_Cultural_Fee) || (typeof data[key]?.Total_Cultural_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Cultural_Fee),
                    caution_deposit:  (!data[key]?.Caution || isNaN(data[key]?.Caution) || (typeof data[key]?.Caution != 'number')) ?0 : Math.round(data[key]?.Caution),
                    addmission_fee:  (!data[key]?.Total_Admission_Fee || isNaN(data[key]?.Total_Admission_Fee) || (typeof data[key]?.Total_Admission_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Admission_Fee),
                    admisson_kit:  (!data[key]?.Total_Admission_Kit || isNaN(data[key]?.Total_Admission_Kit) || (typeof data[key]?.Total_Admission_Kit != 'number')) ?0 : Math.round(data[key]?.Total_Admission_Kit),
                    meal_t1:   (!data[key]?.Total_Mess_Fee || isNaN(data[key]?.Total_Mess_Fee) || (typeof data[key]?.Total_Mess_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Mess_Fee),
                    laundry_t1:   (!data[key]?.Total_Laundry_Fee || isNaN(data[key]?.Total_Laundry_Fee) || (typeof data[key]?.Total_Laundry_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Laundry_Fee),
                    monthly_other_fees:  (!data[key]?.Total_otherFee || isNaN(data[key]?.Total_otherFee) || (typeof data[key]?.Total_otherFee != 'number')) ?0 : Math.round(data[key]?.Total_otherFee),
                    monthly_other_fees_remark: data[key]?.Total_otherFee > 0 ?data[key]?.Total_otherRemarks : "",
                   
                 
                    invoice_no: data[key]?.InvoiceNumber,
                    total:  Math.round(data[key]?.PaymentAmount),
                    total_one_time:  Math.round(data[key]?.PaymentAmount),
                    to_pay:  Math.round(data[key]?.toPay),
                    paid: 'No',
                    gstIncluded:data[key]?.gstIncluded,
                    created_at: moment()
                      .utcOffset("+05:30")
                      .format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: InvoiceDate,
                    status: 1,
                  };



                    try {
                        student_plan_dtl = await knex("student_plan").insert([studentParams]);
                        successInserts.push(data[key]?.ApplicationNo);
                    } catch (err) {
                        console.error(`Failed to insert ApplicationNo: ${data[key]?.ApplicationNo}`, err);
                        failedInserts.push(data[key]?.ApplicationNo);
                    }

                  update_student = await knex("student_details")
                  .where({ id: user_details[0].id })
                  .update({
                    plan_id: planId,
                    term: planId,
                  });

                }
                
                if((data[key]?.plantype === 'prepaid') || (data[key]?.plantype === 'postpaid') || (data[key]?.plantype === 'temporary') || (data[key]?.plantype === 'lateral')){
                 
                
                  if(data[key]?.plantype=='prepaid'){
          
                    total_bill = Math.round(
                      data[key]?.PaymentAmount
                    );
          
                  } else if(data[key]?.plantype=='postpaid'){
          
                     total_bill = Math.round(
                      data[key]?.PaymentAmount 
                    );
          
                  }else {
          
                     total_bill = Math.round(
                      data[key]?.PaymentAmount
                    );
                    
                  }

                  let studentParams = {
                    student_id: user_details[0].id,
                    student_type: user_details[0].student_type,
                    plan_id: 5,
                    term: 5,
                    plan_type: data[key]?.plantype.toLowerCase(),
                    bed_type: user_details[0].bed_type,
                    //room_no: user_details[0].room_id ??null,
                    meal_type: user_details[0].food_preference,
                    parking_type: user_details[0].parking_type ?user_details[0].parking_type : null,
                    monthly: null,
                
                    parking_start_date: data[key]?.plantype == 'prepaid' && data[key]?.StartDate 
                    ?moment(data[key]?.StartDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.StartDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    parking_end_date: data[key]?.plantype == 'prepaid' && data[key]?.EndDate 
                    ?moment(data[key]?.EndDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.EndDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    transport_start_date: data[key]?.plantype == 'prepaid' && data[key]?.StartDate 
                    ?moment(data[key]?.StartDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.StartDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    transport_end_date: data[key]?.plantype == 'prepaid' && data[key]?.EndDate 
                    ?moment(data[key]?.EndDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.EndDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                   

                    addmission_fee: (!data[key]?.Total_Admission_Fee || isNaN(data[key]?.Total_Admission_Fee) || (typeof data[key]?.Total_Admission_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Admission_Fee),
                    admisson_kit: (!data[key]?.Total_Admission_Kit || isNaN(data[key]?.Total_Admission_Kit) || (typeof data[key]?.Total_Admission_Kit != 'number')) ?0 : Math.round(data[key]?.Total_Admission_Kit),
                    cultural_fees: (!data[key]?.Total_Cultural_Fee || isNaN(data[key]?.Total_Cultural_Fee) || (typeof data[key]?.Total_Cultural_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Cultural_Fee),
                    caution_deposit: (!data[key]?.Caution || isNaN(data[key]?.Caution) || (typeof data[key]?.Caution != 'number')) ?0 : Math.round(data[key]?.Caution),

                    lateral_start_date: data[key]?.plantype == 'lateral' && data[key]?.StartDate 
                    ?moment(data[key]?.StartDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.StartDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    lateral_end_date:  data[key]?.plantype == 'lateral' && data[key]?.EndDate 
                    ?moment(data[key]?.EndDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.EndDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    temporary_start_date: data[key]?.plantype == 'temporary' && data[key]?.StartDate 
                    ?moment(data[key]?.StartDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.StartDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,
                    temporary_end_date:  data[key]?.plantype == 'temporary' && data[key]?.EndDate 
                    ?moment(data[key]?.EndDate, "DD/MM/YYYY").isValid() 
                      ?moment(data[key]?.EndDate, "DD/MM/YYYY").format("YYYY-MM-DD") 
                      : null 
                    : null,

                    room_rent: (!data[key]?.Total_Room_Rent || isNaN(data[key]?.Total_Room_Rent) || (typeof data[key]?.Total_Room_Rent != 'number')) ?0 : Math.round(data[key]?.Total_Room_Rent),
                    monthly_mess_fee: (!data[key]?.Total_Mess_Fee || isNaN(data[key]?.Total_Mess_Fee) || (typeof data[key]?.Total_Mess_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Mess_Fee),
                    monthly_laundry_fee: (!data[key]?.Total_Laundry_Fee || isNaN(data[key]?.Total_Laundry_Fee) || (typeof data[key]?.Total_Laundry_Fee != 'number')) ?0 : Math.round(data[key]?.Total_Laundry_Fee),
                    parking: data[key]?.fourWheel > 0 ?Math.round(data[key]?.fourWheel) : data[key]?.twoWheel > 0 ?Math.round(data[key]?.twoWheel) : 0,
                    transportation: (!data[key]?.Total_Transport || isNaN(data[key]?.Total_Transport) || (typeof data[key]?.Total_Transport != 'number')) ?0 : Math.round(data[key]?.Total_Transport),
                    monthly_water_bill:  (!data[key]?.Total_WaterCan_Fee || isNaN(data[key]?.Total_WaterCan_Fee) || (typeof data[key]?.Total_WaterCan_Fee != 'number')) ?0 : Math.round(data[key]?.Total_WaterCan_Fee),
                    monthly_electricity_bill:  (!data[key]?.Total_AC_Fee || isNaN(data[key]?.Total_AC_Fee) || (typeof data[key]?.Total_AC_Fee != 'number')) ?0 : Math.round(data[key]?.Total_AC_Fee),
                    monthly_other_fees:  (!data[key]?.Total_otherFee || isNaN(data[key]?.Total_otherFee) || (typeof data[key]?.Total_otherFee != 'number')) ?0 : Math.round(data[key]?.Total_otherFee),

                    
                    monthly_other_fees_remark: data[key]?.Total_otherFee > 0 ?data[key]?.Total_otherRemarks : "",
                    is_adjust: data[key]?.isAdjust,
                    adjust_value: (!data[key]?.adjustValue || isNaN(data[key]?.adjustValue) || (typeof data[key]?.adjustValue != 'number')) ?0 : Math.round(data[key]?.adjustValue),
                    invoice_no:  data[key]?.InvoiceNumber,
                    total: total_bill,
                    total_one_time: total_bill,
                    to_pay:  Math.round(data[key]?.toPay),
                    paid: 'Yes',
                    gstIncluded:data[key]?.gstIncluded,
                    created_at: moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss"),
                    updated_at: InvoiceDate,
                    status: 1,
                  };

                    try {
                        student_plan_dtl = await knex("student_plan").insert([studentParams]);
                        successInserts.push(data[key]?.ApplicationNo);
                    } catch (err) {
                        console.error(`Failed to insert ApplicationNo: ${data[key]?.ApplicationNo}`, err);
                        failedInserts.push(data[key]?.ApplicationNo);
                    }

                    // update_student = await knex("student_details")
                    // .where({ id: user_details[0].id })
                    // .update({
                    //   plan_id: planId,
                    //   term: planId,
                    // });

                }

              }

            }

       
          
            plan_id = student_plan_dtl && student_plan_dtl.length > 0 ? student_plan_dtl[0] : 0;
            
            var updatePaymentDtl = await knex("payment_activity").insert({
              plan_id:  plan_id,
              student_id: data[key]?.ApplicationNo ?data[key]?.ApplicationNo: isSaveData[0],
              student_name: user_details.length > 0 && user_details[0]?user_details[0].SFname : 'na',
              payment_id: data[key]?.PaymentId,
              amount:  Math.round(data[key]?.PaymentAmount),
              type: data[key]?.payment_type,
              //type: data[key]?.payment_type.charAt(0).toUpperCase() + data[key]?.payment_type.slice(1),
              status: 1,
              created_at: paymentDate,
              updated_at: paymentDate
            });

            
            var updateInvoiceName = await knex("student_plan").where({id: plan_id}).update({
              paid: "Yes",
              send_to_student: "yes",
              offline_payment_type: "",
              admin_update_payment_date:  paymentDate,
              updated_at: InvoiceDate
            });
            
            if(data[key]?.RoomNo){
              
              roomdetails = await knex("room")
              .where("room_number", data[key]?.RoomNo)
              .limit(1);
              
              if (roomdetails.length > 0) {
                  room_number = roomdetails[0].room_number;
              } else {
                  room_number = 0;
              }

            }

            generate_pdf = await customInvoiceGeneration(plan_id,room_number);

          }
         
        
  
          res.status(200).json({
              message: "Process completed",
              successCount: successInserts.length,
              failedCount: failedInserts.length,
              failedApplications: failedInserts, // so you know which were not inserted
          });

       
    } catch (error) {
        console.error(`Failed to insert ApplicationNo: ${data[key]?.ApplicationNo}`, err);
        failedInserts.push(data[key]?.ApplicationNo);
        
        //res.status(500).json({ message: error.message  });
    }
});

module.exports = router;