const express = require("express");
const router = express.Router();
const knex = require('../../module/knex_connect');
const XLSX = require('xlsx');
var moment = require("moment");



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

          //console.log('data',data);

          // Process the data as needed
          // For example, you can log it or insert it into the database
          for (const key in data) {

            //var viewPaymentDetail = await knex("payment_activity").where("payment_id", data[key].PaymentID).limit(1);
            
              // if(viewPaymentDetail.length != 0){

                
              // } 
              
              
              const user_details = await knex("student_details")
                .select('student_details.*','room.room_number as room_id')
                .leftJoin('room', 'student_details.room_id', 'room.id')
                .where("student_details.id", data[key].AppNo)
                .limit(1);
               

                  //const jsDate = new Date((data[key].PaymentDate - 25569) * 86400 * 1000);
                  const jsDate = moment().month();


                  if(user_details.length>0){

                    let studentParams = {
                      student_id: user_details[0].id,
                      student_type:  user_details[0].student_type,
                      plan_id: 5,
                      term: 5,
                      plan_type: 'postpaid',
                      bed_type: user_details[0].bed_type,
                      room_no: user_details[0].room_id,
                      meal_type: user_details[0].food_preference,
                      parking_type: user_details[0].parking_name != "" ? user_details[0].parking_name : null,
                      monthly: data[key].monthly,
                      waterCan: data[key].noOfCan ?  data[key].noOfCan : 0,
                      monthly_water_bill: data[key].WaterBill ?  data[key].WaterBill : 0,
                      openingUnit: data[key].openingUnit ?  data[key].openingUnit : 0,
                      closingUnit: data[key].closingUnit ?  data[key].closingUnit : 0,
                      monthly_electricity_bill: data[key].ElectricityBill ?  data[key].ElectricityBill : 0,
                    
                      total: data[key].AmountPaid,
                      total_one_time: data[key].AmountPaid,
                      to_pay: data[key].AmountPaid,
                      paid: 'Yes',
                      created_at: moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss"),
                      status: 1,
                    };

                    console.log('studentParams',studentParams);
                    var insert_data = await knex("student_plan").insert([studentParams]);

                    let update_token = await knex("student_details")
                    .where({ id: user_details[0].id})
                    .update({
                      plan_id: 5,
                    });
                    // if (insert_data.length > 0) {
                    //     let insert_payment_activity =  await knex("payment_activity").insert([
                    //     {
          
                    //       plan_id: insert_data[0],
                    //       student_id: user_details[0].id,
                    //       student_name: user_details[0].SFname,
                    //       payment_id: data[key].PaymentID,
                    //       amount: data[key].AmountPaid,
                    //       type: 'Online',
                    //       status: 1,
                    //       created_at: moment()
                    //       .utcOffset("+05:30")
                    //       .format("YYYY-MM-DD HH:mm:ss"),
                    //       updated_at: moment(jsDate)
                    //       .utcOffset("+05:30")
                    //       .format("YYYY-MM-DD HH:mm:ss"),
                    //     }]);
                    // }
                    
                  }
          }
   
      res.status(200).json({ message: "Update successfully" });
  } catch (error) {
      console.error("Error reading Excel file:", error);
      res.status(500).json({ message: error });
  }
});

module.exports = router;