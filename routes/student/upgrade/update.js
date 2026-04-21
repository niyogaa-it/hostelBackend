const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
const { sentMailTo } = require("../../../module/mail");
const sentSms = require("../../../module/sent_sms");

router.post("/", async (req, res) => {
  try {
    // console.log(req.headers);
    if (req.body.id == undefined || req.body.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    }
    // var getData = await knex("help_quries").where({
    //   id: req.body.id,
    // });
    if (req.body.status == 2) {
      var data = await knex("upgrade_request").where({
        id: req.body.id,
      });
      console.log(data);
      if (data[0].request_type == "Room") {
        var isStudentidExists = await knex("student_details")
          .where({
            id: data[0].student_id,
          })
          .limit(1);

        if (isStudentidExists.length == 0) {
          return res.json({
            status: 401,
            message: "Student id is not exists",
          });
        }
        req.body.parking = isStudentidExists[0].parking;
        req.body.room_type = "AC";
        // req.body.bed_type = isStudentidExists[0].bed_type;
        req.body.occupancy = data[0].request_value;
        req.body.toilet_type = isStudentidExists[0].toilet_type;
        var buildingName;
        var parkingId;

        var randomRoom = await knex("room")
          .where({
            Is_alloted: 0,
            room_type: req.body.room_type,
            // bed_type: req.body.bed_type,
            occupancy: req.body.occupancy,
            toilet_type: req.body.toilet_type,
            status: 1,
          })
          .orderByRaw("rand()")
          .limit(1);

        if (randomRoom.length == 0) {
          return res.json({
            status: 401,
            message: "No room available",
          });
        } else {
          await knex("room")
            .where({
              building_name: isStudentidExists[0].building_name,
              room_number: isStudentidExists[0].room_id,
            })
            .update({
              Is_alloted: 0,
              student_id: 0,
            });
          await knex("student_details")
            .where({ id: data[0].student_id })
            .update({
              room_id: randomRoom[0].room_number,
              building_name: randomRoom[0].building_name,
              occupancy: req.body.occupancy,
              room_type: "AC",
              is_approved: 1,
              status: 1,
              updated_at: new Date(),
            });

          // console.log(ok);

          await knex("room").where({ id: randomRoom[0].id }).update({
            Is_alloted: 1,
            student_id: data[0].student_id,
          });

          sentSms({
            phone_number: isStudentidExists[0].SmobNo,
            msg:
              "Dear Ms. " +
              isStudentidExists.SFname +
              ", Based on the availability and room preference, we are pleased to inform you of your room number: " +
              randomRoom[0].room_number +
              " (" +
              isStudentidExists.occupancy +
              "," +
              isStudentidExists.room_type +
              "," +
              isStudentidExists.toilet_type +
              ") is allocated to you for the AY 2022-23. Wishing you a pleasant stay at RMH.",
          });
          console.log("------------------------", data[0]);
          await knex("notifications").insert([
            {
              student_id: data[0].student_id,
              student_name: data[0].student_name,
              title: "Upgrade Request",
              des: req.body.status == 2
              ? "Your request for room upgrade has been approved"
              : "Your request for room upgrade has been reject",
              status: 0,
              student_status: 0,
            created_at: new Date(),
    
            },
          ]);
        }
      } else if (data[0].request_type == "Food") {
        await knex("notifications").insert([
          {
            student_id: data[0].student_id,
              student_name: data[0].student_name,
            title: "Upgrade Request",
            des: req.body.status == 2
            ? "Your request for food upgrade has been approved"
            : "Your request for food upgrade has been reject",
            status: 0,
            student_status: 0,
          created_at: new Date(),
  
          },
        ]);
        await knex("student_details").where({ id: data[0].student_id }).update({
          food_preference: data[0].request_value,
          updated_at: new Date(),
        });
      }
    }
    var updateData = await knex("upgrade_request")
      .where({
        id: req.body.id,
      })
      .update({
        status: req.body.status,
        updated_at: new Date(),
      });

    // console.log(ok);
    if (updateData == 1) {
      return res.json({
        status: 200,
        message: "Successfully upgrade",
      });
    } else {
      return res.json({
        status: 404,
        message: "Not Found",
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

module.exports = router;
