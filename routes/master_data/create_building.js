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
        
            
        } else if (req.body.no_of_floors == undefined || req.body.no_of_floors == "") {
            return res.json({
                status: 401,
                message: "Please enter no of floors"
            });
        
            
        } else{
            var isExist = await knex("building")
            .where({
                building_name: req.body.building_name,
              status: 1,
            })
            .limit(1);
            if (isExist.length != 0) {
                return res.json({
                    status: 401,
                    message: "already building name found"
                })
            } else {
            
            var isSaveData = await knex('building').insert([
                {
                    building_name: req.body.building_name,
                    no_of_floor: req.body.no_of_floors,
                    status: 1,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]);
            // console.log(ok);
            if (isSaveData.length == 1) {

                return res.json({
                    status: 201,
                    message: "Added Building Successfully"
                })
            } else {
                return res.json({
                    status: 401,
                    message: "Failed to add building"
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