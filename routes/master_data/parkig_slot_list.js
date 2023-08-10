const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/:parking_id", async (req, res) => {
console.log(req.params.parking_id);

 const selectedRows = await knex('parking_slot').where({ 
    parking_id: req.params.parking_id, 
    status: 1 });
 
    return res.json({
        status: 200,
        result_data: selectedRows
    })

    
});

module.exports = router;