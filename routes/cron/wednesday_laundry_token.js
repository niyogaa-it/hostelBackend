/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const knex = require("../../module/knex_connect");
var moment = require("moment");

const generate_token = () => {
  return new Promise(async (resolve, reject) => {
    let get_users = await knex("student_details")
      .select("id", "room_id", "SFname")
      .where({
        status: 1,
        is_approved: 1,
      })
      .whereBetween("room_id", [48, 65]);

    for (let i = 0; i < get_users.length; i++) {
      var get_token = await knex("laundry_token").where({
        student_id: get_users[i].id,
        status: 1,
      });

      if (get_token.length > 0) {
        let update_token = await knex("laundry_token")
          .where({ student_id: get_users[i].id })
          .update({
            status: 0,
          });
        let insert_token = await knex("laundry_token").insert([
          {
            student_id: get_users[i].id,
            created_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            expired_at: moment()
              .add(+1, "days")
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            status: 1,
          },
        ]);
      } else {
        let insert_token = await knex("laundry_token").insert([
          {
            student_id: get_users[i].id,
            created_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            expired_at: moment()
              .add(+1, "days")
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            status: 1,
          },
        ]);
      }

      await knex("notifications").insert([
        {
          student_id: get_users[i].id,
          student_name: get_users[i].SFname,
          title: "Laundry Token",
          des: `${get_users[i].SFname} your laundry token has been generated.`,
          status: 0,
          student_status: 1,
          created_at: new Date(),
        },
      ]);

      //console.log("insert_token>>>>",insert_token)
    }
    console.log("wednesday token added>>>>");
    resolve("Laundry Token Added");
  });
};
generate_token();
