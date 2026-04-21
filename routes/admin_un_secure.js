
const express = require("express");
const router = express.Router();

router.use('/login', require('./user_managment/login'));
router.use('/uploadbulkpostpaid', require('./user_managment/upload_bulk_postpaid'));
router.use('/create/profile', require('./student_managment/create_student_profile'));
router.use('/update/payment', require('./student_managment/payment'));
router.use('/create/attendance', require('./student_managment/create_attendance'));
router.use('/sendreceiptlink', require('./student_managment/sendreceiptlink'));
//Razor pay 
//router.use('/move_authorized_captured', require('./master_data/move_authorized_captured'));
//EaseBuzz Integration
router.use('/easebuzz', require('./master_data/easebuzz'));

module.exports = router;