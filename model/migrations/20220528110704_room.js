/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('room', table => {
      table.increments('id');
      table.string('building_id', 255).notNullable();
      table.string('building_name', 255).notNullable();
      table.integer('floor', 255).notNullable();
      table.string('room_number', 255).notNullable();
      table.string('room_type', 255).notNullable();
      table.string('bed_type', 255).notNullable();
      table.string('occupancy', 255).notNullable();
      table.string('toilet_type', 255).notNullable();
      table.boolean('Is_alloted').notNullable();
      table.integer('student_id').nullable();
      table.integer('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('room');
};
