const request = require("request");

// async function sentSms(params) {
//   console.log(params);
//   var options = {
//     method: "GET",
//     url:
//       "https://api.textlocal.in/send/?apikey=" +
//       process.env.TEXTLOCAL +
//       "&numbers=91" +
//       params.phone_number +
//       "&message=" +
//       params.msg +
//       "&sender=RMHCHN",
//   };
//   console.log("url>>>", options.url);
//   request(options, function (error, response) {
//     // if (error) throw new Error(error);
//     console.log(response.body);
//   });
// }



async function sentSms(params) {
  console.log(params);
  var options = {
    method: "GET",
    url:
      "https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=VbqnpCeO20eVrAlQ98xpdQ&senderid=CRMHOS&channel=2&DCS=0&flashsms=0&number=91"+
      params.phone_number +"&text="+
      params.msg +"&route=1&EntityId=1201162986786035101&dlttemplateid=1207175161978541459",
      
  };
  console.log("url>>>", options.url);
  request(options, function (error, response) {
    // if (error) throw new Error(error);
    console.log(response.body);
  });
}

module.exports = sentSms;
