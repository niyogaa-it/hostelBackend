const express = require("express");
const router = express.Router();

router.use('/create/admin', require('./user_managment/create_sub_admin'));
router.use('/mydetails', require('./user_managment/my_details'));

router.use('/update/admin', require('./user_managment/admin_update'));
router.use('/update/subadmin', require('./user_managment/subadmin_update'));
router.use('/subadmin/details', require('./user_managment/subadmin_details'));
router.use('/sub/admin', require('./user_managment/sub_admin_list'));
router.use('/sub/admin/status', require('./user_managment/sub_admin_status'));

router.use('/create/building', require('./master_data/create_building'));
router.use('/building', require('./master_data/building_list'));
router.use('/buildingDetails', require('./master_data/building_details'));
router.use('/update/building', require('./master_data/update_building'));

router.use('/create/room', require('./master_data/create_room'));
router.use('/edit/room', require('./master_data/edit_room'));
router.use('/roomDetails', require('./master_data/room_details'));
router.use('/room', require('./master_data/room_list'));

router.use('/parking', require('./master_data/parking_list'));
router.use('/create/parking', require('./master_data/create_parking'));
router.use('/edit/parking/:id', require('./master_data/edit_parking'));
router.use('/edit/parking', require('./master_data/edit_parking'));
router.use('/parking/slot/', require('./master_data/parkig_slot_list'));

router.use('/gst_list', require('./master_data/gst_list'));
router.use('/edit_gst', require('./master_data/edit_gst'));
router.use('/gst_details', require('./master_data/gst_details'));

router.use('/old_plan_list', require('./master_data/old_plan_list'));
router.use('/edit_old_plan', require('./master_data/edit_old_plan'));
router.use('/old_plan_details', require('./master_data/old_plan_details'));


router.use('/new_plan_list', require('./master_data/new_plan_list'));
router.use('/edit_new_plan', require('./master_data/edit_new_plan'));
router.use('/new_plan_details', require('./master_data/new_plan_details'));

router.use('/create/student', require('./student_managment/create_profile'));
router.use('/edit/student', require('./student_managment/edit_student'));
router.use('/student', require('./student_managment/student_list'));
router.use('/request/student', require('./student_managment/student_list_request'));
router.use('/per/student', require('./student_managment/per_student'));
router.use('/student_plan', require('./student_managment/student_plan'));

router.use('/create/event', require('./sub_admin/events/event'));
router.use('/update/event', require('./sub_admin/events/update_event'));
router.use('/events', require('./sub_admin/events/get_events'));
router.use('/eventDetails', require('./sub_admin/events/get_event_details'));
router.use('/event/del', require('./sub_admin/events/del_events'));

router.use('/create/meal', require('./sub_admin/meal/add_meal'));
router.use('/meal', require('./sub_admin/meal/get_meal'));

router.use('/leave', require('./student/leaves/get_show'));
router.use('/leave', require('./student/leaves/guardian_leave_accept'));

router.use('/emergency', require('./student/emergency/get_show'));
router.use('/emergency/resolved', require('./student/emergency/resolved'));

router.use('/feedback', require('./student/feedback/get_show'));
router.use('/feedback/resolved', require('./student/feedback/resolved'));

router.use('/water/can', require('./student/water_can/get_show'));
router.use('/water/delivered', require('./student/water_can/resolved'));

router.use("/laundry", require("./student/laundry/get_show"));
router.use("/laundry/update", require("./student/laundry/update"));

router.use("/notification", require("./student/notifications/get_show"));
router.use("/notification/push", require("./student/notifications/post_add"));
router.use("/notification", require("./student/notifications/update"));

router.use("/plan", require("./sub_admin/plan/post_add"));
router.use("/plan", require("./sub_admin/plan/edit_plan"));
router.use("/plan", require("./sub_admin/plan/get_plan"));
router.use("/recharge", require("./student/recharge/get_show"));

router.use("/upgrade", require("./student/upgrade/get_show"));
router.use("/upgrade", require("./student/upgrade/update"));

/*Meal Plan -19-12-2022 */
router.use('/create/meal_plan', require('./sub_admin/student_meal/add_meal'));
router.use('/meal_plan', require('./sub_admin/student_meal/get_meal'));
router.use('/schedule_food', require('./sub_admin/student_meal/add_food'));
router.use('/schedule', require('./sub_admin/student_meal/get_schedule'));
router.use('/edit/schedule', require('./sub_admin/student_meal/update_schedule'));
router.use('/view/schedule', require('./sub_admin/student_meal/view_schedule'));


router.use('/uploadbulkinvoice', require('./user_managment/studentdataupload'));
router.use('/downloadcsvonetime', require('./user_managment/downloadcsvonetime'));
router.use('/downloadcsvmonthly', require('./user_managment/downloadcsvmonthly'));
router.use('/downloadcsvonetime', require('./user_managment/downloadcsvonetime'));
router.use('/downloadcsvmonthly', require('./user_managment/downloadcsvmonthly'));


router.use('/mealDetails', require('./master_data/meal_details'));
router.use('/update/meal', require('./master_data/update_meal'));
router.use('/meal/delete', require('./master_data/meal_delete'));
router.use('/logs', require('./sub_admin/logs/get_logs'));


router.get("/check/token", (req, res) => {     
    return res.json({
        status: 200,
        user_details: req.user,
        permissions : req.permissions,
        unseen: req.notification_unseen
    })
});


module.exports = router;