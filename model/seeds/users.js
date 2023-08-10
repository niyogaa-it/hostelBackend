/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
   // Deletes ALL existing entries
   return knex('users').del()
   .then(function () {
     // Inserts seed entries
      return knex('users').where({ id: 1 }).update({
        name: 'admin',
        email: ''
      })
   });
};
