/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema
    .createTable('today_meal', table => {
      table.increments('id');
      table.string('veg_breakfast', 255).notNullable();
      table.string('veg_lunch', 255).notNullable();
      table.string('veg_dinner', 255).notNullable();
      table.string('no_veg_breakfast', 255).notNullable();
      table.string('no_veg_lunch', 255).notNullable();
      table.string('no_veg_dinner', 255).notNullable();
      table.string('eggetarian_breakfast', 255).notNullable();
      table.string('eggetarian_lunch', 255).notNullable();
      table.string('eggetarian_dinner', 255).notNullable();
      table.integer('status', 255).notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('today_meal');
};
