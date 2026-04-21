/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');


router.get("/:id", async (req, res) => {

    //return
    const selectedRows = await knex('building').where({id:req.params.id})
        return res.json({
            status: 200,
            result: selectedRows
        })
});




router.post("/", async (req, res) => {

    try {

        const old_parking_slot = await knex('parking_slot').where({parking_id:req.body.building_id});

        let old_parking_count=  old_parking_slot && old_parking_slot.length > 0 ? old_parking_slot.length: 0;

        const no_of_slot = parseInt(req.body.no_of_slot, 10);


       if(no_of_slot <= old_parking_count){

        return res.json({
            status: 401,
            message: "Please enter proper Slot it should be greater than old slot"
        });


       } else if (req.body.building_id == undefined || req.body.building_id == "") {
            return res.json({
                status: 401,
                message: "Please enter building name"
            });


        } else if (req.body.no_of_slot == undefined || req.body.no_of_slot == "") {
            return res.json({
                status: 401,
                message: "Please enter slot"
            });


        } else {


                var isSaveData = await knex('building').where({
                    id: req.body.building_id,
                })
                .update({
                    no_of_slot: no_of_slot,
                    status: 1,
                    updated_at: new Date()
                });



                const no_of_total_slot_increase = (no_of_slot - old_parking_count);

                for (let index = 0; index < no_of_total_slot_increase; index++) {
                    await knex('parking_slot').insert({
                        parking_id: req.body.building_id,
                        is_alloted: 0,
                        status: 1,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                }

                if (isSaveData == 1) {
                    return res.json({
                        status: 201,
                        message: "Update Parking Successfully"
                    });
                } else {
                    return res.json({
                        status: 401,
                        message: "Failed to add building"
                    });
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