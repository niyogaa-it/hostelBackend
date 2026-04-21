const express = require("express");
const router = express.Router();
const knex = require("../../module/knex_connect");
router.get("/", async (req, res) => {
 const selectedRows = await knex('admin')
    .join('role_permission', 'admin.id', 'role_permission.user_id');//role_permission
    
    let objectKeys = [];
    for (const key in selectedRows) {

        if (selectedRows.hasOwnProperty(key)) {
    
            objectKeys = Object.keys(selectedRows[key]);

            selectedRows[key]['access'] = '';
            let i = 0;
            objectKeys.forEach((key1, index1) => {
                if(key1 != 'super_admin' && key1 != 'permission' && selectedRows[key][key1] == 0) {
                    if(i == 0) {
                        selectedRows[key]['access'] += key1.replace(/_/g, ' ').replace(/(\b\w)/g, (s) => s.toUpperCase() );    
                    } else {
                        selectedRows[key]['access'] += ', '+key1.replace(/_/g, ' ').replace(/(\b\w)/g, (s) => s.toUpperCase() );
                    }
                    i++; 
                }
            });
        }
    }
    return res.json({
        status: 200,
        result_data: selectedRows
    });   
    
});

module.exports = router;