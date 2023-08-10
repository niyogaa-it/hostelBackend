const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.post("/:id", async (req, res) => {
    try {        
        var isSaveData = await knex('meal_plan').where({
        id: req.params.id,
        })
        .update(
        {
        status: 3
        }
        );
        // console.log(ok);
        if (isSaveData.length == 1) {
            return res.json({
                status: 200,
                message: "Delete meal successful"
            })
        } else {
            return res.json({
                status: 200,
                message: "Delete meal successful"
            })
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