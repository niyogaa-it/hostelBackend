/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('events', table => {
      table.increments('id');
      table.text('image_url').notNullable();
      table.text('event_name').notNullable();
      table.string('event_start_date', 255).notNullable();
      table.string('event_end_date', 255).notNullable();
      table.text('des').notNullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('events');
};
