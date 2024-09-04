const knex = require("../db/connection");

const tableName = "tables";

async function createTable(newTable) {
  return knex(tableName)
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function listTables() {
  return knex(tableName)
    .select("*")
    .orderBy("table_name", "asc")
    .then((tables) => tables)
    .catch((error) => {
      console.log("Error listing tables:", error);
      throw error;
    });
}

async function read(table_id) {
  return knex(tableName).select("*").where({ table_id }).first();
}

async function setTableReservation(table_id, new_reservation_id) {
  return await knex(tableName)
    .where({ table_id })
    .update({ reservation_id: new_reservation_id })
    .returning("*")
    .catch((error) => {
      console.log(`Could not update table ${table_id}`);
      throw error;
    });
}

async function deleteTableReservation(table_id){
  return await knex(tableName)
    .where({table_id})
    .update({reservation_id: null})
    .catch((error) => {
      console.log(`Could not delete reservation on table ${table_id}`);
      throw error;
    })
}

module.exports = {
  createTable,
  listTables,
  setTableReservation,
  read,
  deleteTableReservation,
};
