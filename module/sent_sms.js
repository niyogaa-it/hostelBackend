const request = require("request");

function sentSms(params) {
  console.log(params);
  var options = {
    method: "GET",
    url:
      "https://api.textlocal.in/send/?apikey=" +
      process.env.TEXTLOCAL +
      "&numbers=91" +
      params.phone_number +
      "&message=" +
      params.msg +
      "&sender=RMHCHN",
  };
  console.log("url>>>", options.url);
  request(options, function (error, response) {
    // if (error) throw new Error(error);
    console.log(response.body);
  });
}

module.exports = sentSms;
