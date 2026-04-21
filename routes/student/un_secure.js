const express = require("express");
const router = express.Router();


router.use("/login", require("./auth/login"));
router.use("/verify", require("./auth/verify"));

router.use("/guardian/login", require("./guardian_auth/login"));
router.use("/guardian/verify", require("./guardian_auth/verify"));
module.exports = router;