const express = require("express");
const knex = require("../../../module/knex_connect");
const sentSms = require("../../../module/sent_sms");
const { sentMailTo } = require("../../../module/mail");
const router = express.Router();

router.post("/", async (req, res) => {

  let guardian_mobile = "";
  let guardian_name = "";
  let guardian_email = "";

  // phone_number
  if (req.body.phone_number == undefined || req.body.phone_number == "") {
    return res.json({
      status: 401,
      message: "Please enter phone_number",
    });
  } else {
    const selectedRows = await knex("student_details")
          .where(function () {
            this.where({ FatherConNo: req.body.phone_number })
              .orWhere({ MothersConNo: req.body.phone_number })
              .orWhere({ LocGurdConNo: req.body.phone_number });
          })
          .andWhere({ is_approved: 1, status: 1 })
          .limit(1);

    
    if (selectedRows.length == 0) {
      return res.json({
        status: 401,
        message: "Please enter valid phone_number",
      });
    } else {

      var otp = generate(6);

  
      if(selectedRows[0].FatherEmail){
        guardian_name = selectedRows[0].FatherName;
      }else if (selectedRows[0].MothersEmail) { 
        guardian_name = selectedRows[0].MothersName;
      }else{
        guardian_name = selectedRows[0].FatherName;
      }


      if(selectedRows[0].FatherConNo){
        guardian_mobile = selectedRows[0].FatherConNo;
      }else if (selectedRows[0].MothersConNo) { 
        guardian_mobile = selectedRows[0].MothersConNo;

      }else if (selectedRows[0].LocGurdConNo) { 
        guardian_mobile = selectedRows[0].LocGurdConNo;

      }else{

        guardian_mobile = selectedRows[0].SmobNo;
      }



      if(selectedRows[0].FatherEmail){

        guardian_email = selectedRows[0].FatherEmail;

      }else if (selectedRows[0].MothersEmail) { 
        guardian_email = selectedRows[0].MothersEmail;

      }else{

        guardian_email = selectedRows[0].StudEmail;
      }

       // sentSms({
      //   phone_number: req.body.phone_number,
      //   msg:
      //     "Dear " +
      //     selectedRows[0].SFname +
      //     ", " +
      //     otp +
      //     " is your OTP for logging in. The OTP is valid for the next 5 minutes . Please do not share it with anyone. The hostel does not ask you to share OTP. - RMHostel",
      // });

      const phone_number = req.body.phone_number;
      // const message = "Dear " +
      // guardian_name +
      // ", " +
      // otp +
      // " is your OTP for logging in. The OTP is valid for the next 5 minutes . Please do not share it with anyone. The hostel does not ask you to share OTP. - RMHostel";
      // const deliveredsms = await sentSms({ phone_number, msg: message });
      const message = "Dear "+guardian_name+", Your login OTP is "+otp+". The OTP is valid for the next 5 minutes. Please do not share it with anyone. The hostel does not ask you to share OTP. -Chettinad";
      const deliveredsms = await sentSms({ phone_number, msg: message });
      

      const sendToRecipent = guardian_email;
      const mailsubject = "RMH Connect | Your Login OTP";
      const mailmessage =  "Dear Ms. " +
      guardian_name +",\n\n"+
      "Greetings!\n\n" +
        "To complete your login process, please use the following One-Time Password (OTP):" + otp+"\n\n " +
        "Please enter this OTP within 5 minutes to authenticate your login. If you did not initiate this login request, please disregard this email.\n\n" +
        "For security purposes, please do not share this OTP with anyone. Our system will never ask for your OTP.\n\n"+
        "If you encounter any issues or need further assistance, please feel free to reach out to our support team.\n\n"+
        "Thanking you.\n\n" +
        "With Regards,\n" +
        "RM Hostel Team";

      const delivered_mail = await sentMailTo(sendToRecipent, mailsubject, mailmessage);



      await knex("phone_auth").insert([
        {
          phone_number: req.body.phone_number,
          otp: otp,
          user_tyoe: 2,
          user_id: selectedRows[0].id,
          created_at: new Date(),
          updated_at: new Date(),
          status: 1,
        },
      ]);
      return res.json({
        status: 201,
        message: "Otp sent successfully",
        otp: otp,
      });
    }
  }
});
function generate(n) {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}
module.exports = router;
