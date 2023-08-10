/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('laundry', table => {
      table.increments('id');
      table.integer('student_id', 255).notNullable();
      table.string('student_name', 255).notNullable();
      table.integer('no_cloth', 255).notNullable();
      table.integer('floor', 255).notNullable();
      table.string('cloths_json', 255).notNullable();
      table.string('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('laundry');
};
