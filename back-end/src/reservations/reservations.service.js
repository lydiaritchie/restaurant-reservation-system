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
    .then((createdRecords) => createdRecords[0])
    .catch((error) => {
      console.log("Error retrieving reservation:", error.message);
      throw error;
    })
}

async function listReservations(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .whereNot({status: "finished"})
    .orderBy("reservation_time", "asc")
    .catch((error) => {
      console.log("Error listing reservations:", error);
      throw error;
    });
}

async function updateStatus(status, reservation_id){
  return knex(tableName)
    .where({reservation_id})
    .update({status: status})
    .catch((error) => {
      console.log(`Error updating status: ${status} on reservation ${reservation_id}`)
    })
}

module.exports = {
  createReservation,
  getReservation,
  listReservations,
  updateStatus,
};
