/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('student_details', table => {
      table.increments('id');
      table.string('student_id', 255).notNullable();
      table.string('SFname', 255).notNullable();
      table.string('SRaddress', 255).notNullable();
      table.string('SmobNo', 255).notNullable();
      table.string('StudEmail', 255).notNullable();
      table.string('StudDOB', 255).notNullable();
      table.string('NamofInstitute', 255).notNullable();
      table.string('AdrsodInstitute', 255).notNullable();
      table.string('CourEnrolled', 255).notNullable();
      table.string('FatherName', 255).notNullable();
      table.string('MothersName', 255).notNullable();
      table.string('FatherOccu', 255).notNullable();
      table.string('MathersOccu', 255).notNullable();
      table.string('FatherConNo', 255).notNullable();
      table.string('MothersConNo', 255).notNullable();
      table.string('FatherEmail', 255).nullable();
      table.string('MothersEmail', 255).nullable();
      table.string('FatherAnnInc', 255).notNullable();
      table.string('MotherAnnInc', 255).nullable();
      table.string('BankAccHolder', 255).notNullable();
      table.string('BanckName', 255).notNullable();
      table.string('BankBranch', 255).notNullable();
      table.string('BrankAcctNo', 255).notNullable();
      table.string('BankIFSC', 255).notNullable();
      table.string('LocGuardName', 255).notNullable();
      table.string('RelWithLocGurd', 255).notNullable();
      table.string('LocGurdConNo', 255).notNullable();
      table.string('LocGurdAdres', 255).notNullable();
      table.string('NameVistMale1', 255).nullable();
      table.string('RelVistMaleApp1', 255).nullable();
      table.string('MaleApp1', 255).nullable();
      table.string('NameVistMale2', 255).nullable();
      table.string('RelVistMaleApp2', 255).nullable();
      table.string('MaleApp2', 255).nullable();
      table.string('NameVistMale3', 255).nullable();
      table.string('RelVistMaleApp3', 255).nullable();
      table.string('MaleApp3', 255).nullable();
      table.string('NameVistFeMale1', 255).nullable();
      table.string('RelVistFeMaleApp1', 255).nullable();
      table.string('FeMaleApp1', 255).nullable();
      table.string('NameVistFeMale2', 255).nullable();
      table.string('RelVistFeMaleApp2', 255).nullable();
      table.string('FeMaleApp2', 255).nullable();
      table.string('NameVistFeMale3', 255).nullable();
      table.string('RelVistFeMaleApp3', 255).nullable();
      table.string('FeMaleApp3', 255).nullable();
      table.string('StayPersonName', 255).nullable();
      table.string('StayRelWithApp', 255).nullable();
      table.string('StayAddress', 255).nullable();
      table.string('StayConNo', 255).nullable();
      table.string('StayPersonName1', 255).nullable();
      table.string('StayRelWithApp1', 255).nullable();
      table.string('StayAddress1', 255).nullable();
      table.string('StayConNo1', 255).nullable();
      table.string('food_preference', 255).notNullable();
      table.string('room_type', 255).notNullable();
      table.string('occupancy', 255).notNullable();
      table.string('bed_type', 255).notNullable();
      table.string('toilet_type', 255).notNullable();
      table.string('parking', 255).notNullable();
      table.string('room_id', 255).notNullable();
      table.string('building_name', 255).notNullable();
      table.string('parking_name', 255).nullable();
      table.string('parking_id', 255).nullable();
      table.string('transportation', 255).notNullable();
      table.string('academic_year', 255).notNullable();
      table.integer('is_approved').notNullable();
      table.integer('status').notNullable();
      table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('student_details');
};
