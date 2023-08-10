var jwt = require('jsonwebtoken');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const knex = require('../module/knex_connect');

async function verify(req, res, next) {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).json({ status: 401, message: "token not found" })

        } else {
            jwt.verify(token, process.env.JWT_KEY, async function (err, verifiedUser) {
                if (err) {
                    return res.status(401).json({ status: 401, message: "token is invalid" })

                } else {
                    // return res.json({ status: 200, message: verifiedUser.user_details.id})
                    if (verifiedUser.user_details.id) {
                        const user_details = await knex('admin').where("id", verifiedUser.user_details.id).limit(1);


                        if(user_details.length == 1){
                            req.user = user_details[0];
                            var lengthData = await knex("notifications").where({
                                status: 0   
                            }).count("id as length");
                            req.notification_unseen = lengthData[0].length;
                            // console.log(req.unseen);
                            const user_permmission = await knex('role_permission').where("user_id", verifiedUser.user_details.id).limit(1);
                            req.permissions = user_permmission[0];
                            // return res.json({ status: 200, message: req.permission  })
                            next();
                        } else {
                            return res.status(401).json({ status: 401, message: "Unauthorized" })

                        }
                    } else {
                        return res.status(401).json({ status: 401, message: "Unauthorized Token" })
                    }
                }
            });

        
        }
    } catch (err) {
        return res.status(404).json({ status: 404, message: "internal error", error: err.message })

    }
}

module.exports = verify;