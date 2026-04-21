// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "hostel_api",
    },
  },
  stable: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "admin_ranimeyyammaihostel_usr",
      password: "efYRQG43K0jdLTc1dcs",
      database: "admin_ranimeyyammaihostel_db",
    },
  },
};
