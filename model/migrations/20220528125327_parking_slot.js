/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('parking_slot', table => {
      table.increments('id');
      table.string('parking_id', 255).notNullable();
      table.string('parking_name', 255).notNullable();
      table.integer('is_alloted', 255).nullable();
      table.integer('student_id', 255).nullable();
      table.integer('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('parking_slot');
};
