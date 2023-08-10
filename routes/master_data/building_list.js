const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/", async (req, res) => {
  var finalResukt = [];
  const selectedRows = await knex("building").where({ status: 1 });
  for (let i = 0; i < selectedRows.length; i++) {
    var floorList = [];
    for (let index = 0; index < selectedRows[i].no_of_floor; index++) {
      const selectedRows1 = await knex("room").where({
        building_id: selectedRows[i].id,
        floor: index + 1,
        status: 1,
      });

      floorList.push({
        floor_number: index + 1,
        room_list: selectedRows1,
      });
    }
    finalResukt.push({
      id: selectedRows[i].id,
      building_name: selectedRows[i].building_name,
      no_of_floor: selectedRows[i].no_of_floor,
      floor_list: floorList,
    });
  }

  return res.json({
    status: 200,
    result_data: finalResukt,
  });
});

router.post("/delete/:id", async (req, res) => {
  try {
    if (req.params.id == undefined || req.params.id == "") {
      return res.json({
        status: 401,
        message: "Please enter id",
      });
    } else {
      const inValidRoom = await knex("room").where({
       // is_alloted: 1,
        status: 1,
        building_id: req.params.id,
      }).whereRaw('total_occupancy != vaccancy');
    
      const validBuilding = await knex("building").where({
        id: req.params.id,
        status: 1
      });
      if (inValidRoom.length > 0) {
        return res.json({
          // status: 405,
          status: 201,
          message: "This Building contains room(s), So it cannot be deleted. First delete the room(s).",
        });
      } else if (validBuilding.length>0) {
        await knex("building")
          .where({
            id: req.params.id,
          })
          .del();
        return res.json({
          status: 200,
          message: "The Building has been Deleted",
        });
      } else{
        return res.json({
          status: 401,
          message: "No building found.",
        });
      }
    }
  } catch (error) {
    // console.log(ok);
    return res.json({
      // status: 401,
      status: 201,
      message: error.message,
    });
  }
});

module.exports = router;
