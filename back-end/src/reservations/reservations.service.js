const knex = require("../db/connection");

const tableName = "reservations";

async function createReservation(newReservation) {
  return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function getReservation(reservation_id){
  return knex(tableName)
    .select("*")
    .where({reservation_id})
    .catch((error) => {
      console.log("Error retrieving reservation:", error.message);
      throw error;
    })
}

async function listReservations(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc")
    .catch((error) => {
      console.log("Error listing reservations:", error);
      throw error;
    });
}

module.exports = {
  createReservation,
  getReservation,
  listReservations,
};
