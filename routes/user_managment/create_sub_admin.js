/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const express = require("express");
const { md5 } = require("request/lib/helpers");
const router = express.Router();
const knex = require('../../module/knex_connect');



router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        if (req.body.name == undefined || req.body.name == "") {
            return res.json({
                status: 401,
                message: "Please enter name"
            });
        } else if (req.body.phone_no == undefined || req.body.phone_no == "") {
            return res.json({
                status: 401,
                message: "Please enter phone number"
            });
        } else if (req.body.email == undefined || req.body.email == "") {
            return res.json({
                status: 401,
                message: "Please enter email"
            });
        } else if (req.body.password == undefined || req.body.password == "") {
            return res.json({
                status: 401,
                message: "Please enter password"
            });
        }  else {
            var isExists = await knex('admin').where("email", req.body.email).limit(1);
            if (isExists.length == 1) {
                return res.json({
                    status: 401,
                    message: "This sub admin already exists"
                })
            } else {
                var isSaveData = await knex('admin').insert([
                    {
                        name: req.body.name,
                        email: req.body.email,
                        phone_no: req.body.phone_no,
                        password: md5(req.body.password),
                        role: req.body.role,
                        super_admin: 0,
                        status: 1,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                ]);
                // console.log(ok);
                if (isSaveData.length == 1) {
                    await knex('role_permission').insert([
                        {
                            user_id: isSaveData[0],
                            student_management: req.body.UserManagement === true ? 0 : null,
                            master_data_management: req.body.MasterDataManagement === true ? 0 : null,
                            warden_management: req.body.WardenManagement === true ? 0 : null,
                            room_management: req.body.RoomManagement === true ? 0 : null, // hostler
                            payment_activities: req.body.PaymentActivities === true ? 0 : null,
                            help_quieres: req.body.HelpQuieres === true ? 0 : null,
                            laundary_management: req.body.LaundaryManagement === true ? 0 : null,
                            notification_management: req.body.NotificationManagement === true ? 0 : null,
                            emergency_management: req.body.EmergencyManagement === true ? 0 : null,
                            events: req.body.Events === true ? 0 : null,
                            update_meal: req.body.UpdateMeal === true ? 0 : null,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    ]);
                    return res.json({
                        status: 201,
                        data: isSaveData,
                        message: "This is the create sub admin route"
                    })
                } else {
                    return res.json({
                        status: 401,
                        message: "Account not create  !!!"
                    })
                }
            }
        }
    } catch (error) {
        // console.log(ok);
        return res.json({
            status: 401,
            message: error.message
        })
    }
});

module.exports = router;