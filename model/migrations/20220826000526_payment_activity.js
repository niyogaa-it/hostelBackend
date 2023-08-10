/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('payment_activity', table => {
      table.increments('id');
      table.integer('student_id').notNullable();
      table.string('student_name').notNullable();
      table.string('payment_id').notNullable();
      table.integer('amount').notNullable();
      table.string('type').notNullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('payment_activity');
  
};
