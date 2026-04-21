/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('recharge', table => {
      table.increments('id');
      table.integer('student_id').notNullable();
      table.string('plan_name').notNullable();
      table.integer('plan_price').notNullable();
      table.string('plan').notNullable();
      table.dateTime('start_date').nullable();
      table.dateTime('end_date').nullable();
      table.string('food_preference').nullable();
      table.string('room_type').nullable();
      table.string('parking').nullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('recharge');
  
};
