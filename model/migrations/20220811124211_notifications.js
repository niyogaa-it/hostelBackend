/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('notifications', table => {
      table.increments('id');
      table.integer('student_id').notNullable();
      table.string('student_name').notNullable();
      table.string('title').notNullable();
      table.string('des', 255).nullable();
      table.integer('status').notNullable();
      table.integer('student_status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('notifications');
};
