const express = require("express");
const { md5 } = require("request/lib/helpers");
const router = express.Router();
const knex = require('../../module/knex_connect');
var jwt = require('jsonwebtoken');


router.post("/", async (req, res) => {
    if (req.body.username == undefined || req.body.username == "") {
        return res.json({
            srarus: 404,
            message: "Please Enter Username"
        })
    } else  if (req.body.password == undefined || req.body.password == "") {
        return res.json({
            srarus: 404,
            message: "Please Enter Password"
        })
    } else{
       try {
        var isExists = await knex('admin').where("email", req.body.username).andWhere("password", md5(req.body.password)).limit(1);
        if(isExists.length == 1){
            delete  isExists[0]['password'];
            console.log(isExists[0]);
            var token = jwt.sign({
                user_details: isExists[0]
            }, process.env.JWT_KEY);
            return res.json({
                status: 200,
                token: token,
                message: "Login Successfully"
            })
        }
        else{
            return res.json({
                status: 401,
                message: "Invalid Username or Password"
            })
        }
       } catch (error) {
              return res.json({
                status: 500,
                message: error.message
              })   
       }

    }

});

module.exports = router;