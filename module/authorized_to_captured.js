const request = require("request");

function authorizedToCaptured(razorpay_payment_id,amount) {
  const apiKey = process.env.NODE_APP_RAZORPAY_KEY;
  const apiSecret = process.env.NODE_APP_RAZORPAY_SECRET_KEY;

  // Set up the authorization header
  const authHeader = `Basic ${Buffer.from(
    `${apiKey}:${apiSecret}`
  ).toString("base64")}`;

  var options = {
    'method': 'POST',
    'url': `https://api.razorpay.com/v1/payments/${razorpay_payment_id}/capture`,
    'headers': {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "amount": amount,
      "currency": "INR"
    })
  
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) reject(error);
      resolve(response.body);
    });
  });
}

module.exports = authorizedToCaptured;
