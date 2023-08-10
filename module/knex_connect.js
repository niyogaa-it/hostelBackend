const knexConfig = require('../model/knexfile');
//initialize knex
const knex = require('knex')(knexConfig["stable"]);
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
module.exports = knex;