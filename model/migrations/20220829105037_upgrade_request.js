/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('upgrade_request', table => {
      table.increments('id');
      table.integer('student_id').notNullable();
      table.string('student_name').notNullable();
      table.string('request_type').notNullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('upgrade_request');
};
