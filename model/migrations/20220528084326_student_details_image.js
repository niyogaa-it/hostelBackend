/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('student_details_image', table => {
      table.increments('id');
      table.integer('student_id', 255).notNullable();
      table.string('StudimagepathBase', 255).notNullable();
      table.string('LocalimagepathBase', 255).notNullable();
      table.string('ImgMaleApp1Base', 255).notNullable();
      table.string('ImgMaleApp2Base', 255).notNullable();
      table.string('ImgMaleApp3Base', 255).notNullable();
      table.string('ImgFeMaleApp1Base', 255).notNullable();
      table.string('ImgFeMaleApp2Base', 255).notNullable();
      table.string('ImgFeMaleApp3Base', 255).notNullable();
      table.string('FatherimagepathBase', 255).nullable();
      table.string('MotherimagepathBase', 255).nullable();
      table.integer('status').notNullable()
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('student_details_image');
};
