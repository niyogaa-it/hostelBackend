const express = require("express");
var cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const verifyMiddleware = require("./middleware/token_validator");
app.use("/admin/secure", verifyMiddleware, require("./routes/admin_secure"));
app.use("/admin/un/secure", require("./routes/admin_un_secure"));

const studentVerifyMiddleware = require("./middleware/student_token");
app.use(
  "/student/secure",
  studentVerifyMiddleware,
  require("./routes/student/secure")
);
app.use("/student/un/secure", require("./routes/student/un_secure"));

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
