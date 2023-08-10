const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");
router.get("/", async (req, res) => {


 const selectedRows = await knex('events').where({
    status: 1,
  }).orderBy('id', 'desc');
    return res.json({
        status: 200,
        result_data: selectedRows
    })

    
});

module.exports = router;