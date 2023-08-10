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
        } else if (
            req.body.StudimagepathBase == undefined ||
            req.body.StudimagepathBase == ""
        ) {
            return res.json({
                status: 401,
                message: "Please enter StudimagepathBase",
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
        }  else if (
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
        } else if (req.body.food_preference == undefined || req.body.food_preference == "") {
            return res.json({
                status: 401,
                message: "Please select food preference"
            });
        } else if (req.body.room_type == undefined || req.body.room_type == "") {
            return res.json({
                status: 401,
                message: "Please select room type"
            });
        }
        else if (req.body.parking == undefined || req.body.parking == "") {
            return res.json({
                status: 401,
                message: "Please select parking"
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
                message: "Please select Occupancy"
            });
        } else if (req.body.LocalimagepathBase == undefined || req.body.LocalimagepathBase == "") {
            return res.json({
                status: 401,
                message: "Please select Local Guardian Image"
            });
        }

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
            var isSaveData = await knex("student_details").insert([
                {
                    student_id: req.body.student_id ?? 0,
                    SFname: req.body.SFname,
                    SRaddress: req.body.SRaddress,
                    SmobNo: req.body.SmobNo,
                    StudEmail: req.body.StudEmail,
                    StudDOB: req.body.StudDOB,
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
                    transportation: req.body.transportation,
                    room_id: 0,
                    building_name: '',
                    parking_name: '',
                    parking_id: 0,
                    academic_year: req.body.academic_year,
                    is_approved: 0,
                    status: 0,
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
                if (req.body.MotherimagepathBase != undefined && req.body.MotherimagepathBase != "") {
                    motherImage = await base64_decode(req.body.MotherimagepathBase);
                }
                if (req.body.FatherimagepathBase != undefined && req.body.FatherimagepathBase != "") {
                    fatherImage = await base64_decode(req.body.FatherimagepathBase);
                }

                if (req.body.ImgMaleApp1Base != undefined && req.body.ImgMaleApp1Base != "") {
                    imageMale1 = await base64_decode(req.body.ImgMaleApp1Base);    
                }
                if (req.body.ImgMaleApp2Base != undefined && req.body.ImgMaleApp2Base != "") {
                    imageMale2 = await base64_decode(req.body.ImgMaleApp2Base);
                }
                if (req.body.ImgMaleApp3Base != undefined && req.body.ImgMaleApp3Base != "") {
                    imageMale3 = await base64_decode(req.body.ImgMaleApp3Base);
                }
                if (req.body.ImgFeMaleApp1Base != undefined && req.body.ImgFeMaleApp1Base != "") {
                    imageFeMale1 = await base64_decode(req.body.ImgFeMaleApp1Base);
                }
                if (req.body.ImgFeMaleApp2Base != undefined && req.body.ImgFeMaleApp2Base != "") {
                    imageFeMale2 = await base64_decode(req.body.ImgFeMaleApp2Base);
                }
                if (req.body.ImgFeMaleApp3Base != undefined && req.body.ImgFeMaleApp3Base != "") {
                    imageFeMale3 = await base64_decode(req.body.ImgFeMaleApp3Base);
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
                        ImgMaleApp3Base:imageMale3,
                        ImgFeMaleApp1Base: imageFeMale1,
                        ImgFeMaleApp2Base: imageFeMale2,
                        ImgFeMaleApp3Base: imageFeMale3,
                        status: 1,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ]);

                sentMailTo(
                    req.body.StudEmail,
                    "Successful Registration",
                    "Dear Ms. " +
                    req.body.SFname 
                      +" Greetings!\n\n" +
                      "This is to inform you that you have successfully registered for Hostel room, we will let you know once the room is allocated to you based on the availability and room preference.\n\n " +
                      "Thanking you.\n\n" 
                      +"With Regards,\n" +
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
        // } else
        console.log("req.body>>>>>>>>>>",req.body)
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
                message: "Please enter StudimagepathBase",
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
        }  else if (
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
        } else if (req.body.food_preference == undefined || req.body.food_preference == "") {
            return res.json({
                status: 401,
                message: "Please select food preference"
            });
        } else if (req.body.room_type == undefined || req.body.room_type == "") {
            return res.json({
                status: 401,
                message: "Please select room type"
            });
        }
        else if (req.body.parking == undefined || req.body.parking == "") {
            return res.json({
                status: 401,
                message: "Please select parking"
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
                message: "Please select Occupancy"
            });
        } else if (req.body.LocalimagepathBase == undefined || req.body.LocalimagepathBase == "") {
            return res.json({
                status: 401,
                message: "Please select Local Guardian Image"
            });
        }

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
        
               
                return res.status(200).json({
                    status: 200,
                    message: "All validations done",
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

async function base64_decode(base64Image) {
    let base64String = base64Image.split(';base64,').pop();
    // console.log(base64String);
    const image = Buffer.from(base64String, "base64")
    var imageName = "temp/" + Date.now() + ".png"
    fs.writeFileSync(imageName, image);
    var upload = await file_upload(imageName);
    fs.rmSync(imageName);
    return upload.Location;
}
module.exports = router;
