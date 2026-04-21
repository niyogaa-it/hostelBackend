const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/:id", async (req, res) => {

console.log("req.user>>>>",req.user)
//return
 const selectedRows = await knex('admin').where({id:req.params.id})
  
    return res.json({
        status: 200,
        result: selectedRows
    })

    
    
});

module.exports = router;