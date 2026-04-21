/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('plan', table => {
      table.increments('id');
      table.string('plan_name').notNullable();
      table.integer('plan_price').notNullable();
      table.string('plan').notNullable();
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
    return knex.schema.dropTable('plan');
};
