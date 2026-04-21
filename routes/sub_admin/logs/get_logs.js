const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");


router.get("/", async (req, res) => {
 const selectedRows = await knex('action_log').orderBy('id', 'desc');
    return res.json({
        status: 200,
        result_data: selectedRows
    }) 
});


router.post("/addlog", async (req, res) => {

    var isSaveData = await knex("action_log").insert([
        {
            userName: req.body.userName,
            moduleName: req.body.moduleName,
            action_perform: req.body.action_perform,
            action_date:new Date(),
    
        },
      ]);
      if (isSaveData.length == 1) {
        return res.json({
          status: 201,
          message: "Added Log Successfully",
        });
      }
});
module.exports = router;