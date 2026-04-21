/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
const { sentMailTo } = require("../../module/mail");
const sentSms = require("../../module/sent_sms");
var moment = require("moment");

router.get("/:id", async (req, res) => {
  try {
    var isStudentidExists = await knex("student_details")
      .where({
        id: req.params.id,
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
    // req.body.bed_type = isStudentidExists[0].bed_type;
    req.body.occupancy = isStudentidExists[0].occupancy;
    req.body.toilet_type = isStudentidExists[0].toilet_type;
    var buildingName;
    var parkingId;

    if (req.body.parking == "Yes") {
      var isParkingExists = await knex("parking_slot")
        .where({
          Is_alloted: 0,
        })
        .orderByRaw("rand()")
        .limit(1);
      if (isParkingExists.length == 1) {
        parkingId = isParkingExists[0].id;
        buildingName = isParkingExists[0].parking_name;
      } else {
        return res.json({
          status: 401,
          message: "No parking slot available",
        });
      }
    }

    let vaccancy = 0;
    if (req.body.occupancy == "2 in 1") {
      vaccancy = 2;
    } else if (req.body.occupancy == "3 in 1") {
      vaccancy = 3;
    } else if (req.body.occupancy == "4 in 1") {
      vaccancy = 4;
    } else if (req.body.occupancy == "5 in 1") {
      vaccancy = 5;
    } else if (req.body.occupancy == "6 in 1") {
      vaccancy = 6;
    } else if (req.body.occupancy == "7 in 1") {
      vaccancy = 7;
    }

    var randomRoom = await knex("room")
      .where({
        //  Is_alloted: 0,
        room_type: req.body.room_type,
        // bed_type: req.body.bed_type,
        occupancy: req.body.occupancy,
        //  vaccancy: >0,
        toilet_type: req.body.toilet_type,
        status: 1,
      })
      .whereNot('vaccancy', '=', knex.ref('total_occupancy'))
      .orderByRaw("rand()")
      .limit(1);

    // var randomRoom = await knex("room")
    //   .where({
    //     Is_alloted: 0,
    //     room_type: req.body.room_type,
    //     // bed_type: req.body.bed_type,
    //     occupancy: req.body.occupancy,
    //     toilet_type: req.body.toilet_type,
    //     status: 1,
    //   })
    //   .orderByRaw("rand()")
    //   .limit(1);

    if (randomRoom.length == 0) {
      return res.json({
        status: 401,
        message: "No room available",
      });
    } else {
      var isSaveData = await knex("student_details")
        .where({ id: req.params.id })
        .update({
          room_id: randomRoom[0].room_number,
          building_name: randomRoom[0].building_name,
          parking_name: buildingName,
          parking_id: parkingId,
          academic_year: req.body.academic_year,
          is_approved: 1,
          status: 1,
          updated_at: new Date(),
        });

      await knex("room_occupancy").insert([
        {
          room_number: randomRoom[0].room_number,
          student_id: req.params.id,
          status: 1,
          created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      var get_room_data = await knex("room_occupancy").where({
        room_number: randomRoom[0].room_number,
        student_id: req.params.id,
        status: 1,
      });

      await knex("room")
        .where({ room_number: randomRoom[0].room_number })
        .update({
          vaccancy: randomRoom[0].vaccancy - get_room_data.length,
          //    student_id: req.params.id,
        });
      // return;
      // await knex("room").where({ id: randomRoom[0].id }).update({
      //   Is_alloted: 1,
      //   student_id: req.params.id,
      // });
      if (req.body.parking == "Yes") {
        await knex("parking_slot").where({ id: parkingId }).update({
          Is_alloted: 1,
          student_id: req.params.id,
        });
      }

      sentMailTo(
        isStudentidExists[0].StudEmail,
        "Room allotment",
        "Dear Ms. " +
          isStudentidExists[0].SFname +
          " Greetings!\n\n" +
          "Based on the availability and room preference, we are pleased to inform you of your room number: " +
          randomRoom[0].room_number +
          " (" +
          isStudentidExists[0].occupancy +
          "," +
          isStudentidExists[0].room_type +
          "," +
          isStudentidExists[0].toilet_type +
          ") is allocated to you for the AY 2023-2024. Wishing you a pleasant stay at Chettinad Rani Meyyammai Hostel.\n\n" +
          "<a href='https://play.google.com/store/apps/details?id=com.ranimeyyamiahostel.ranimeyyamiahostel'>Download APP</a> \n\n"+
          "Thanking you.\n\n" +
          "With Regards,\n" +
          "RM Hostel Team"
      );
      // Dear Ms. name,, Based on the availability and room preference, we are pleased to inform you of your room number: roomno,building, is allocated to you for the AY regdno,. Wishing you a pleasant stay at RMH. - RMHostel
      sentSms({
        phone_number: isStudentidExists[0].SmobNo,
        msg:
          "Dear Ms. " +
          isStudentidExists[0].SFname +
          ",, Based on the availability and room preference, we are pleased to inform you of your room number: " +
          randomRoom[0].room_number +
          "," +
          randomRoom[0].building_name.substring(0, 10) +
          ", is allocated to you for the AY 2023-24,. Wishing you a pleasant stay at RMH. - RMHostel",
      });
      return res.json({
        status: 201,
        message: "Room allocated successfully",
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


router.post("/assign_room", async (req, res) => {
  if (req.body.student_id == undefined || req.body.student_id == "") {
    return res.json({
      status: 401,
      message: "Please enter student id",
    });
  }

  if (req.body.room_no == undefined || req.body.room_no == "") {
    return res.json({
      status: 401,
      message: "Please enter room no",
    });
  }

  try {
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
    var buildingName;
    var parkingId;

    if (req.body.parking == "Yes") {
      var isParkingExists = await knex("parking_slot")
        .where({
          Is_alloted: 0,
        })
        .orderByRaw("rand()")
        .limit(1);
      if (isParkingExists.length == 1) {
        parkingId = isParkingExists[0].id;
        buildingName = isParkingExists[0].parking_name;
      } else {
        return res.json({
          status: 401,
          message: "No parking slot available",
        });
      }
    }

    let vaccancy = 0;
    if (req.body.occupancy == "2 in 1") {
      vaccancy = 2;
    } else if (req.body.occupancy == "3 in 1") {
      vaccancy = 3;
    } else if (req.body.occupancy == "4 in 1") {
      vaccancy = 4;
    } else if (req.body.occupancy == "5 in 1") {
      vaccancy = 5;
    } else if (req.body.occupancy == "6 in 1") {
      vaccancy = 6;
    } else if (req.body.occupancy == "7 in 1") {
      vaccancy = 7;
    }

    var randomRoom = await knex("room")
      .where({
        room_number: req.body.room_no,
        room_type: req.body.room_type,
        occupancy: req.body.occupancy,
        toilet_type: req.body.toilet_type,
        status: 1,
      })
      .whereNot('vaccancy', '=', knex.ref('total_occupancy'))
      .limit(1);

    if (randomRoom.length == 0) {
      return res.json({
        status: 401,
        message: "No room available",
      });
    } else {
      var isSaveData = await knex("student_details")
        .where({ id: req.body.student_id })
        .update({
          room_id: randomRoom[0].room_number,
          building_name: randomRoom[0].building_name,
          parking_name: buildingName,
          parking_id: parkingId,
          academic_year: req.body.academic_year,
          is_approved: 1,
          status: 1,
          updated_at: new Date(),
        });

      await knex("room_occupancy").insert([
        {
          room_number: randomRoom[0].room_number,
          student_id: req.body.student_id,
          status: 1,
          created_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
      var get_room_data = await knex("room_occupancy").where({
        room_number: randomRoom[0].room_number,
        student_id: req.body.student_id,
        status: 1,
      });

      await knex("room")
        .where({ room_number: randomRoom[0].room_number })
        .update({
          vaccancy: randomRoom[0].vaccancy - get_room_data.length,
        });
      
      if (req.body.parking == "Yes") {
        await knex("parking_slot").where({ id: parkingId }).update({
          Is_alloted: 1,
          student_id: req.body.student_id,
        });
      }

      sentMailTo(
        isStudentidExists[0].StudEmail,
        "Room allotment",
        "Dear Ms. " +
          isStudentidExists[0].SFname +
          " Greetings!\n\n" +
          "Based on the availability and room preference, we are pleased to inform you of your room number: " +
          randomRoom[0].room_number +
          " (" +
          isStudentidExists[0].occupancy +
          "," +
          isStudentidExists[0].room_type +
          "," +
          isStudentidExists[0].toilet_type +
          ") is allocated to you for the AY 2023-2024. Wishing you a pleasant stay at Chettinad Rani Meyyammai Hostel.\n\n" +
          "<a href='https://play.google.com/store/apps/details?id=com.ranimeyyamiahostel.ranimeyyamiahostel'>Download APP</a> \n\n" +
          "Thanking you.\n\n" +
          "With Regards,\n" +
          "RM Hostel Team"
      );
      // Dear Ms. name,, Based on the availability and room preference, we are pleased to inform you of your room number: roomno,building, is allocated to you for the AY regdno,. Wishing you a pleasant stay at RMH. - RMHostel
      sentSms({
        phone_number: isStudentidExists[0].SmobNo,
        msg:
          "Dear Ms. " +
          isStudentidExists[0].SFname +
          ",, Based on the availability and room preference, we are pleased to inform you of your room number: " +
          randomRoom[0].room_number +
          "," +
          randomRoom[0].building_name.substring(0, 10) +
          ", is allocated to you for the AY 2023-24,. Wishing you a pleasant stay at RMH. - RMHostel",
      });
      return res.json({
        status: 201,
        message: "Room allocated successfully",
      });
    }
  } catch (error) {
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
   

    var isStudentidExists = await knex("student_details")
      .where({
        id: req.params.id,
      })
      .limit(1);

    if (isStudentidExists.length == 0) {
      return res.json({
        status: 401,
        message: "Student id is not exists",
      });
    }

    var isSaveData = await knex("student_details")
      .where({ id: req.params.id })
      .update({
        is_approved: 2,
        status: 2,
        reject_reason: req.body.reason,
        updated_at: new Date(),
      });

    return res.json({
      status: 201,
      message: "Rejected successfully",
    });
  } catch (error) {
    // console.log(ok);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

router.put("/deactivate/:id", async (req, res) => {
  try {
    var isStudentidExists = await knex("student_details")
      .where({
        id: req.params.id,
        status: 1,
        is_approved: 1,
      })
      .limit(1);

    if (isStudentidExists.length == 0) {
      return res.json({
        status: 401,
        message: "Student id is not exists",
      });
    } else {
      let leave_room = await knex("room_occupancy")
        .where({
          student_id: req.params.id,
          status: 1,
        })
        .update({
          status: 0,
          updated_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        });

      var get_room_data = await knex("room_occupancy").where({
        room_number: isStudentidExists[0].room_id,
        status: 1,
      });

      var get_room_details = await knex("room")
        .select("total_occupancy")
        .where({
          room_number: isStudentidExists[0].room_id,
        });
      var update_room = await knex("room")
        .where({ room_number: isStudentidExists[0].room_id })
        .update({
          vaccancy: get_room_details[0].total_occupancy - get_room_data.length,
        });

      let deactivate_student_details = await knex("student_details")
        .where({ id: req.params.id })
        .update({
          is_approved: 3,
          status: 3,
          deactive_reason: req.body.reason,
          // room_id: null,
          // building_name: null,
          // parking_id: null,
          // parking_name: null,
          updated_at: moment()
            .utcOffset("+05:30")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      let deactivate_parking = await knex("parking_slot")
        .where({ student_id: req.params.id })
        .update({
          Is_alloted: 0,
          student_id: null,
          updated_at: new Date(),
        });
    }
    return res.json({
      status: 201,
      message: "Student Deactivated successfully",
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
