const express = require("express");
const knex = require("../../module/knex_connect");
const router = express.Router();

router.use("/meal", require("../sub_admin/meal/get_meal"));
router.use("/events", require("../sub_admin/events/get_events"));
router.use("/leaves", require("./leaves/post_add"));
router.use("/leaves", require("./leaves/get_show"));
router.use("/emergency", require("./emergency/post_add"));
router.use("/emergency", require("./emergency/get_show"));
router.use("/guardian/approve", require("./leaves/guardian_leave_accept"));

router.use("/water/can", require("./water_can/post_add"));
router.use("/water/can", require("./water_can/get_show"));

router.use("/feedback", require("./feedback/post_add"));
router.use("/feedback", require("./feedback/get_show"));


router.use("/laundry", require("./laundry/post_add"));
router.use("/laundry", require("./laundry/get_show"));

router.use("/notifications", require("./notifications/get_show"));
router.use("/notifications", require("./notifications/update"));

router.use("/profile/change", require("../student_managment/profile_change"));
router.use("/profile/docs", require("../student_managment/profile_docs"));

router.use("/recharge", require("./recharge/post_add"));
router.use("/recharge", require("./recharge/get_show"));

router.use("/upgrade", require("./upgrade/get_show"));
router.use("/upgrade", require("./upgrade/post_add"));
// router.use("/notifications", require("./notifications/update"));

router.use ("/profile", async (req, res) => {
    
    if (req.user) {
        // console.log(req);
        const photoBase = await knex('student_details_image').where({ student_id: req.user.id }).limit(1);
    
            return res.json({
                status: 200,
                details: req.user,
                photo: photoBase,
                user_type: req.user_type
            })
        }else{
            return res.json({
                status: 401,
                message: "No data found"
            });
        }
} );
module.exports = router;