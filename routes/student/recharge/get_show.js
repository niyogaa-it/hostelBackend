const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
var moment = require("moment");

router.post("/get", async (req, res) => {
  try {
    var listData = await knex("student_details").where({
      id: req.user.id,
      is_approved: 1,
    });
  
    return res.json({
      status: 200,
      message: "Successfully details fetched",
      result: listData[0],
    });
    var plan = await knex("plan").where({
      plan: req.body.plan_type,
      food_preference: listData[0].food_preference,
      room_type: listData[0].occupancy,
      parking: listData[0].parking,
    });

    var data = await knex("recharge").where({
      student_id: req.user.id,
    });
    var dateNow;
    if (data.length == 0) {
      dateNow = new Date(
        new Date().getFullYear() + "-" + new Date().getMonth() + "-" + "05"
      );
    } else {
      dateNow = new Date(data[data.length - 1].end_date);
    }
    return res.json({
      status: 200,
      message: "Successfully get Notifications",
      result: plan,
      end_date:
        plan.length > 0
          ? addDays(dateNow, plan[0].plan == "Monthly" ? 30 : 365)
          : "",
      current_plan: data.length == 0 ? {} : data[data.length - 1],
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

// router.get("/all", async (req, res) => {
//   try {
//     console.log(req.user);
//     var getData = await knex("payment_activity")
//       .where({
//         student_id: req.user.id,
//       })
//       .orderBy("id", "desc");
//     var data = await knex("recharge").where({
//       student_id: req.user.id,
//     });
//     var dateNow;
//     if (data.length == 0) {
//       dateNow = new Date(
//         new Date().getFullYear() + "-" + new Date().getMonth() + "-" + "05"
//       );
//     } else {
//       dateNow = new Date(data[0].end_date);
//     }
//     // console.log(ok);

//     return res.json({
//       status: 200,
//       result: getData,
//     });
//   } catch (error) {
//     // console.log(ok);
//     return res.json({
//       status: 401,
//       message: error.message,
//     });
//   }
// });

router.get("/all", async (req, res) => {
  try {
    var listData = await knex("payment_activity")
    .select('payment_activity.*','student_plan.invoice_name','student_plan.send_to_student','student_plan.to_pay')
    .leftJoin('student_plan', 'payment_activity.plan_id', 'student_plan.id')
    .where("payment_activity.student_id","=", req.user.id)
    //.where("student_plan.student_id","=", req.user.id)
    .where("student_plan.status","=", 1)
    .orderBy("id", "desc");

   
    var studentData = await knex("student_details").where({
      id: req.user.id
    }).select("id",  "SFname", "SmobNo");

    if (listData.length > 0) {
      return res.json({
        status: 200,
        message: "Successfully plan fetched",
        data: [{'plan_details':listData, 'studentData': studentData[0]}]
  
      });
    } else {
      return res.json({
        status: 401,
        message: "No plans found for you",
        data:[],
       
      });
    }
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.get("/get_my_plan", async (req, res) => {
  try {
    var listData = await knex("student_plan")
    //.select('student_plan.*','DATE_FORMAT(student_plan.lateral_start_date, "%d/%m/%Y") AS lateral_start_date')
    .where({
      student_id: req.user.id,
      paid: 'No',
      status: 1
    })
    .orderBy("id", "desc");


    if(listData.length>0){

      for (let i = 0; i < listData.length; i++) {
    
        listData[i].lateral_start_date = (listData[i].lateral_start_date) ?  moment(listData[i].lateral_start_date).utcOffset("+05:30").format("DD/MM/YYYY") : "";
        listData[i].lateral_end_date =  (listData[i].lateral_end_date) ? moment(listData[i].lateral_end_date).utcOffset("+05:30").format("DD/MM/YYYY") : "" ;
        listData[i].parking_start_date =  (listData[i].parking_start_date) ? moment(listData[i].parking_start_date).utcOffset("+05:30").format("DD/MM/YYYY"): "" ;
        listData[i].parking_end_date = (listData[i].parking_end_date) ? moment(listData[i].parking_end_date).utcOffset("+05:30").format("DD/MM/YYYY"): "" ;
        listData[i].transport_start_date =  (listData[i].transport_start_date) ? moment(listData[i].transport_start_date).utcOffset("+05:30").format("DD/MM/YYYY"): "" ;
        listData[i].transport_end_date =  (listData[i].transport_end_date) ? moment(listData[i].transport_end_date).utcOffset("+05:30").format("DD/MM/YYYY"): "" ;
      }
    }


    // if(listData[0].monthly){
    //   listData[0].monthly = moment(listData[0].monthly, 'MM').format('MMMM');
    // }
   
    var studentData = await knex("student_details").where({
      id: req.user.id
    }).select("id",  "SFname", "SmobNo");

    if (listData.length > 0) {
      return res.json({
        status: 200,
        message: "Successfully plan fetched",
        data: [{'plan_details':listData, 'studentData': studentData[0]}]
  
      });
    } else {
      return res.json({
        status: 401,
        message: "No plans found for you",
        data:[],
       
      });
    }
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



router.get("/payment/all", async (req, res) => {
  try {
 
    var getData = await knex("payment_activity")
    .select('student_details.id','student_details.SFname','payment_activity.payment_id','payment_activity.amount','payment_activity.type','payment_activity.created_at')
    .leftJoin('student_details', 'student_details.plan_id','student_details.plan_id')
    .orderBy("payment_activity.id", "desc");
    // console.log(ok);

    return res.json({
      status: 200,
      result: getData,
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_monthly_plan", async (req, res) => {
  try {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    let month_name = monthNames[d.getMonth()];
    var listData = await knex("monthly_payment").where({
      student_id: req.user.id,
      status: 1,
      for_month: month_name,
    //  paid: null,
    });

    return res.json({
      status: 200,
      message: "Successfully monthly details fetched",
      result: listData.length > 0 ? listData[0] : [],
     
    });
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
module.exports = router;
