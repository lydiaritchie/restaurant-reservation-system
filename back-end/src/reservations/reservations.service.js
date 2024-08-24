const knex = require("../db/connection");

const tableName = "reservations";

function createReservation(newReservation) {
  return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function listReservations(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc")
    .then((reservations) => reservations)
    .catch((error) => {
      console.log("Error listing reservations:", error);
      throw error;
    });
}

module.exports = {
  createReservation,
  listReservations,
};
