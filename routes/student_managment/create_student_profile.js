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
const { sentMailTo } = require("../../module/mail");
const sentSms = require("../../module/sent_sms");
const getSize = require("image-size-from-base64");
let pdf = require("html-pdf");
var moment = require("moment");

const puppeteer = require("puppeteer");
const fetchUrl = require("fetch").fetchUrl;

function visitors_photo(visitor_photo) {
  return visitor_photo
    ? `
      <tr>
        <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>&nbsp;&nbsp;&nbsp;&nbsp;<img src='${visitor_photo}' width="100" height="120"></td>
        <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>&nbsp;</td>
      </tr>
      `
    : "";
}

function visitor(visitor_name, visitor_relation, visitor_photo) {
  return visitor_name
    ? ` <tr>
          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>&nbsp;&nbsp;&nbsp;&nbsp;${visitor_name}</td>
          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>${visitor_relation}</td>
          </tr>
  
          ${visitors_photo(visitor_photo)}  `
    : "";
}

function print() {
  const x = res.render("", { st: "WB", cd: "521" });
}

router.post("/", async (req, res) => {
  try {
    // if (req.body.student_id == undefined || req.body.student_id == "") {
    //     return res.json({
    //         status: 401,
    //         message: "Please enter student id"
    //     });
    // } else
    if (req.body.SFname == undefined || req.body.SFname == "") {
      return res.json({ status: 401, message: "Please enter SFname" });
    } else if (req.body.SRaddress == undefined || req.body.SRaddress == "") {
      return res.json({ status: 401, message: "Please enter SRaddress" });
    } else if (req.body.SmobNo == undefined || req.body.SmobNo == "") {
      return res.json({ status: 401, message: "Please enter SmobNo" });
    } else if (req.body.StudEmail == undefined || req.body.StudEmail == "") {
      return res.json({ status: 401, message: "Please enter StudEmail" });
    } else if (req.body.StudDOB == undefined || req.body.StudDOB == "") {
      return res.json({ status: 401, message: "Please enter StudDOB" });
    } else if (
      req.body.NamofInstitute == undefined ||
      req.body.NamofInstitute == ""
    ) {
      return res.json({ status: 401, message: "Please enter NamofInstitute" });
    } else if (
      req.body.AdrsodInstitute == undefined ||
      req.body.AdrsodInstitute == ""
    ) {
      return res.json({ status: 401, message: "Please enter AdrsodInstitute" });
    } else if (
      req.body.CourEnrolled == undefined ||
      req.body.CourEnrolled == ""
    ) {
      return res.json({ status: 401, message: "Please enter CourEnrolled" });
    } else if (req.body.FatherName == undefined || req.body.FatherName == "") {
      return res.json({ status: 401, message: "Please enter FatherName" });
    } else if (
      req.body.MothersName == undefined ||
      req.body.MothersName == ""
    ) {
      return res.json({ status: 401, message: "Please enter MothersName" });
    } else if (req.body.FatherOccu == undefined || req.body.FatherOccu == "") {
      return res.json({ status: 401, message: "Please enter FatherOccu" });
    } else if (
      req.body.MathersOccu == undefined ||
      req.body.MathersOccu == ""
    ) {
      return res.json({ status: 401, message: "Please enter MathersOccu" });
    } else if (
      req.body.FatherConNo == undefined ||
      req.body.FatherConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter FatherConNo" });
    } else if (
      req.body.MothersConNo == undefined ||
      req.body.MothersConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter MothersConNo" });
    } else if (
      req.body.FatherAnnInc == undefined ||
      req.body.FatherAnnInc == ""
    ) {
      return res.json({ status: 401, message: "Please enter FatherAnnInc" });
    } else if (
      req.body.BankAccHolder == undefined ||
      req.body.BankAccHolder == ""
    ) {
      return res.json({ status: 401, message: "Please enter BankAccHolder" });
    } else if (req.body.BanckName == undefined || req.body.BanckName == "") {
      return res.json({ status: 401, message: "Please enter BanckName" });
    } else if (req.body.BankBranch == undefined || req.body.BankBranch == "") {
      return res.json({ status: 401, message: "Please enter BankBranch" });
    } else if (
      req.body.BrankAcctNo == undefined ||
      req.body.BrankAcctNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter BrankAcctNo" });
    } else if (req.body.BankIFSC == undefined || req.body.BankIFSC == "") {
      return res.json({ status: 401, message: "Please enter BankIFSC" });
    } else if (
      req.body.LocGuardName == undefined ||
      req.body.LocGuardName == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGuardName" });
    } else if (
      req.body.RelWithLocGurd == undefined ||
      req.body.RelWithLocGurd == ""
    ) {
      return res.json({ status: 401, message: "Please enter RelWithLocGurd" });
    } else if (
      req.body.LocGurdConNo == undefined ||
      req.body.LocGurdConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGurdConNo" });
    } else if (
      req.body.LocGurdAdres == undefined ||
      req.body.LocGurdAdres == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGurdAdres" });
    } else if (
      req.body.food_preference == undefined ||
      req.body.food_preference == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select food preference",
      });
    } else if (req.body.room_type == undefined || req.body.room_type == "") {
      return res.json({
        status: 401,
        message: "Please select room type",
      });
    } else if (req.body.parking == undefined || req.body.parking == "") {
      return res.json({
        status: 401,
        message: "Please select parking",
      });
    } else if (
      req.body.parking == "Yes" &&
      (req.body.parking_type == undefined || req.body.parking_type == "")
    ) {
      return res.json({
        status: 401,
        message: "Please select parking type 2 wheeler or 4 wheeler",
      });
    } else if (req.body.SmobNo != "" && req.body.SmobNo.length != 10) {
      return res.json({
        status: 401,
        message: "Student number should be of 10 digits",
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
    }
    // else if (req.body.bed_type == undefined || req.body.bed_type == "") {
    //     return res.json({
    //         status: 401,
    //         message: "Please select Bed Type"
    //     });
    // }
    else if (req.body.occupancy == undefined || req.body.occupancy == "") {
      return res.json({
        status: 401,
        message: "Please select Occupancy",
      });
    } 
   /* else if (
      req.body.LocalimagepathBase == undefined ||
      req.body.LocalimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Local Guardian Image",
      });
    } else if (
      req.body.StudimagepathBase == undefined ||
      req.body.StudimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Student Image",
      });
    } else if (
      req.body.MotherimagepathBase == undefined ||
      req.body.MotherimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Mother Image",
      });
    } else if (
      req.body.FatherimagepathBase == undefined ||
      req.body.FatherimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Father Image",
      });
    }*/
     else {
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
      var isAlreadyExist = await knex("student_details").where({
        SmobNo: req.body.SmobNo,
      });
      if (isAlreadyExist.length != 0) {
        return res.json({
          status: 401,
          message: "Student Phone number already exists",
        });
      }

      // formatting the date
      let dt_arr = req.body.StudDOB.split("-");
      let final_dob = dt_arr[1]+'/'+dt_arr[2]+'/'+dt_arr[0];

      var isSaveData = await knex("student_details").insert([
        {
          student_id: req.body.student_id ?? 0,
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
          bed_type: "NULL",
          toilet_type: req.body.toilet_type,
          parking: req.body.parking,
          parking_type:
            req.body.parking == "Yes" ? req.body.parking_type : null,
          transportation: req.body.transportation,
          room_id: 0,
          building_name: "",
          parking_name: "",
          parking_id: 0,
          academic_year: req.body.academic_year,
          is_approved: 0,
          status: 0,
          payment_res:req.body.payment_response,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log(isSaveData);
      if (isSaveData.length == 1) {
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

        var ok = await knex("student_details_image").insert([
          {
            id: req.body.student_id,
            student_id: isSaveData[0],
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
            status: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

        // saving the payment informations
        if (req.body.payment_response != undefined && req.body.payment_response != "") {
          await knex("payment_activity").insert([
            {
              student_id: isSaveData[0],
              student_name: req.body.SFname,
              payment_id: req.body.payment_id,
              amount: req.body.hasOwnProperty("payment_amount") ? req.body.payment_amount : 800,
              type: "One Time",
              plan_id: 0,
              status: 1,
              created_at: moment()
                .utcOffset("+05:30")
                .format("YYYY-MM-DD HH:mm:ss"),
            },
          ]);
        }
        

        sentMailTo(
          req.body.StudEmail,
          "Successful Registration",
          "Dear Ms. " +
            req.body.SFname +
            " Greetings!\n\n" +
            "This is to inform you that you have successfully registered for Hostel room, we will let you know once the room is allocated to you based on the availability and room preference.\n\n " +
            "Thanking you.\n\n" +
            "With Regards,\n" +
            "RM Hostel Team"
        );

        sentSms({
          phone_number: req.body.SmobNo,
          msg:
            "Dear Ms. " +
            req.body.SFname +
            ",, This is to inform you that you have successfully registered for Hostel room, we will let you know once the room is allocated to you based on the availability and room preference.",
        });

        return res.status(200).json({
          status: 200,
          message: "Submitted successfully",
        });
      } else {
        return res.json({
          status: 401,
          message: "Failed to adding",
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

router.post("/check_validation", async (req, res) => {
  try {
    // if (req.body.student_id == undefined || req.body.student_id == "") {
    //     return res.json({
    //         status: 401,
    //         message: "Please enter student id"
    //     });
    // }

    let motherImage = await check_image_size(
      req.body.MotherimagepathBase,
      "motherImage"
    );
    let studentImage = await check_image_size(
      req.body.StudimagepathBase,
      "studentImage"
    );
    let fatherImage = await check_image_size(
      req.body.FatherimagepathBase,
      "fatherImage"
    );
    let guardianImage = await check_image_size(
      req.body.LocalimagepathBase,
      "guardianImage"
    );
    if (req.body.SFname == undefined || req.body.SFname == "") {
      return res.json({ status: 401, message: "Please enter SFname" });
    } else if (req.body.SRaddress == undefined || req.body.SRaddress == "") {
      return res.json({ status: 401, message: "Please enter SRaddress" });
    } else if (req.body.SmobNo == undefined || req.body.SmobNo == "") {
      return res.json({ status: 401, message: "Please enter SmobNo" });
    } else if (req.body.StudEmail == undefined || req.body.StudEmail == "") {
      return res.json({ status: 401, message: "Please enter StudEmail" });
    } else if (
      req.body.StudimagepathBase == undefined ||
      req.body.StudimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Student Image",
      });
    } else if (
      req.body.MotherimagepathBase == undefined ||
      req.body.MotherimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Mother Image",
      });
    } else if (
      req.body.FatherimagepathBase == undefined ||
      req.body.FatherimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Father Image",
      });
    } else if (req.body.StudDOB == undefined || req.body.StudDOB == "") {
      return res.json({ status: 401, message: "Please enter StudDOB" });
    } else if (
      req.body.NamofInstitute == undefined ||
      req.body.NamofInstitute == ""
    ) {
      return res.json({ status: 401, message: "Please enter NamofInstitute" });
    } else if (
      req.body.AdrsodInstitute == undefined ||
      req.body.AdrsodInstitute == ""
    ) {
      return res.json({ status: 401, message: "Please enter AdrsodInstitute" });
    } else if (
      req.body.CourEnrolled == undefined ||
      req.body.CourEnrolled == ""
    ) {
      return res.json({ status: 401, message: "Please enter CourEnrolled" });
    } else if (req.body.FatherName == undefined || req.body.FatherName == "") {
      return res.json({ status: 401, message: "Please enter FatherName" });
    } else if (
      req.body.MothersName == undefined ||
      req.body.MothersName == ""
    ) {
      return res.json({ status: 401, message: "Please enter MothersName" });
    } else if (req.body.FatherOccu == undefined || req.body.FatherOccu == "") {
      return res.json({ status: 401, message: "Please enter FatherOccu" });
    } else if (
      req.body.MathersOccu == undefined ||
      req.body.MathersOccu == ""
    ) {
      return res.json({ status: 401, message: "Please enter MathersOccu" });
    } else if (
      req.body.FatherConNo == undefined ||
      req.body.FatherConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter FatherConNo" });
    } else if (
      req.body.MothersConNo == undefined ||
      req.body.MothersConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter MothersConNo" });
    } else if (
      req.body.FatherAnnInc == undefined ||
      req.body.FatherAnnInc == ""
    ) {
      return res.json({ status: 401, message: "Please enter FatherAnnInc" });
    } else if (
      req.body.BankAccHolder == undefined ||
      req.body.BankAccHolder == ""
    ) {
      return res.json({ status: 401, message: "Please enter BankAccHolder" });
    } else if (req.body.BanckName == undefined || req.body.BanckName == "") {
      return res.json({ status: 401, message: "Please enter BanckName" });
    } else if (req.body.BankBranch == undefined || req.body.BankBranch == "") {
      return res.json({ status: 401, message: "Please enter BankBranch" });
    } else if (
      req.body.BrankAcctNo == undefined ||
      req.body.BrankAcctNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter BrankAcctNo" });
    } else if (req.body.BankIFSC == undefined || req.body.BankIFSC == "") {
      return res.json({ status: 401, message: "Please enter BankIFSC" });
    } else if (
      req.body.LocGuardName == undefined ||
      req.body.LocGuardName == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGuardName" });
    } else if (
      req.body.RelWithLocGurd == undefined ||
      req.body.RelWithLocGurd == ""
    ) {
      return res.json({ status: 401, message: "Please enter RelWithLocGurd" });
    } else if (
      req.body.LocGurdConNo == undefined ||
      req.body.LocGurdConNo == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGurdConNo" });
    } else if (
      req.body.LocGurdAdres == undefined ||
      req.body.LocGurdAdres == ""
    ) {
      return res.json({ status: 401, message: "Please enter LocGurdAdres" });
    } else if (
      req.body.food_preference == undefined ||
      req.body.food_preference == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select food preference",
      });
    } else if (req.body.room_type == undefined || req.body.room_type == "") {
      return res.json({
        status: 401,
        message: "Please select room type",
      });
    } else if (req.body.parking == undefined || req.body.parking == "") {
      return res.json({
        status: 401,
        message: "Please select parking",
      });
    } else if (
      req.body.parking == "Yes" &&
      (req.body.parking_type == undefined || req.body.parking_type == "")
    ) {
      return res.json({
        status: 401,
        message: "Please select parking type 2 wheeler or 4 wheeler",
      });
    } else if (req.body.SmobNo != "" && req.body.SmobNo.length != 10) {
      return res.json({
        status: 401,
        message: "Student number should be of 10 digits",
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
    }
    // else if (req.body.bed_type == undefined || req.body.bed_type == "") {
    //     return res.json({
    //         status: 401,
    //         message: "Please select Bed Type"
    //     });
    // }
    else if (req.body.occupancy == undefined || req.body.occupancy == "") {
      return res.json({
        status: 401,
        message: "Please select Occupancy",
      });
    } else if (
      req.body.LocalimagepathBase == undefined ||
      req.body.LocalimagepathBase == ""
    ) {
      return res.json({
        status: 401,
        message: "Please select Local Guardian Image",
      });
    } else if (motherImage == true) {
      return res.json({
        status: 401,
        message: "Please upload mother image less than 5 mb",
      });
    } else if (fatherImage == true) {
      return res.json({
        status: 401,
        message: "Please upload father image less than 5 mb",
      });
    } else if (studentImage == true) {
      return res.json({
        status: 401,
        message: "Please upload student image less than 5 mb",
      });
    } else if (guardianImage == true) {
      return res.json({
        status: 401,
        message: "Please upload guardian image less than 5 mb",
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
      var isAlreadyExist = await knex("student_details").where({
        SmobNo: req.body.SmobNo,
      });
      if (isAlreadyExist.length != 0) {
        return res.json({
          status: 401,
          message: "Student Phone number already exists",
        });
      }
      var isAlreadyExistEmail = await knex("student_details").where({
        StudEmail: req.body.StudEmail,
      });
      if (isAlreadyExistEmail.length != 0) {
        return res.json({
          status: 401,
          message: "Student email already exists",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "validation checked",
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

router.get("/download_application_form/:id", async (req, res) => {
  if (req.params.id == undefined || req.params.id == "") {
    return res.json({
      status: 401,
      message: "Please enter id",
    });
  }

  const studentDetails = await knex("student_details")
    .where({ id: req.params.id })
    .limit(1);

  if (studentDetails.length > 0) {
    const studentDetailsPhoto = await knex("student_details_image")
      .where({ student_id: req.params.id })
      .limit(1);

    let pdfName = `${studentDetails[0].SFname}_application.pdf`;

    let file = {
      content: `
      <table width='100%' border='0' bordercolor='#B6B6B6' align='center' cellspacing='0' cellpadding='0' style='font-size:11px; border:0 none; border-collapse:collapse; background-color:#FFF;font-family: Arial,Helvetica Neue,Helvetica,sans-serif; margin:auto;'>
      <tbody>
          <tr>
              <td style='border-bottom: 1px solid #000000;'>
                  <table border='0' width='100%'>
                      <tr>
                          <td  style='padding:20px 0 10px;text-align: center; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 15px; font-weight: bold; text-transform: uppercase;'>CHETTINAD RANI MEYYAMMAI HOSTEL</td>
                      </tr>
                      <tr>
                          <td  style='padding:0;text-align: center; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; '>No. 25, Ethiraj Salai, Chennai - 600 008. Phone: 2827 1617, 2823 2009</td>
                      </tr>
                      <tr>
                          <td  style='padding:10px 0;text-align: center; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'><a style='color: #000000;text-decoration: none;' href='mailto:ranimeyyammaihostel@gmail.com'>E-mail: ranimeyyammaihostel@gmail.com</a></td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding-top:10px'>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='width:20%; vertical-align:top'>&nbsp;</td>
                          <td  style='width:60%;padding:0;text-align: center; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 14px; font-weight: bold; vertical-align:top'>APPLICATION FORM</td>
                          <td style='width:20%;text-align: left; vertical-align:top'><img src=${
                            studentDetailsPhoto[0].StudimagepathBase
                          } width="100" height="120"></td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding: 0 0 15px;'><strong>No:</strong> RMH/23-24/ ${req.params.id} </td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>1.Name (in full)</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].SFname
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>2.Date and Place of Birth</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].StudDOB
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>3.Details of College enrolled in</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'></td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;(a) Name</td>
                          <td style='padding: 5px 0 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].NamofInstitute
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;(b) Address</td>
                          <td style='padding: 5px 0 0; width: 60%; max-width:200px; word-wrap: break-word; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].AdrsodInstitute
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;(c) Applicant Mobile Number</td>
                          <td style='padding: 5px 0 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].SmobNo
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>4.Course enrolled/Year</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].CourEnrolled
                          }/${studentDetails[0].academic_year}</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>5.Details of Parents</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Father</td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Mother</td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Name</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                                        studentDetails[0].FatherName
                                      }</td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>${
                                        studentDetails[0].MothersName
                                      }</td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Occupation</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                                        studentDetails[0].FatherOccu
                                      }</td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>${
                                        studentDetails[0].MathersOccu
                                      }</td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Residential Address</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'></td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'></td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Telephone No/ Mobile No</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: <a style='color: #000000;text-decoration: none;' href="tel:${
                                        studentDetails[0].FatherConNo
                                      }">${
        studentDetails[0].FatherConNo
      }</a></td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'><a style='color: #000000;text-decoration: none;' href="tel:${
                                        studentDetails[0].MothersConNo
                                      }">${
        studentDetails[0].MothersConNo
      }</a></td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Email Address</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>
                              <table border='0' width='100%'>
                                  <tr>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>:<a style='color: #000000;text-decoration: none;' href="mailto:${
                                        studentDetails[0].FatherEmail
                                      }">${
        studentDetails[0].FatherEmail
      }</a></td>
                                      <td style='width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'><a style='color: #000000;text-decoration: none;' href="mailto:${
                                        studentDetails[0].MothersEmail
                                      }">${
        studentDetails[0].MothersEmail
      }</a></td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Bank Details <br/> <span style='font-size:9px;'>&nbsp;&nbsp;(A/c Holder’s Name, Bank, Branch, <br /> &nbsp;&nbsp; Account Number)</span></td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].BankAccHolder
                          }, ${studentDetails[0].BanckName}, ${
        studentDetails[0].BankBranch
      }, ${studentDetails[0].BrankAcctNo}</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;IFSC Code</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].BankIFSC
                          }.</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>6. Annual Income of Parents</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            Number(studentDetails[0].FatherAnnInc) +
                            Number(studentDetails[0].MotherAnnInc)
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 50px 0px 5px; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>7. Name, Address & Phone no. of Guardian*</td>
                          <td style='padding: 50px 0px 5px; width: 60%; max-width:200px; word-wrap: break-word; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].LocGuardName
                          }, ${studentDetails[0].LocGurdAdres}, ${
        studentDetails[0].LocGurdConNo
      }.
              </td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;Relationship to the applicant</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>: ${
                            studentDetails[0].RelWithLocGurd
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 100%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 9px; font-weight: normal;'>* Please note: Every hostel resident must have a local guardian</td>
                          <td></td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 15px 0 0; width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>8. Name of the Visitors to be allowed</td>
                          <td style='padding: 15px 0 0; width: 50%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Relationship to the applicant</td>
                      </tr>
  
            ${visitor(
              studentDetails[0].NameVistMale1,
              studentDetails[0].RelVistMaleApp1,
              studentDetailsPhoto[0].ImgMaleApp1Base
            )}   
  
            ${visitor(
              studentDetails[0].NameVistMale2,
              studentDetails[0].RelVistMaleApp2,
              studentDetailsPhoto[0].ImgMaleApp2Base
            )}    
  
            ${visitor(
              studentDetails[0].NameVistMale3,
              studentDetails[0].RelVistMaleApp3,
              studentDetailsPhoto[0].ImgMaleApp3Base
            )}      
  
            <tr><td style='height:60px'></td></tr>
  
            ${visitor(
              studentDetails[0].NameVistFeMale1,
              studentDetails[0].RelVistFeMaleApp1,
              studentDetailsPhoto[0].ImgFeMaleApp1Base
            )}   
  
            ${visitor(
              studentDetails[0].NameVistFeMale2,
              studentDetails[0].RelVistFeMaleApp2,
              studentDetailsPhoto[0].ImgFeMaleApp2Base
            )}    
  
            ${visitor(
              studentDetails[0].NameVistFeMale3,
              studentDetails[0].RelVistFeMaleApp3,
              studentDetailsPhoto[0].ImgFeMaleApp3Base
            )}           
                      
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>9. Name, Address of people in Chennai with whom the applicant can stay for weekends.</td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 5px 0; width: 15%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Name:</td>
                          <td style='padding: 5px 0; width: 35%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>${
                            studentDetails[0].StayPersonName
                          }</td>
                          <td style='padding: 5px 0; width: 15%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Name:</td>
                          <td style='padding: 5px 0; width: 35%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>&nbsp;${
                            studentDetails[0].StayPersonName1
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 15%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Address:</td>
                          <td style='padding: 5px 0; width: 35%; max-width:100px; word-wrap: break-word;  font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>${
                            studentDetails[0].StayAddress
                          }</td>
                          <td style='padding: 5px 0; width: 15%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Address:</td>
                          <td style='padding: 5px 0; width: 35%; max-width:100px; word-wrap: break-word;  font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 12px; font-weight: normal;'>&nbsp;${
                            studentDetails[0].StayAddress1
                          }</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding: 15px 0 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'><strong>10. * Specify your room preference :</strong> 2 in 1 - AC - Attached Washroom </td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;1st Choice: &nbsp; ${
                            studentDetails[0].occupancy
                          }</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>2nd Choice: &nbsp; ${
                            studentDetails[0].room_type
                          }</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;3rd Choice: &nbsp; ${
                            studentDetails[0].toilet_type
                          }</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding: 5px 0;font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold; font-weight: normal;'>* Please note: Rooms will be allotted only on the basis of availability</td>
          </tr>
      <tr><td style='height:100px'></td></tr>
          <tr>
              <td style='text-align: center; padding: 25px 0 10px; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 13px; font-weight: bold;'>DECLARATION</td>
          </tr>
          <tr>
              <td style='padding: 5px 0; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>We understand that the decision of the President, Secretary and / or the Warden will be considered final in all matters regarding the management policies, discipline rules and regulations of the hostel. If admission is granted to the applicant, we agree to abide by the rules and regulations of the hostel.</td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <td style='padding: 5px 0; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Signatures:</td>
                      <td></td>
                  </table>
              </td>			
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Father:</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Mother:</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Guardian:</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Applicant:</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style='padding: 5px 0;font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Date:</td>
          </tr>
          <tr>
              <td style='text-align: center; padding: 25px 0 10px; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 13px; font-weight: bold;'>FOR OFFICE USE ONLY</td>
          </tr>
          <tr>
              <td>
                  <table border='0' width='100%'>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Admission No:</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>Room No:</td>
                      </tr>
                      <tr>
                          <td style='padding: 5px 0; width: 40%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;&nbsp;&nbsp;&nbsp;Medical Record:</td>
                          <td style='padding: 5px 0; width: 60%; font-family: Arial,Helvetica Neue,Helvetica,sans-serif;font-size: 10px; font-weight: bold;'>&nbsp;</td>
                      </tr>
  
                  </table>
              </td>
          </tr>
  </table>
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

    pdf
      .create(file.content, options)
      .toFile(`public/${pdfName}`, function (err, res) {
        if (err) return console.log(err);
        // console.log(res);
      });
    setTimeout(function () {
      res.download(`public/${pdfName}`);
    }, 3000);
    setTimeout(function () {
      fs.unlink(`public/${pdfName}`, function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
    }, 5000);
  } else {
    return res.json({
      status: 401,
      message: "No data found",
    });
  }
});

router.get("/download_invoice/", async (req, res) => {
  // if (req.params.id == undefined || req.params.id == "") {
  //   return res.json({
  //     status: 401,
  //     message: "Please enter id",
  //   });
  // }
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  //Get HTML content from HTML file
  // const html = fs.readFileSync('./views/index.ejs', 'utf-8');
  print();
  fetchUrl(
    "https://api.ranimeyyammaihostel.org/admin/un/secure/create/profile/download_invoice/",
    async function (error, meta, html) {
      // console.log("html.toString()===========>  ", html.toString());

      html = html.toString();
      await page.setContent(html, { waitUntil: "domcontentloaded" });
      // To reflect CSS used for screens instead of print
      await page.emulateMediaType("screen");
      // Downlaod the PDF

      const pdf = await page.pdf({
        path: "result.pdf",

        // margin: '10%',
        printBackground: true,
        format: "A4",
      });
      console.log("pdf==============> ", pdf);
      // Close the browser instance
      await browser.close();
    }
  );
});

// router.get("/download_invoice/:id", async (req, res) => {
//   if (req.params.id == undefined || req.params.id == "") {
//     return res.json({
//       status: 401,
//       message: "Please enter id",
//     });
//   }

//   const studentDetails = await knex("student_details")
//     .where({ id: req.params.id })
//     .limit(1);

//   if (studentDetails.length > 0) {
//     const studentDetailsPhoto = await knex("student_details_image")
//       .where({ student_id: req.params.id })
//       .limit(1);

//     let pdfName = `${studentDetails[0].SFname}_application.pdf`;

//     let file = {
//       content: `<!DOCTYPE html>
//       <html lang="en">
//         <head>
//           <meta charset="UTF-8" />
//           <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//           <link
//             rel="stylesheet"
//             href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
//           />
//           <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.slim.min.js"></script>
//           <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
//           <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
//           <title>Document</title>
//           <style>

//             .receipt {
//               border: 2px solid #000;
//               margin: auto;
//             }

//             .receipt h1 {
//               font-size: 30px;
//               font-weight: 700;
//               padding: 0;
//               margin: 0;
//               background: #09a5d3;
//               border: 2px solid #000;
//               margin: 26px 0 27px;
//             }
//             .receipt h3 {
//               font-size: 18px;
//               font-weight: 700;
//             }
//             .hostel-panel p:nth-child(3) {
//               font-size: 14px;
//               font-weight: 500;
//             }
//             .hostel-panel p:nth-child(2) {
//               font-size: 12px;
//               font-weight: 500;
//             }
//             .bill-header-left {
//               border: 2px solid #000;
//               padding: 14px;
//               background: #09a5d3;
//             }
//             .bill-header-right {
//               border: 2px solid #000;
//               padding: 2px;
//               background: #09a5d3;
//               text-align: center;
//               font-weight: 700;
//             }
//             .bill-header-left {
//               border: 2px solid #000;
//               padding: 14px;
//               background: #09a5d3;
//             }
//             .bill-content-left {
//               border: 1px solid #000;
//               padding: 6px 6px 0;
//               min-height: 148px;
//             }
//             .bill-content-left p {
//               font-size: 13px;
//               font-weight: 800;
//               margin: 0 0 8px;
//             }
//             .bill-content-right {
//               border: 1px solid #000;
//               min-height: 87%;
//               padding: 6px 4px 0;
//               min-height: 148px;
//             }
//             .bill-content-right p {
//               font-size: 12px;
//               font-weight: 700;
//               color: #ff0000;
//               margin: 0 0 8px;
//             }
//             table {
//               width: 100%;
//               margin: 1px;
//             }

//             th,td {
//               border: 2px solid rgb(182, 14, 14);
//             }
//             .receipt-footer {
//               border-top: 2px solid #000;
//               border-left: 2px solid #000;
//               border-right: 2px solid #000;
//               margin: 38px 0px 38px 0px;
//             }
//             .receipt-footer h2 {
//               font-size: 30px;
//               font-weight: 700;
//               padding: 0;
//               background: #09a5d3;
//               text-align: center;
//               border-bottom: 2px solid #000;
//             }
//             .receipt-footer-content p {
//               margin: 0 10px 36px;
//             }
//             .receipt-footer td > span {
//               font-weight: 700;
//             }
//             .receipt-footer td > span:nth-child(1) {
//               display: block;
//               padding: 0 0 32px;
//             }
//             .footer-table tr > td:nth-child(1) {
//               border-left: none;
//             }
//             .footer-table tr > td:nth-child(2) {
//               border-right: none;
//             }
//             .flex-container {
//               display: -webkit-box;
//               display: -webkit-flex;
//               display: flex;
//             }

//             .bill-container{
//               width: 100%;
//               height: 100%;
//               margin-left:0%;
//               -webkit-box-flex: 1;
//               -webkit-flex: 1;
//               flex: 1;
//             }
//           </style>
//         </head>

//         <body>
//           <section class="receipt">
//             <div class="header text-center">
//               <h1>INVOICE</h1>
//             </div>
//             <div class="content">
//               <div class="hostel-panel text-center">
//                 <h3>RANI MEYYAMMAI HOSTEL</h3>

//                 <p>(UNIT OF THE WILLINGDON CHARITABLE TRUST)</p>
//                 <p>
//                   NO.25 ETHIRAJ SALAI, EGMORE, CHENNAI - 600 008
//                   <br />GSTIN::33AAATT0683N2Z6
//                 </p>
//               </div>

//                 <div class="d-flex flex-container">
//                   <div class="bill-container">
//                     <div class="bill-header-left"></div>
//                     <div class="bill-content-left">
//                       <p>Invoice No:T0274</p>
//                       <p>Invoice Date:14/05/2022</p>
//                       <p>Reverse Charge (Y/N):No</p>
//                       <p>State:West Bengal</p>
//                       <p>Code:33</p>
//                     </div>
//                   </div>
//                   <div class="bill-container">
//                     <div class="bill-header-right">BILLED TO</div>
//                     <div class="bill-content-right">
//                       <p>NAME:KALATMIKA PATRA</p>
//                       <p>ID NO:2419</p>
//                       <p>ROOM NO:47</p>
//                       <p>YEAR/MAJOR:B.SC MATHEMATICS</p>
//                     </div>
//                   </div>
//               </div>
//               <table class="bordered">
//                 <tr style="border:1px solid red">
//                   <th rowspan="2">S. No.</th>
//                   <th width="17%" rowspan="2">Description</th>
//                   <th width="10%" rowspan="2">
//                     HSN / SAC<br />
//                     code, if any
//                   </th>
//                   <th width="15%" rowspan="2">Taxable Value</th>
//                   <th class="text-center" width="15%" colspan="2">CGST</th>
//                   <th class="text-center" width="15%" colspan="2">SGST</th>
//                   <th rowspan="2">Total in Rs.</th>
//                 </tr>
//                 <tr>
//                   <th>Rate</th>
//                   <th>Amount</th>
//                   <th>Rate</th>
//                   <th>Amount</th>
//                 </tr>
//                 <tr>
//                   <td>1</td>
//                   <td>Mess Fee</td>
//                   <td>9963</td>
//                   <td>4680</td>
//                   <td>2.5%</td>
//                   <td>117.00</td>
//                   <td>2.5%</td>
//                   <td>117.00</td>
//                   <td>4914</td>
//                 </tr>
//                 <tr style="height: 26px">
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <tr style="height: 26px">
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <tr>
//                   <th style="background: #09a5d3" colspan="4">
//                     Total Amount in Words
//                   </th>
//                   <td colspan="4"><b>Total Amount before Tax</b></td>
//                   <td><b>4680</b></td>
//                 </tr>
//                 <tr>
//                   <td class="text-center" rowspan="4">
//                     Rupees Four Thousand Nine Hundred & Fourteen only
//                   </td>
//                   <td colspan="7"><b>Add:CGST</b></td>
//                   <td><b>117</b></td>
//                 </tr>
//                 <tr>
//                   <td colspan="7"><b>Add:SGST</b></td>
//                   <td><b>117</b></td>
//                 </tr>
//                 <tr>
//                   <td colspan="7"><b>Total Tax Amount</b></td>
//                   <td><b>234</b></td>
//                 </tr>
//                 <tr>
//                   <td colspan="7"><b>Total amount after Tax</b></td>
//                   <td><b>4914</b></td>
//                 </tr>
//                 <tr>
//                   <td rowspan="4"></td>
//                   <td class="text-center" colspan="8">
//                     Ceritified that the particulars given above are true and correct
//                   </td>
//                 </tr>
//                 <tr>
//                   <td class="text-center" colspan="8">
//                     <b>For Rani Meyyammai Hostel</b>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td style="height: 80px" colspan="8"></td>
//                 </tr>
//                 <tr>
//                   <td class="text-center" colspan="8"><b>Authorised Signatory</b></td>
//                 </tr>
//               </table>
//             </div>
//           </section>
//           <section class="receipt-footer">
//             <div class="receipt-header">
//               <h2>RECEIPT</h2>
//             </div>
//             <div class="receipt-footer-content">
//               <p>
//                 Received with thanks from Kalatmika Patra a sum of Rs.4914/- ( Rupees
//                 Four Thousand Nine Hundred &<br />
//                 Fourteen Only) towards settlement of invoice no.T0274 vide NEFT
//                 Online.
//               </p>
//               <table class="footer-table">
//                 <tr>
//                   <td rowspan="2" width="50%"></td>
//                   <td class="text-center">
//                     <span>For Rani Meyyammai Hostel</span
//                     ><span>Authorised Signatory</span>
//                   </td>
//                 </tr>
//               </table>
//             </div>
//           </section>
//         </body>
//       </html>`,
//     };
//     const options = {
//       pageFormat: "A4",
//       orientation: "portrait",
//       border: "10mm",
//       header: {
//         height: "3mm",
//       },
//       type: pdf,
//       footer: {
//         height: "3mm",
//         contents: {
//           default:
//             '<span style="color: #444; font-size:8px;">{{page}}/{{pages}}</span>', // fallback value
//         },
//       },
//     };

//     pdf
//       .create(file.content, options)
//       .toFile(`public/${pdfName}`, function (err, res) {
//         if (err) return console.log(err);
//         // console.log(res);
//       });
//     setTimeout(function () {
//       res.download(`public/${pdfName}`);
//     }, 3000);
//     setTimeout(function () {
//       fs.unlink(`public/${pdfName}`, function (err) {
//         if (err) throw err;
//         console.log("File deleted!");
//       });
//     }, 5000);
//   } else {
//     return res.json({
//       status: 401,
//       message: "No data found",
//     });
//   }
// });

async function check_image_size(base64Image, image) {
  let base64String = base64Image.split(";base64,").pop();
  let size = await getSize(base64String);
  if (size >= 5120) {
    return false;
  } else {
    return false;
  }
}

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
