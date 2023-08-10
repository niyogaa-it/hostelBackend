/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

 const express = require("express");
 const router = express.Router();
 const knex = require('../../module/knex_connect');


 
 
 
 router.post("/", async (req, res) => {
     
     const exist_room = await knex("room")
     .where({
      // building_name: req.body.building_name,
       room_number: req.body.room_number
     });


     try {
        if (req.body.building_name == undefined || req.body.building_name == "" || req.body.building_name == "Default select") {
            return res.json({
                status: 401,
                field_name: "Building name",
                message: "Please select building name"
            }); 
        } else if(req.body.building_id == undefined || req.body.building_id == "" || req.body.building_id == "Default select"){
            return res.json({
                status: 401,
                field_name: "Building id",
                message: "Please enter building id"
            });
        } else if(req.body.floor == undefined || req.body.floor == "" || req.body.floor == "Default select"){
            return res.json({
                status: 401,
                field_name: "Floor",
                message: "Please select floor"
            });
        } else if(req.body.room_number == undefined || req.body.room_number == "" || req.body.room_number == "Default select"){
            return res.json({
                status: 401,
                field_name: "Room number",
                message: "Please enter room number"
            });
        } else if(exist_room.length > 0){
            return res.json({
                status: 401,
                field_name: "Exist room",
                message: "The room number has already been allotted "
            });
        } else if(req.body.room_type == undefined || req.body.room_type == "" || req.body.room_type == "Default select"){
            return res.json({
                status: 401,
                field_name: "Room type",
                message: "Please select room type"
            });
        } else if(req.body.occupancy == undefined || req.body.occupancy == "" || req.body.occupancy == "Default select"){
            return res.json({
                status: 401,
                field_name: "Occupancy",
                message: "Please select occupancy"
            });
        } else if(req.body.toilet_type == undefined || req.body.toilet_type == "" || req.body.toilet_type == "Default select"){
            return res.json({
                status: 401,
                field_name: "Toilet type",
                message: "Please select toilet type"
            });
        } else {
            let vaccancy=0
            if(req.body.occupancy=="2 in 1"){
                vaccancy=2
            }else if(req.body.occupancy=="3 in 1"){
                vaccancy=3
            }else if(req.body.occupancy=="4 in 1"){
                vaccancy=4
            }else if(req.body.occupancy=="5 in 1"){
                vaccancy=5
            }else if(req.body.occupancy=="6 in 1"){
                vaccancy=6
            }else if(req.body.occupancy=="7 in 1"){
                vaccancy=7
            }
             var isSaveData = await knex('room').insert([
                 {
                     building_name: req.body.building_name,
                     building_id: req.body.building_id,
                     floor: req.body.floor,
                     room_type: req.body.room_type,
                     bed_type: "NULL",
                     occupancy: req.body.occupancy,
                     vaccancy:vaccancy,
                     total_occupancy:vaccancy,
                     room_number: req.body.room_number,
                     toilet_type: req.body.toilet_type,
                     is_alloted: false,
                     status: 1,
                     created_at: new Date(),
                     updated_at: new Date()
                 }
             ]);
             // console.log(ok);
             if (isSaveData.length == 1) {
 
                 return res.json({
                     status: 201,
                     message: "Added room successful"
                 })
             } else {
                 return res.json({
                     status: 401,
                     message: "Failed to add building"
                 })
             }}
         
     } catch (error) {
         // console.log(ok);
         return res.json({
             status: 401,
             message: error.message
         })
     }
 });
 
 module.exports = router;