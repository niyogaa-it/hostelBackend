/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('phone_auth', table => {
      table.increments('id');
      table.string('phone_number').notNullable();
      table.integer('otp', 255).notNullable();
      table.integer('user_tyoe', 255).nullable();
      table.integer('user_id', 255).nullable();
      table.integer('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
