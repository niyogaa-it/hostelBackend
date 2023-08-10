const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/room_list", async (req, res) => {
  const selectedRows = await knex("room")
    .where({
      status: 1,
    })
    .orderBy("id", "desc");
  return res.json({
    status: 200,
    result_data: selectedRows,
  });
});

router.post("/delete/:id", async (req, res) => {
  try {
    if (req.params.id == undefined || req.params.id == "") {
      return res.json({
        // status: 401,
        status: 201,
        message: "Please enter id",
      });
    } else {
      const validRoom = await knex("room").whereNull("student_id").where({
        //is_alloted: 0,
        id: req.params.id,
        status: 1,
      }).whereRaw('total_occupancy = vaccancy');
      const inValidRoom = await knex("room").where({
        id: req.params.id,
      }).whereRaw('total_occupancy != vaccancy');;
      if (validRoom.length > 0) {
        await knex("room")
          .where({
            id: req.params.id,
          })
          .del();
        return res.json({
          status: 200,
          message: "The Room has been Deleted",
        });
      } else if (inValidRoom.length > 0) {
        return res.json({
          // status: 405,
          status: 201,
          message: "This Room contains student(s), So it cannot be deleted.",
        });
      } else {
        return res.json({
          // status: 400,
          status: 201,
          message: "The room doesn't exist.",
        });
      }
    }
  } catch (error) {
    return res.json({
      // status: 401,
      status: 201,
      message: error.message,
    });
  }
});

module.exports = router;
