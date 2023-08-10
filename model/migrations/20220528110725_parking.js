/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('parking', table => {
      table.increments('id');
      table.string('parking_name', 255).notNullable();
      table.string('no_of_slot', 255).notNullable();
      table.integer('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('parking');
};
