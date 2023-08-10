var jwt = require("jsonwebtoken");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const knex = require("../module/knex_connect");

async function verify(req, res, next) {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).json({ status: 401, message: "token not found" });
    } else {
      jwt.verify(
        token,
        process.env.JWT_KEY,
        async function (err, verifiedUser) {
          if (err) {
            return res
              .status(401)
              .json({ status: 401, message: "token is invalid" });
          } else {
            // return res.json({ status: 200, message: verifiedUser.user_details.id})
            // console.log(verifiedUser.user_details.id == undefined);
            if (verifiedUser.user_id) {
              const user_details = await knex("student_details")
                .where("id", verifiedUser.user_id)
                .limit(1);

              var isFound = user_details.length == 1;
   
              if (isFound) {
                // console.log(verifiedUser.user_type);
                req.user = user_details[0];
                req.user_type = verifiedUser.user_type;

                // return res.json({ status: 200, message: req.permission  })
                next();
              } else {
                return res
                  .status(401)
                  .json({ status: 401, message: "Unauthorized" });
              }
            } else {
              return res
                .status(401)
                .json({ status: 401, message: "Unauthorized Token" });
            }
          }
        }
      );
    }
  } catch (err) {
    return res
      .status(404)
      .json({ status: 404, message: "internal error", error: err.message });
  }
}

module.exports = verify;
