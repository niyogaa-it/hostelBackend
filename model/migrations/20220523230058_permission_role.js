/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('role_permission', table => {
      table.increments('id');
      table.integer('user_id');
      table.boolean('student_management').nullable();
      table.boolean('master_data_management').nullable();
      table.boolean('warden_management').nullable();
      table.boolean('room_management').nullable();
      table.boolean('payment_activities').nullable();
      table.boolean('help_quieres').nullable();
      table.boolean('laundary_management').nullable();
      // table.boolean('menu_management').nullable();
      table.boolean('water_management').nullable();
      table.boolean('notification_management').nullable();
      table.boolean('emergency_management').nullable();
      table.boolean('parking_management').nullable();
      table.boolean('guardian_management').nullable();
      // table.boolean('view_meal').nullable();
      table.boolean('update_meal').nullable();
      table.boolean('events').nullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('role_permission');
};
