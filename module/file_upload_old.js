const aws = require("aws-sdk");
require("dotenv").config();
const fs = require("fs");


// console.log(s3);
// const params = {
//     Bucket: BUCKET_NAME,
//     CreateBucketConfiguration: {
//         // Set your region here
//         LocationConstraint: "ap-south-1"
//     }
// };
// s3.createBucket(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log('Bucket Created Successfully', data.Location);
// });


module.exports = async function (filePath) {
  // Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET_KEY;

// The name of the bucket that you have created
const BUCKET_NAME = "test-1223333333";

aws.config.update({
  region: "ap-south-1",
  accessKeyId: ID,
  secretAccessKey: SECRET,
  correctClockSkew: true
});
s3 = new aws.S3();
  // Read content from the file
  const fileContent = fs.createReadStream(filePath);

  // Setting up S3 upload parameters
  const params = {
    ACL: "public-read",

    Bucket: BUCKET_NAME,
    Key: Date.now() + ".png", // File name you want to save as in S3
    Body: fileContent,
  };

  // Uploading files to the bucket
  return await s3.upload(params).promise();
};