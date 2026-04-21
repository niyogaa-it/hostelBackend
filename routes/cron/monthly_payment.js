/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const knex = require("../../module/knex_connect");
var moment = require("moment");

const generate_monthly_payment = () => {
  return new Promise(async (resolve, reject) => {
    let get_users = await knex("student_details")
      .select("id", "parking", "parking_id", "parking_type", "transportation","SFname")
      .where({
        status: 1,
        is_approved: 1,
        status: 1,
      })
      .orWhere({ parking: "Yes", transportation: "Yes" });
   
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    var month_name = monthNames[d.getMonth()];

    for (let i = 0; i < get_users.length; i++) {
      if (
        get_users[i].parking == "Yes" ||
        get_users[i].transportation == "Yes"
      ) {
        let data_obj={
            student_id: get_users[i].id,
            created_at: moment()
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
            parking_fee:
              get_users[i].parking == "Yes"
                ? get_users[i].parking_type == "2"
                  ? 336
                  : 2240
                : 0,
            transportation_fee: get_users[i].transportation == "Yes" ? 2360 : 0,
            for_month: month_name,
        
        }
        let insert_data = await knex("monthly_payment").insert([
          {
            student_id: data_obj.student_id,
            created_at: data_obj.created_at,
            parking_fee:data_obj.parking_fee,
            transportation_fee: data_obj.transportation_fee,
            for_month: data_obj.for_month,
            to_pay: data_obj.transportation_fee+data_obj.parking_fee,
            status: 1,
          },
        ]);
         await knex("notifications").insert([
          {
            student_id:get_users[i].id,
            student_name: get_users[i].SFname,
            title: "Monthly Payment",
            des: `${get_users[i].SFname} please pay your monthly fees.`,
            status: 0,
            student_status: 1,
            created_at: new Date(),
          },
        ]);

        console.log("insert_data>>>>", insert_data);
      }

    

      //console.log("insert_token>>>>",insert_token)
    }
    console.log(`${month_name} monthly payment generated`);
    resolve(" monthly payment generated");
  });
};
generate_monthly_payment();
