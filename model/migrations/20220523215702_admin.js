/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema
    .createTable('admin', table => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('phone_no', 255);
      table.string('email', 255);
      table.string('password', 255);
      table.string('role', 255);
      table.integer('status', 255);
      table.boolean('super_admin').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('admin');
};
