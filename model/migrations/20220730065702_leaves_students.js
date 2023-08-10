/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('leaves_students', table => {
      table.increments('id');
      table.integer('student_id').notNullable();
      table.string('student_name').notNullable();
      table.string('student_guardian_no').notNullable();
      table.dateTime('from').notNullable();
      table.dateTime('to').nullable();
      table.string('reason', 255).nullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('leaves_students');
};
