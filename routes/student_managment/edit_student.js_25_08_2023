/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
const fileUpload = require("../../module/file_upload");
const file_upload = require("../../module/file_upload");
const fs = require("fs");
router.post("/", async (req, res) => {
  try {
    // console.log(req.body);

    // if (req.body.student_id == undefined || req.body.student_id == "") {
    //     return res.json({
    //         status: 401,
    //         message: "Please enter student id"
    //     });
    // } else
    if (req.body.id == undefined || req.body.id == "") {
      return res.json({ status: 401, message: "Please enter id" });
    } else if (req.body.SFname == undefined || req.body.SFname == "") {
      return res.json({ status: 401, message: "Please enter student name" });
    } else if (req.body.SRaddress == undefined || req.body.SRaddress == "") {
      return res.json({ status: 401, message: "Please enter student address" });
    } else if (req.body.SmobNo == undefined || req.body.SmobNo == "") {
      return res.json({
        status: 401,
        message: "Please enter student mobile no",
      });
    } else if (req.body.StudEmail == undefined || req.body.StudEmail == "") {
      return res.json({ status: 401, message: "Please enter student email" });
    } else if (
      req.body.StudimagepathBase == undefined ||
      req.body.StudimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter student image",
      });
    } else if (req.body.StudDOB == undefined || req.body.StudDOB == "") {
      return res.json({ status: 401, message: "Please enter student DOB" });
    } else if (
      req.body.NamofInstitute == undefined ||
      req.body.NamofInstitute == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Name of Institute",
      });
    } else if (
      req.body.AdrsodInstitute == undefined ||
      req.body.AdrsodInstitute == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter address of institute",
      });
    } else if (
      req.body.CourEnrolled == undefined ||
      req.body.CourEnrolled == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Course enrolled / Year",
      });
    } else if (req.body.FatherName == undefined || req.body.FatherName == "") {
      return res.json({ status: 401, message: "Please enter Father's name" });
    } else if (
      req.body.MothersName == undefined ||
      req.body.MothersName == ""
    ) {
      return res.json({ status: 401, message: "Please enter Mother's name" });
    } else if (req.body.FatherOccu == undefined || req.body.FatherOccu == "") {
      return res.json({
        status: 401,
        message: "Please enter Father's occupation",
      });
    } else if (
      req.body.MathersOccu == undefined ||
      req.body.MathersOccu == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Mother's occupation",
      });
    } else if (
      req.body.FatherConNo == undefined ||
      req.body.FatherConNo == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Father's contact no.",
      });
    } else if (
      req.body.MothersConNo == undefined ||
      req.body.MothersConNo == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Mother's contact no",
      });
    } else if (
      req.body.FatherAnnInc == undefined ||
      req.body.FatherAnnInc == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Father's annual income",
      });
    } else if (
      req.body.BankAccHolder == undefined ||
      req.body.BankAccHolder == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Bank A/c Holder’s Name",
      });
    } else if (req.body.BanckName == undefined || req.body.BanckName == "") {
      return res.json({ status: 401, message: "Please enter Bank name" });
    } else if (req.body.BankBranch == undefined || req.body.BankBranch == "") {
      return res.json({
        status: 401,
        message: "Please enter Bank branch name",
      });
    } else if (
      req.body.BrankAcctNo == undefined ||
      req.body.BrankAcctNo == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Bank Account Number",
      });
    } else if (req.body.BankIFSC == undefined || req.body.BankIFSC == "") {
      return res.json({ status: 401, message: "Please enter BankIFSC" });
    } else if (
      req.body.LocGuardName == undefined ||
      req.body.LocGuardName == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Local Guardian's Name",
      });
    } else if (
      req.body.RelWithLocGurd == undefined ||
      req.body.RelWithLocGurd == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Relationship with Local Guardian",
      });
    } else if (
      req.body.LocGurdConNo == undefined ||
      req.body.LocGurdConNo == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Local Guardian's Contact No",
      });
    } else if (
      req.body.LocGurdAdres == undefined ||
      req.body.LocGurdAdres == ""
    ) {
      return res.json({
        status: 401,
        message: "Please enter Local Guardian's Address",
      });
    } else if (
      req.body.food_preference == undefined ||
      req.body.food_preference == "" ||
      req.body.food_preference == "Default select"
    ) {
      return res.json({
        status: 401,
        message: "Please select food preference",
      });
    } else if (
      req.body.room_type == undefined ||
      req.body.room_type == "" ||
      req.body.room_type == "Default select"
    ) {
      return res.json({
        status: 401,
        message: "Please select room type",
      });
    } else if (
      req.body.parking == undefined ||
      req.body.parking == "" ||
      req.body.parking == "Default select"
    ) {
      return res.json({
        status: 401,
        message: "Please select parking",
      });
    }
    //  else if (req.body.bed_type == undefined || req.body.bed_type == "") {
    //      return res.json({
    //          status: 401,
    //          message: "Please select Bed Type"
    //      });
    //  }
    else if (
      req.body.occupancy == undefined ||
      req.body.occupancy == "" ||
      req.body.occupancy == "Default select"
    ) {
      return res.json({
        status: 401,
        message: "Please select Occupancy",
      });
    } else if (
      req.body.transportation == undefined ||
      req.body.transportation == "" ||
      req.body.transportation == "Default select"
    ) {
      return res.json({
        status: 401,
        message: "Please select Transportation",
      });
    } else if (
      req.body.LocalimagepathBase == undefined ||
      req.body.LocalimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Local Guardian Image",
      });
    } else if (
      req.body.FatherConNo != "" &&
      req.body.FatherConNo.length != 10
    ) {
      return res.json({
        status: 401,
        message: "Father number should be of 10 digits",
      });
    } else if (
      req.body.MothersConNo != "" &&
      req.body.MothersConNo.length != 10
    ) {
      return res.json({
        status: 401,
        message: "Mother number should be of 10 digits",
      });
    } else if (
      req.body.LocGurdConNo != "" &&
      req.body.LocGurdConNo.length != 10
    ) {
      return res.json({
        status: 401,
        message: "Local guardian number should be of 10 digits",
      });
    } else if (req.body.StayConNo != "" && req.body.StayConNo.length != 10) {
      return res.json({
        status: 401,
        message: "Weekend stay person number should be of 10 digits",
      });
    } else if (req.body.StayConNo1 != "" && req.body.StayConNo1.length != 10) {
      return res.json({
        status: 401,
        message: "Weekend stay person number should be of 10 digits",
      });
    } else {
      var isStudentidExists = await knex("student_details")
        .where({
          id: 0,
        })
        .limit(1);
      if (isStudentidExists.length > 0) {
        return res.json({
          status: 401,
          message: "Student id is already exists",
        });
      }
      if (req.body.parking == "No") {
        await knex("student_details")
          .where({
            id: req.body.id,
          })
          .update({
            parking_type: null,
            parking_name: null,
            parking_id: null,
          });
        await knex("parking_slot")
          .where({
            student_id: req.body.id,
          })
          .update({
            is_alloted: 0,
            student_id: null,
          });
      }
      var buildingName;
      var parkingId;
      if (req.body.parking == "Yes") {
        let get_student_parking = await knex("student_details")
          .select("parking")
          .where({
            id: req.body.id,
          });
        if (get_student_parking[0].parking == "No") {
          var isParkingExists = await knex("parking_slot")
            .where({
              Is_alloted: 0,
            })
            .orderByRaw("rand()")
            .limit(1);
          if (isParkingExists.length == 1) {
            parkingId = isParkingExists[0].id;
            buildingName = isParkingExists[0].parking_name;
            await knex("student_details")
              .where({
                id: req.body.id,
              })
              .update({
                parking_type: req.body.parking_type,
                parking_name: buildingName,
                parking_id: parkingId,
              });
              await knex("parking_slot").where({ id: parkingId }).update({
                Is_alloted: 1,
                student_id:req.body.id,
              });
          } else {
            return res.json({
              status: 401,
              message: "No parking slot available",
            });
          }
        }
      }

      // formatting the date
      let dt_arr = req.body.StudDOB.split("-");
      let final_dob = dt_arr[1]+'/'+dt_arr[2]+'/'+dt_arr[0];

      var isSaveData = await knex("student_details")
        .where({
          id: req.body.id,
        })
        .update({
          SFname: req.body.SFname,
          SRaddress: req.body.SRaddress,
          SmobNo: req.body.SmobNo,
          StudEmail: req.body.StudEmail,
          StudDOB: final_dob,
          NamofInstitute: req.body.NamofInstitute,
          AdrsodInstitute: req.body.AdrsodInstitute,
          CourEnrolled: req.body.CourEnrolled,
          FatherName: req.body.FatherName,
          MothersName: req.body.MothersName,
          FatherOccu: req.body.FatherOccu,
          MathersOccu: req.body.MathersOccu,
          FatherConNo: req.body.FatherConNo,
          MothersConNo: req.body.MothersConNo,
          FatherEmail: req.body.FatherEmail,
          MothersEmail: req.body.MothersEmail,
          FatherAnnInc: req.body.FatherAnnInc,
          MotherAnnInc: req.body.MotherAnnInc,
          BankAccHolder: req.body.BankAccHolder,
          BanckName: req.body.BanckName,
          BankBranch: req.body.BankBranch,
          BrankAcctNo: req.body.BrankAcctNo,
          BankIFSC: req.body.BankIFSC,
          LocGuardName: req.body.LocGuardName,
          RelWithLocGurd: req.body.RelWithLocGurd,
          LocGurdConNo: req.body.LocGurdConNo,
          LocGurdAdres: req.body.LocGurdAdres,
          NameVistMale1: req.body.NameVistMale1,
          RelVistMaleApp1: req.body.RelVistMaleApp1,
          NameVistMale2: req.body.NameVistMale2,
          RelVistMaleApp2: req.body.RelVistMaleApp2,
          NameVistMale3: req.body.NameVistMale3,
          RelVistMaleApp3: req.body.RelVistMaleApp3,
          NameVistFeMale1: req.body.NameVistFeMale1,
          RelVistFeMaleApp1: req.body.RelVistFeMaleApp1,
          NameVistFeMale2: req.body.NameVistFeMale2,
          RelVistFeMaleApp2: req.body.RelVistFeMaleApp2,
          NameVistFeMale3: req.body.NameVistFeMale3,
          RelVistFeMaleApp3: req.body.RelVistFeMaleApp3,
          StayPersonName: req.body.StayPersonName,
          StayRelWithApp: req.body.StayRelWithApp,
          StayAddress: req.body.StayAddress,
          StayConNo: req.body.StayConNo,
          StayPersonName1: req.body.StayPersonName1,
          StayRelWithApp1: req.body.StayRelWithApp1,
          StayAddress1: req.body.StayAddress1,
          StayConNo1: req.body.StayConNo1,
          food_preference: req.body.food_preference,
          room_type: req.body.room_type,
          occupancy: req.body.occupancy,
          //  bed_type: req.body.bed_type,
          toilet_type: req.body.toilet_type,
          parking: req.body.parking,
          parking_type: req.body.parking_type,
          transportation: req.body.transportation,
          academic_year: req.body.academic_year,
          updated_at: new Date(),
        });

      if (isSaveData) {
        var StudimageUrl = await base64_decode(req.body.StudimagepathBase);
        var LocalimageUrl = await base64_decode(req.body.LocalimagepathBase);

        var fatherImage = "";
        var motherImage = "";
        var imageMale1 = "";
        var imageMale2 = "";
        var imageMale3 = "";
        var imageFeMale1 = "";
        var imageFeMale2 = "";
        var imageFeMale3 = "";
        var bankProf="";
        if (
          req.body.MotherimagepathBase != undefined &&
          req.body.MotherimagepathBase != ""
        ) {
          motherImage = await base64_decode(req.body.MotherimagepathBase);
        }
        if (
          req.body.FatherimagepathBase != undefined &&
          req.body.FatherimagepathBase != ""
        ) {
          fatherImage = await base64_decode(req.body.FatherimagepathBase);
        }

        if (
          req.body.ImgMaleApp1Base != undefined &&
          req.body.ImgMaleApp1Base != ""
        ) {
          imageMale1 = await base64_decode(req.body.ImgMaleApp1Base);
        }
        if (
          req.body.ImgMaleApp2Base != undefined &&
          req.body.ImgMaleApp2Base != ""
        ) {
          imageMale2 = await base64_decode(req.body.ImgMaleApp2Base);
        }
        if (
          req.body.ImgMaleApp3Base != undefined &&
          req.body.ImgMaleApp3Base != ""
        ) {
          imageMale3 = await base64_decode(req.body.ImgMaleApp3Base);
        }
        if (
          req.body.ImgFeMaleApp1Base != undefined &&
          req.body.ImgFeMaleApp1Base != ""
        ) {
          imageFeMale1 = await base64_decode(req.body.ImgFeMaleApp1Base);
        }
        if (
          req.body.ImgFeMaleApp2Base != undefined &&
          req.body.ImgFeMaleApp2Base != ""
        ) {
          imageFeMale2 = await base64_decode(req.body.ImgFeMaleApp2Base);
        }
        if (
          req.body.ImgFeMaleApp3Base != undefined &&
          req.body.ImgFeMaleApp3Base != ""
        ) {
          imageFeMale3 = await base64_decode(req.body.ImgFeMaleApp3Base);
        }

        if (
          req.body.BankimagepathBase != undefined &&
          req.body.BankimagepathBase != ""
        ) {
          bankProf = await base64_decode(req.body.BankimagepathBase);
        }

        await knex("student_details_image")
          .where({
            student_id: req.body.id,
          })
          .update({
            StudimagepathBase: StudimageUrl,
            LocalimagepathBase: LocalimageUrl,
            FatherimagepathBase: fatherImage,
            MotherimagepathBase: motherImage,
            ImgMaleApp1Base: imageMale1,
            ImgMaleApp2Base: imageMale2,
            ImgMaleApp3Base: imageMale3,
            ImgFeMaleApp1Base: imageFeMale1,
            ImgFeMaleApp2Base: imageFeMale2,
            ImgFeMaleApp3Base: imageFeMale3,
            bankProf: bankProf,
            updated_at: new Date(),
          });

        // console.log(req.body.MotherimagepathBase);
        return res.status(200).json({
          status: 200,
          message: "Sucessfully student updated",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to update student",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 401,
      message: error.message,
    });
  }
});

async function base64_decode(base64Image) {
  if (base64Image) {
    base64Image = decodeURIComponent(base64Image);
    var strFirstThree = base64Image.substring(0, 4);
    if (strFirstThree == "http") {
      return base64Image;
    } else {
      let base64String = base64Image.split(";base64,").pop();
      // console.log(base64String);
      const image = Buffer.from(base64String, "base64");
      var imageName = "temp/" + Date.now() + ".png";
      fs.writeFileSync(imageName, image);
      var upload = await file_upload(imageName);
      fs.rmSync(imageName);
      return upload.Location;
    }
  }
}
module.exports = router;
