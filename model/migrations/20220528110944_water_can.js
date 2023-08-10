/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('water_can', table => {
      table.increments('id');
      table.integer('student_id', 255).notNullable();
      table.string('student_name', 255).notNullable();
      table.string('room_id', 255).notNullable();
      table.string('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('water_can');
};
