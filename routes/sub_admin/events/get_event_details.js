/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const express = require("express");
const router = express.Router();
const knex = require("../../../module/knex_connect");

router.get("/:id", async (req, res) => {
//return
const selectedRows = await knex('events').where({id:req.params.id})
    return res.json({
        status: 200,
        result: selectedRows
    })
});

module.exports = router;