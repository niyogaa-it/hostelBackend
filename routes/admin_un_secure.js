
const express = require("express");
const router = express.Router();

router.use('/login', require('./user_managment/login'));
router.use('/create/profile', require('./student_managment/create_student_profile'));
router.use('/create/attendance', require('./student_managment/create_attendance'));
router.use('/move_authorized_captured', require('./master_data/move_authorized_captured'));

module.exports = router;