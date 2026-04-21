/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const file_upload = require("../../../module/file_upload");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const fs = require("fs");
var moment = require("moment");
const { sentMailTo } = require("../../../module/mail");
const sentSms = require("../../../module/sent_sms");


router.post("/get_edit_values", async (req, res) => {

  
  try {

    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.edit_type == undefined || req.body.edit_type == "") {
      return res.json({
        status: 401,
        message: "Please select what you want to update Room or Meal",
      });
    } else {


      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);

      let check_user = "";

      if(req.body.edit_type=='room'){

        // check_user =await knex("student_plan")
        //   .select(`*`)
        //   .columns(knex.raw("student_plan.room_rent as oldRoomrent"))
        //   .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
        //   .where({
        //     student_id: req.body.student_id,
        //     status: 1,  
        //    })
        //    .where("student_plan.plan_id","<=", 5)
        //    .where("student_plan.plan_type","!=",'postpaid')
        //    .where("student_plan.plan_type","!=",'prepaid')
        //    .where("student_plan.plan_id","!=",4)
        //    .orderBy("student_plan.id", "desc")
        //    .limit(1);


           check_user =await knex("student_plan")
          .select(`*`)
          .columns(knex.raw("student_plan.room_rent as oldRoomrent"))
          .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
          .where({
            student_id: req.body.student_id,
            status: 1,  
           })
           .having(knex.raw("oldRoomrent"), ">", 0)
           .orderBy("student_plan.id", "desc")
           .limit(1);
      }


      if(req.body.edit_type=='meal'){

        // check_user =await knex("student_plan")
        //   .select(`*`)
        //   .columns(knex.raw("student_plan.room_rent as oldRoomrent"))
        //   .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
        //   .where({
        //     student_id: req.body.student_id,
        //     status: 1,  
        //    })
        //   .where("student_plan.plan_id","<=", 5)
        //   .where("student_plan.plan_type","!=",'postpaid')
        //   .where("student_plan.plan_type","!=",'prepaid')
        //   .orderBy("id", "desc").limit(1);

        check_user =await knex("student_plan")
          .select(`*`)
          .columns(knex.raw("student_plan.room_rent as oldRoomrent"))
          .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
          .where({
            student_id: req.body.student_id,
            status: 1,  
           })
           .having(knex.raw("meal"), ">", 0)
           .orderBy("student_plan.id", "desc")
           .limit(1);

      }


      if (check_user.length > 0) {
       
        if (req.body.edit_type == "room") {
  
          var get_rooms = await knex("room")
          .select(
            "id",
            "occupancy",
            "room_type",
            "building_name",
            "room_number",
            "floor",
            "toilet_type",
            "vaccancy"
          )
            .where({
              status: 1,
            })
            //.whereNot('vaccancy', '=', knex.ref('total_occupancy'))
            .where('vaccancy', '>', 0)
            .orderBy("room_number", "asc");

          if (get_rooms.length > 0) {
            return res.json({
              status: 200,
              student_plan: check_user,
              rooms_data: get_rooms,
              student_dtl: user_dtl,
              message: "Room list fetched",
            });
          } else {
            return res.json({
              status: 401,
              message: "No vaccant rooms found",
            });
          }
        } else{

          return res.json({
            status: 200,
            student_dtl: user_dtl,
            student_plan: check_user,
            message: "List fetched",
          });

        }
 
      } else {
        return res.json({
          status: 401,
          student_dtl: user_dtl,
          message: "No plan found for this student",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/edit_room", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.room_no == undefined || req.body.room_no == "") {
      return res.json({
        status: 401,
        message: "Please select Room",
      });
    } else {


      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.student_type','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);

        var data_table =
        user_dtl[0].student_type == "new"
            ? "plan_new_student"
            : "plan_old_student";

            let get_room_no =  await knex("room")
            .where({ id: req.body.room_no, status: 1 })
            .limit(1);
        
            let room_no = `%,${get_room_no[0].room_number},%`;
      

        const get_bed_type = await knex(`${data_table}`)
          .select(`bed_type`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
          .havingRaw(`rooms LIKE '${room_no}' `);

        return res.json({
          status: 200,
          bed_type: get_bed_type,
        });
      
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/get_room_values", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else {
      var isStudentidExists = await knex("student_details")
        .where({
          id: req.body.student_id,
        })
        .limit(1);

      if (isStudentidExists.length == 0) {
        return res.json({
          status: 401,
          message: "Student id is not exists",
        });
      }

      req.body.parking = isStudentidExists[0].parking;
      req.body.room_type = isStudentidExists[0].room_type;
      req.body.occupancy = isStudentidExists[0].occupancy;
      req.body.toilet_type = isStudentidExists[0].toilet_type;

      var get_rooms = await knex("room")
       .select('room.*','building.building_name')
      .leftJoin('building', 'room.building_id', 'building.id')
      .where({
        'room.room_type': req.body.room_type,
        'room.occupancy': req.body.occupancy,
        'room.toilet_type': req.body.toilet_type,
        'room.status': 1,
      })
        // .andWhere(function () {
        //   this.where("vaccancy", ">", 0);
        // })
        //.whereNot('vaccancy', '=', knex.ref('total_occupancy'))
        .where('vaccancy', '>', 0)
        .orderBy("room_number", "asc");

      if (get_rooms.length > 0) {
        return res.json({
          status: 200,
          rooms_data: get_rooms,
          message: "Room list fetched",
        });
      } else {
        return res.json({
          status: 401,
          message: "No vaccant rooms found",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/edit_bed_type", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.room_no == undefined || req.body.room_no == "") {
      return res.json({
        status: 401,
        message: "Please select Room",
      });
    } else if (req.body.bed_type == undefined || req.body.bed_type == "") {
      return res.json({
        status: 401,
        message: "Please select Bed Type",
      });
    } else {


      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.student_type','student_details.SmobNo','student_details.StudEmail','student_details.bed_type','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);

     

        var data_table =
        user_dtl[0].student_type == "new"
          ? "plan_new_student"
          : "plan_old_student";


          let get_room_no =  await knex("room")
          .where({ id: req.body.room_no, status: 1 })
          .limit(1);
      
          let room_no = `%,${get_room_no[0].room_number},%`;


        const new_room_plan_details = await knex(`${data_table}`)
        .select(`*`, knex.raw(`CONCAT(',',room_nos,',') as rooms`))
        .havingRaw(`rooms LIKE '${room_no}' `)
        .where({
          bed_type: req.body.bed_type == "Upper Berth" ? "ub" : "lb",
        });
       
        let old_room_no = `%,${user_dtl[0].room_number},%`;

        const old_get_plans = await knex(`${data_table}`)
        .select('*', knex.raw(`CONCAT(',', room_nos, ',') as rooms`))
        .havingRaw(`rooms LIKE '${old_room_no}' `)
        .where({
          bed_type: user_dtl[0].bed_type,
        });

        console.log('old_get_plans',old_get_plans);

      if (new_room_plan_details.length > 0) {
        return res.json({
          status: 200,
          new_room_plan_details: new_room_plan_details,
          old_room_plans_details: old_get_plans,
          //student_plan: student_plan,
        });
      } else {
        return res.json({
          status: 401,
          message: "No plan found for this room",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/edit_room_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.bed_type == undefined || req.body.bed_type == "") {
      return res.json({
        status: 401,
        message: "Please select bed type ",
      });
    } else if (req.body.room_no == undefined || req.body.room_no == "") {
      return res.json({
        status: 401,
        message: "Please select room ",
      });
    } else if (req.body.plan_type == undefined || req.body.plan_type == "" ) {
      return res.json({
        status: 401,
        message: "Please enter plan type ",
      });
    }else if (req.body.plan_type == "postpaid" || req.body.plan_type == "prepaid") {
      return res.json({
        status: 401,
        message: "Apart From Lateral no other option will be avaiable for Edit",
      });
    }else if (req.body.room_month_change == undefined || req.body.room_month_change == "") {
      return res.json({
        status: 401,
        message: "Please enter Month ",
      });
    }else if (req.body.plan_id < 5 && (req.body.normal_start_date > req.body.normal_end_date) ) {
      return res.json({
        status: 401,
        message: "Please enter Correct date Range ",
      });
    }else if (req.body.plan_id == 5 && (req.body.lateral_start_date > req.body.lateral_end_date) ) {
      return res.json({
        status: 401,
        message: "Please enter Correct date Range ",
      });
    } else if (req.body.to_pay == undefined) {
      return res.json({
        status: 401,
        message: "Please enter amount to pay ",
      });
    } else {


      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);


      var check_user = await knex("student_plan")
      .where("student_id", "=", req.body.student_id)
      .where("paid", "!=", 'Yes')
      .orderBy("id", "desc").limit(1);


      if (check_user.length > 0) {
        return res.json({
          status: 401,
          message: "Student hasn't paid for the previous plan yet ",
        });
      } else {

        let total_vacant = 0;
        let new_total_vacant = 0;
      

        //OLD room update
        let get_student_old_room = await knex("student_details")
          .select("id", "room_id", "bed_type")
          .where({
            id: req.body.student_id,
            status: 1,
            is_approved: 1,
        });

    
        let leave_old_room = await knex("room_occupancy")
          .where({
            student_id: req.body.student_id,
            status: 1,
          })
          .update({
            status: 2,
            updated_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          });


          let get_old_room_occopuied = await knex("room_occupancy").where({
            room_number: get_student_old_room[0].room_id,
            status: 1,
          });


          let get_old_room_details = await knex("room").where({
            id: req.body.room_no,
          });

        
          if(get_old_room_occopuied.length>0){

              total_vacant = get_old_room_details[0].total_occupancy - get_old_room_occopuied.length;
          }else{
              total_vacant = get_old_room_details[0].total_occupancy;

          }
          
          var update_old_room = await knex("room")
          .where({ id: get_student_old_room[0].room_id })
          .update({
            vaccancy: total_vacant,
            updated_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          });


            //New room update

            await knex("room_occupancy").insert([
              {
                room_number: req.body.room_no,
                student_id: req.body.student_id,
                status: 1,
                created_at: moment()
                  .utcOffset("+05:30")
                  .format("YYYY-MM-DD HH:mm:ss"),
              },
            ]);
  
  
            let get_new_room_data = await knex("room_occupancy").where({
              room_number: req.body.room_no,
              status: 1,
            });
       
            let new_room_details = await knex("room").where({
              id: req.body.room_no,
            });
  
          if(get_new_room_data.length>0){
  
            new_total_vacant = new_room_details[0].total_occupancy - get_new_room_data.length;
          }else{
            new_total_vacant = new_room_details[0].total_occupancy - 1;
    
          }
  
          var final_room_update = await knex("room")
            .where({ id: req.body.room_no })
            .update({
              vaccancy: new_total_vacant,
            });
  
          let update_student_room = await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              bed_type: req.body.bed_type == "Lower Berth" ? "lb" : "ub",
              room_id: req.body.room_no,
              building_name: new_room_details[0].building_name,
              toilet_type: new_room_details[0].toilet_type,
              occupancy: new_room_details[0].occupancy,
              room_type: new_room_details[0].room_type,
              updated_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
            });
         

       
          if((req.body.to_pay)>0){
            var update_plan = await knex("student_plan").insert([
             {
               student_id: req.body.student_id,
               plan_id: req.body.plan_id,
               term: req.body.term,
               plan_type: req.body.plan_type,
               room_rent: req.body.room_rent,
               to_pay: req.body.to_pay,
               total: req.body.to_pay,
               room_no: req.body.room_no,
               bed_type: req.body.bed_type == "Lower Berth" ? "lb" : "ub",
               edit_plan_type:"Room change",
               //monthly: (req.body.monthly) ? moment(req.body.monthly, 'MM').format('MMMM') : 0,
               normal_start_date:  (req.body.plan_id < 5) ?  moment(req.body.normal_start_date).format('YYYY-MM-DD') : null,
               normal_end_date:  (req.body.plan_id < 5) ?  moment(req.body.normal_end_date).format('YYYY-MM-DD') : null,
               lateral_start_date:  (req.body.plan_type=='lateral') ?  moment(req.body.lateral_start_date).format('YYYY-MM-DD') : null,
               lateral_end_date:  (req.body.plan_type=='lateral') ?  moment(req.body.lateral_end_date).format('YYYY-MM-DD') : null,
              
              
               created_at: moment()
                 .utcOffset("+05:30")
                 .format("YYYY-MM-DD HH:mm:ss"),
               status: 1,
               //paid: req.body.to_pay > 0 ? null : "Yes",
               paid: "No",
             },
           ]);

          }


          let get_student_details = await knex("student_details").where({
            id: req.body.student_id,
          });

          if (get_student_details.length > 0) {
            sentMailTo(
              get_student_details[0].StudEmail,
              "New Room Allotted",
              "Dear Ms. " +
                get_student_details[0].SFname +
                " Greetings!\n\n" +
                `This is to inform you that a new room has been alloted to you. Room No: ${new_room_details[0].room_number} (${req.body.bed_type}).\n\n ` +
                "Thanking you.\n\n" +
                "With Regards,\n" +
                "RM Hostel Team"
            );

            sentSms({
              phone_number: get_student_details[0].SmobNo,
              msg:
                "Dear Ms. " +
                get_student_details[0].SFname +
                `,, This is to inform you that a new room has been alloted to you. Room No: ${new_room_details[0].room_number} (${req.body.bed_type}).`,
            });
            
            return res.json({
              status: 200,
              message: "Room updated succesfully for the student",
            });
          }

      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/meal_change", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.meal_preferance == undefined || req.body.meal_preferance == "") {
      return res.json({
        status: 401,
        message: "Please select food preferance",
      });
    } else {

      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);


      var student_plan =   await knex("student_plan")
      .select(`*`)
      .columns(knex.raw("student_plan.room_rent as oldRoomrent"))
      .columns(knex.raw("student_plan.meal_t1 + student_plan.meal_t2 + student_plan.monthly_mess_fee as meal"))
      .where({
        student_id: req.body.student_id,
        status: 1,  
       })
       .having(knex.raw("meal"), ">", 0)
       .orderBy("student_plan.id", "desc")
       .limit(1);


      if (student_plan.length == 0) {

          return res.json({
            status: 401,
            message: "No plan found for this student",
          });

      } else {

        var new_get_meals = "";
        var get_old_meals = "";

        if(student_plan[0].plan_id==1){

          new_get_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${req.body.meal_preferance}`)
          .andWhere(builder => {
            builder.where('term', '=', '1').orWhere('term', '=', '2');
          })
          .orderBy('id', 'desc');


          get_old_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${user_dtl[0].food_preference}`)
          .andWhere(builder => {
            builder.where('term', '=', '1').orWhere('term', '=', '2');
          })
          .orderBy('id', 'desc');

  
        } else if(student_plan[0].plan_id==2){

          new_get_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${req.body.meal_preferance}`)
          .andWhere('term', '=', '1')
          .orderBy('id', 'desc');

          get_old_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${user_dtl[0].food_preference}`)
          .andWhere('term', '=', '1')
          .orderBy('id', 'desc');

        }else if(student_plan[0].plan_id==3){

          new_get_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${req.body.meal_preferance}`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');

          get_old_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${user_dtl[0].food_preference}`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');

        }else if(student_plan[0].plan_id==4){

          new_get_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${req.body.meal_preferance}`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');


          get_old_meals = await knex("packages_price")
          .sum('price as mealPrice')
          .where('package', 'like', `${user_dtl[0].food_preference}`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');


        }else{

           new_get_meals = await knex("packages_price")
            .sum('price as mealPrice')
            .where('package', 'like', `${req.body.meal_preferance}`)
            .andWhere(builder => {
              builder.where('term', '=', '1').orWhere('term', '=', '2');
            })
            .orderBy('id', 'desc');

            get_old_meals = await knex("packages_price")
            .sum('price as mealPrice')
            .where('package', 'like', `${user_dtl[0].food_preference}`)
            .andWhere(builder => {
              builder.where('term', '=', '1').orWhere('term', '=', '2');
            })
            .orderBy('id', 'desc');

        }
        
        return res.json({
          status: 200,
          new_get_meals: new_get_meals,
          old_meal_fees: get_old_meals,
          message: "List fetched",
        });

      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.post("/edit_meal_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.meal_type == undefined || req.body.meal_type == "") {
      return res.json({
        status: 401,
        message: "Please select meal type ",
      });
    } else if (req.body.plan_type == undefined || req.body.plan_type == "") {
      return res.json({
        status: 401,
        message: "Please enter plan type ",
      });
    }else if (req.body.plan_type == "postpaid" || req.body.plan_type == "prepaid") {
      return res.json({
        status: 401,
        message: "Apart From Lateral no other option will be avaiable for Edit",
      });
    }else if (req.body.meal_month_change == undefined || req.body.meal_month_change == "") {
      return res.json({
        status: 401,
        message: "Please enter Month ",
      });
    }else if (req.body.plan_id < 5 && (req.body.normal_start_date > req.body.normal_end_date) ) {
      return res.json({
        status: 401,
        message: "Please enter Correct date Range ",
      });
    }else if (req.body.plan_id == 5 && (req.body.lateral_start_date > req.body.lateral_end_date) ) {
      return res.json({
        status: 401,
        message: "Please enter Correct date Range ",
      });
    } else if (req.body.to_pay == undefined || req.body.to_pay < 0) {
      return res.json({
        status: 401,
        message: "Please enter amount to pay ",
      });
    } else {

      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);


      var check_user = await knex("student_plan")
      .where("student_id", "=", req.body.student_id)
      .where("paid", "!=", 'Yes')
      .orderBy("id", "desc").limit(1);



      if (check_user.length > 0) {
        return res.json({
          status: 401,
          message: "Student hasn't paid for the previous plan yet ",
        });
      } else {
        

        if( (req.body.to_pay)>0){
          var update_plan   = await knex("student_plan").insert([
            {
              student_id: req.body.student_id,
              plan_id: req.body.plan_id,
              plan_type: req.body.plan_type,
              monthly_mess_fee: req.body.monthly_mess_fee,
              to_pay: req.body.to_pay,
              total: req.body.to_pay,
              meal_type: req.body.meal_type,
              term: req.body.term,
              edit_plan_type:"Meal change",
              normal_start_date:  (req.body.plan_id < 5) ?  moment(req.body.normal_start_date).format('YYYY-MM-DD') : null,
              normal_end_date:  (req.body.plan_id < 5) ?  moment(req.body.normal_end_date).format('YYYY-MM-DD') : null,
              lateral_start_date:  (req.body.plan_type=='lateral') ?  moment(req.body.lateral_start_date).format('YYYY-MM-DD') : null,
              lateral_end_date:  (req.body.plan_type=='lateral') ?  moment(req.body.lateral_end_date).format('YYYY-MM-DD') : null,
             // monthly: (req.body.monthly) ? moment(req.body.monthly, 'MM').format('MMMM') : 0,
              created_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
              status: 1,
              //paid: req.body.to_pay > 0 ? null : "Yes",
              paid: "No",
            },
          ]);
        }



        let get_student_details = await knex("student_details").where({
          id: req.body.student_id,
        });
        let update_student = await knex("student_details")
          .where({ id: req.body.student_id })
          .update({
            food_preference: req.body.meal_type,
            updated_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          });




        if (get_student_details.length > 0) {
         
          let update_student = await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              food_preference: req.body.meal_type,
              updated_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
            });

          if (get_student_details.length > 0) {
            sentMailTo(
              get_student_details[0].StudEmail,
              "New Meal Plan Set",
              "Dear Ms. " +
                get_student_details[0].SFname +
                " Greetings!\n\n" +
                "This is to inform you that a new meal plan has been set for you.\n\n " +
                "Thanking you.\n\n" +
                "With Regards,\n" +
                "RM Hostel Team"
            );

            sentSms({
              phone_number: get_student_details[0].SmobNo,
              msg:
                "Dear Ms. " +
                get_student_details[0].SFname +
                ",, This is to inform you that a new meal plan has been set for you.",
            });
            return res.json({
              status: 200,
              message: "Meal Plan updated succesfully for the student",
            });
          }
        }
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/parking_change", async (req, res) => {

  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.parking_type == undefined || req.body.parking_type == "") {
      return res.json({
        status: 401,
        message: "Please select Parking Type",
      });
    } else {

      var user_dtl = await knex("student_details")
      .select('student_details.id','student_details.SFname','student_details.SmobNo','student_details.StudEmail','student_details.food_preference','student_details.parking_type','student_details.plan_id','student_details.parking','student_details.transportation','room.room_number as room_id')
      .leftJoin('room', 'student_details.room_id', 'room.id')
      .where("student_details.id", req.body.student_id)
      .limit(1);


     

      if (student_plan.length == 0) {

          return res.json({
            status: 401,
            message: "No plan found for this student",
          });

      } else {

        if(student_plan[0].plan_id==1){

          var get_parking = await knex("packages_price")
          .sum('price as parkingPrice')
          .where('package', 'like', `%${req.body.parking_type}%`)
          .andWhere(builder => {
            builder.where('term', '=', '1').orWhere('term', '=', '2');
          })
          .orderBy('id', 'desc');

        } else if(student_plan[0].plan_id==2){

          var get_parking = await knex("packages_price")
          .sum('price as parkingPrice')
          .where('package', 'like', `%${req.body.parking_type}%`)
          .andWhere('term', '=', '1')
          .orderBy('id', 'desc');

        }else if(student_plan[0].plan_id==3){

          var get_parking = await knex("packages_price")
          .sum('price as parkingPrice')
          .where('package', 'like', `%${req.body.parking_type}%`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');

        }else if(student_plan[0].plan_id==4){

          var get_parking = await knex("packages_price")
          .sum('price as parkingPrice')
          .where('package', 'like', `%${req.body.parking_type}%`)
          .andWhere('term', '=', '2')
          .orderBy('id', 'desc');

        }else{

            var get_parking =  await knex("student_plan")
            .select(`*`)
            .columns(knex.raw("student_plan.parking as parkingPrice"))
            .where("student_plan.plan_id","=", 5)
            .where({
              student_id: req.body.student_id,
              status: 1
            })
            .andWhere("student_plan.plan_id","!=",'postpaid')
            .andWhere("student_plan.plan_id","!=", 'prepaid')
            .orderBy("id", "desc").limit(1);

        }
        
        return res.json({
          status: 200,
          parking_data: get_parking,
          message: "List fetched",
        });

      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



router.post("/edit_parking_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    }  else if (req.body.parking == undefined || req.body.parking == "") {
      return res.json({
        status: 401,
        message: "Please select parking",
      });
    }  else {

      let get_student_details = await knex("student_details").where({
        id: req.body.student_id,
      });

    
        var bulding_details = await knex("building")
        .where('building_name', 'like', `%${get_student_details[0].building_name}%`)
        .orderBy('id', 'desc');


        if (req.body.parking == "Yes") {
            
          var isParkingExists = await knex("parking_slot")
          .where({
            is_alloted: 1,
            student_id: req.body.student_id,
          })
          .limit(1);



          if (isParkingExists.length == 1){

            await knex("parking_slot").where({ student_id: req.body.student_id }).update({
              is_alloted: 1,
              student_id: req.body.student_id,
            });

           await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              parking_id: isParkingExists[0].id,
              parking: req.body.parking,
              parking_type: req.body.parking_type
            });

          }else{
            var enterParkingslot = await knex('parking_slot').insert([
              {
                  parking_id: bulding_details[0].id,
                  parking_name: get_student_details[0].building_name,
                  student_id: req.body.student_id,
                  is_alloted: 1,
                  status: 1,
                  created_at: new Date(),
                  updated_at: new Date()
              }
            ]);

            await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              parking_id: enterParkingslot[0],
              parking: req.body.parking,
              parking_type: req.body.parking_type
            });
          }
        
        }else{

          await knex("parking_slot").where({ student_id: req.body.student_id }).update({
            is_alloted: 0,
            student_id: req.body.student_id,
          });

           await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              parking_id: 0,
              parking: 'No',
              parking_type: null
            });

        }


        
        if (get_student_details.length > 0) {

          sentMailTo(
            get_student_details[0].StudEmail,
            "New Meal Plan Set",
            "Dear Ms. " +
              get_student_details[0].SFname +
              " Greetings!\n\n" +
              "This is to inform you that a new meal plan has been set for you.\n\n " +
              "Thanking you.\n\n" +
              "With Regards,\n" +
              "RM Hostel Team"
          );

          sentSms({
            phone_number: get_student_details[0].SmobNo,
            msg:
              "Dear Ms. " +
              get_student_details[0].SFname +
              ",, This is to inform you that a new meal plan has been set for you.",
          });

          return res.json({
            status: 200,
            message: "Parking Plan updated succesfully for the student",
          });
        }

    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});


router.post("/edit_transport_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    }  else if (req.body.transportation == undefined || req.body.transportation == "") {
      return res.json({
        status: 401,
        message: "Please select transportation",
      });
    } else {
      

        let get_student_details = await knex("student_details").where({
          id: req.body.student_id,
        });
        let update_student = await knex("student_details")
          .where({ id: req.body.student_id })
          .update({
            transportation: req.body.transportation,
            updated_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          });

        if (get_student_details.length > 0) {

            sentMailTo(
              get_student_details[0].StudEmail,
              "New Meal Plan Set",
              "Dear Ms. " +
                get_student_details[0].SFname +
                " Greetings!\n\n" +
                "This is to inform you that a new meal plan has been set for you.\n\n " +
                "Thanking you.\n\n" +
                "With Regards,\n" +
                "RM Hostel Team"
            );

            sentSms({
              phone_number: get_student_details[0].SmobNo,
              msg:
                "Dear Ms. " +
                get_student_details[0].SFname +
                ",, This is to inform you that a new meal plan has been set for you.",
            });


          return res.json({
            status: 200,
            message: "Parking Plan updated succesfully for the student",
          });
        }
      
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});



router.post("/edit_term", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.term == undefined || req.body.term == "") {
      return res.json({
        status: 401,
        message: "Please select term",
      });
    } else if (req.body.meal == undefined || req.body.meal == "") {
      return res.json({
        status: 401,
        message: "Please select meal",
      });
    } else {
      var get_meal_term = await knex("packages_price")
        .select("*")
        .whereIn("package ", [req.body.meal])
        .where({ term: req.body.term });

      var get_laundry_term = await knex("packages_price")
        .select("*")
        .where({ term: req.body.term, package: "Laundary" });
      let obj = {
        meal_plan: get_meal_term,
        laundry_plan: get_laundry_term,
      };
      return res.json({
        status: 200,
        result: obj,
      });
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.post("/edit_term_plan", async (req, res) => {
  try {
    if (req.body.student_id == undefined || req.body.student_id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else if (req.body.meal_type == undefined || req.body.meal_type == "") {
      return res.json({
        status: 401,
        message: "Please select meal type ",
      });
    } else if (req.body.plan_type == undefined || req.body.plan_type == "") {
      return res.json({
        status: 401,
        message: "Please enter plan type ",
      });
    } else if (req.body.to_pay == undefined || req.body.to_pay == "") {
      return res.json({
        status: 401,
        message: "Please enter amount to pay ",
      });
    } else if (req.body.meal_price == undefined || req.body.meal_price == "") {
      return res.json({
        status: 401,
        message: "Please enter meal price ",
      });
    } else if (
      req.body.laundry_price == undefined ||
      req.body.laundry_price == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter laundry price ",
      });
    } else if (req.body.term == undefined || req.body.term == "") {
      return res.json({
        status: 401,
        message: "Please enter term ",
      });
    } else {
      var check_user = await knex("student_plan").where({
        student_id: req.body.student_id,
        paid: null,
      });
      if (check_user.length > 0) {
        return res.json({
          status: 401,
          message: "Student hasn't paid for the previous plan yet ",
        });
      }
      var check_user_term = await knex("student_details").where({
        id: req.body.student_id,
        term: req.body.term,
      });

      if (check_user_term.length > 0) {
        return res.json({
          status: 401,
          message: "Student is already in this term",
        });
      } else {
        //   return
        var update_plan = await knex("student_plan").insert([
          {
            student_id: req.body.student_id,
            plan_type: req.body.plan_type,
            to_pay: req.body.to_pay,
            total: req.body.to_pay,
            meal_type: req.body.meal_type,
            status: 1,
            laundry: req.body.laundry_price,
            meal: req.body.meal_price,
            created_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          },
        ]);
        if (update_plan.length > 0) {
          let get_student_details = await knex("student_details").where({
            id: req.body.student_id,
          });
          let update_student = await knex("student_details")
            .where({ id: req.body.student_id })
            .update({
              food_preference: req.body.meal_type,
              term: req.body.term,
              updated_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
            });

          if (get_student_details.length > 0) {
            sentMailTo(
              get_student_details[0].StudEmail,
              "New Term Set",
              "Dear Ms. " +
                get_student_details[0].SFname +
                " Greetings!\n\n" +
                "This is to inform you that a new term plan has been set for you. Please log into the app and kindly pay for it.\n\n " +
                "Thanking you.\n\n" +
                "With Regards,\n" +
                "RM Hostel Team"
            );

            sentSms({
              phone_number: get_student_details[0].SmobNo,
              msg:
                "Dear Ms. " +
                get_student_details[0].SFname +
                ",, This is to inform you that a new term plan has been set for you. Please log into the app and kindly pay for it.",
            });
            return res.json({
              status: 200,
              message: "Term Plan updated succesfully for the student",
            });
          }
        } else {
          return res.json({
            status: 401,
            message: "Failed to update term",
          });
        }
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.post("/edit_monthly_plan", async (req, res) => {
  try {
    if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter student id",
      });
    } else {
      const total_bill = (
        Number(req.body.monthly_four_wheeler_parking_fee) +
        Number(req.body.monthly_two_wheeler_parking_fee) +
        Number(req.body.monthly_water_bill) +
        Number(req.body.monthly_electricity_bill) +
        Number(req.body.monthly_mess_fee) +
        Number(req.body.monthly_laundry_fee) +
        Number(req.body.monthly_room_rent) +
        Number(req.body.monthly_admission_fee) +
        Number(req.body.monthly_other_fees) +
        Number(req.body.monthly_transportation_fee)
      ).toFixed(2);
        console.log("monthly_four_wheeler_parking_fee", Number(req.body.monthly_four_wheeler_parking_fee))
        console.log("monthly_two_wheeler_parking_fee", Number(req.body.monthly_two_wheeler_parking_fee))
        console.log("monthly_water_bill", Number(req.body.monthly_water_bill))
        console.log("monthly_electricity_bill", Number(req.body.monthly_electricity_bill))
        console.log("monthly_mess_fee", Number(req.body.monthly_mess_fee))
        console.log("monthly_laundry_fee", Number(req.body.monthly_laundry_fee))
        console.log("monthly_room_rent", Number(req.body.monthly_room_rent))
        console.log("monthly_admission_fee", Number(req.body.monthly_admission_fee))
        console.log("monthly_other_fees", Number(req.body.monthly_other_fees))
        console.log("monthly_transportation_fee", Number(req.body.monthly_transportation_fee))



      if (total_bill <= 0) {
        return res.json({
          status: 401,
          message: "Please enter at least one value in these fields" + total_bill ,
        });
      }

      const studentParams = {
        monthly_transportation_fee: req.body.monthly_transportation_fee
          ? req.body.monthly_transportation_fee
          : 0,
        monthly_four_wheeler_parking_fee: req.body
          .monthly_four_wheeler_parking_fee
          ? req.body.monthly_four_wheeler_parking_fee
          : 0,
        monthly_two_wheeler_parking_fee: req.body
          .monthly_two_wheeler_parking_fee
          ? req.body.monthly_two_wheeler_parking_fee
          : 0,
        monthly_water_bill: req.body.monthly_water_bill
          ? req.body.monthly_water_bill
          : 0,
        monthly_electricity_bill: req.body.monthly_electricity_bill
          ? req.body.monthly_electricity_bill
          : 0,
        monthly_mess_fee: req.body.monthly_mess_fee
          ? req.body.monthly_mess_fee
          : 0,
        monthly_laundry_fee: req.body.monthly_laundry_fee
          ? req.body.monthly_laundry_fee
          : 0,
        monthly_room_rent: req.body.monthly_room_rent
          ? req.body.monthly_room_rent
          : 0,
        monthly_admission_fee: req.body.monthly_admission_fee
          ? req.body.monthly_admission_fee
          : 0,
        monthly_other_fees: req.body.monthly_other_fees
          ? req.body.monthly_other_fees
          : 0,
        monthly_other_fees_remark: req.body.monthly_other_fees_remark,
        total: total_bill,
        total_one_time: total_bill,
        to_pay: total_bill,
      };
      var update_data = await knex("student_plan")
        .where({ id: req.body.id })
        .update(studentParams);

      if (update_data) {
          sentMailTo(
            req.body.StudEmail,
            "Successful Plan Set",
            "Dear Ms. " +
              req.body.SFname +
              " Greetings!\n\n" +
              "This is to inform you that a subscription plan has been updated for you.Please log into the app and kindly pay for it.\n\n " +
              "Thanking you.\n\n" +
              "With Regards,\n" +
              "RM Hostel Team"
          );
        
          // sentSms({
          //   phone_number: req.body.SmobNo,
          //   msg:
          //     "Dear Ms. " +
          //     req.body.SFname +
          //     ",, This is to inform you that a subscription plan has been updated for you.Please log into the app and kindly pay for it.",
          // });
        return res.json({
          status: 200,
          message: "Plan updated  successfully for the student",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to add plan",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.get("/get_package", async (req, res) => {
  try {
    var get_plans = await knex("packages_price")
      .select(["description", "package", "order_by"])
      .where("description", "!=", "");
    const plan_sort = get_plans.sort(
      (a, b) => parseFloat(a.order_by) - parseFloat(b.order_by)
    );
    const groupedMap = plan_sort.filter(
      (v, i, a) => a.findLastIndex((v2) => v2.order_by === v.order_by) === i
    );
    return res.json({
      status: 200,
      package_data: groupedMap,
      message: "packages list fetched",
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});
module.exports = router;
