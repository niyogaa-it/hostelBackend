/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const express = require("express");
const router = express.Router();
const knex = require('../../module/knex_connect');



router.post("/", async (req, res) => {
    try {
        if (req.body.building_name == undefined || req.body.building_name == "") {
            return res.json({
                status: 401,
                message: "Please enter building name"
            });


        } else if (req.body.parking_slot == undefined || req.body.parking_slot == "") {
            return res.json({
                status: 401,
                message: "Please enter no of floors"
            });


        } else {
            var isSaveData = await knex('parking').insert([
                {
                    parking_name: req.body.building_name,
                    no_of_slot: req.body.parking_slot,
                    status: 1,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);
            var parkingId = isSaveData[0];
            for (let index = 0; index < req.body.parking_slot; index++) {
                await knex('parking_slot').insert([
                    {
                        parking_id: parkingId,
                        parking_name: req.body.building_name,
                        is_alloted: 0,
                        status: 1,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                ]);
            }

            // console.log(ok);
            if (isSaveData.length == 1) {

                return res.json({
                    status: 201,
                    message: "Added Parking Successfully"
                })
            } else {
                return res.json({
                    status: 401,
                    message: "Failed to add building"
                })
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