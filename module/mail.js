"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sentMail(subject,message) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "ranimeyyammaihostel.org",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@ranimeyyammaihostel.org", // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Emergency "<info@ranimeyyammaihostel.org>', // sender address
    to: "apptesting64@gmail.com, chakrabortyvarsha1@gmail.com", // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    // html: message, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", info.envelope);
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


async function sentMailTo(to, subject,message) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "ranimeyyammaihostel.org",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@ranimeyyammaihostel.org", // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });
console.log();
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: subject+'" "<info@ranimeyyammaihostel.org>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    // html: message, // html body
  });
console.log(info);
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", info.envelope);
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
module.exports = {sentMail, sentMailTo};
