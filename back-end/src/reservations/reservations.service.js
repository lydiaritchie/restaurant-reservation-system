const knex = require("../db/connection");

const tableName = "reservations";

async function createReservation(newReservation) {
  return knex(tableName)
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function getReservation(reservation_id) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id })
    .then((createdRecords) => createdRecords[0])
    .catch((error) => {
      console.log("Error retrieving reservation:", error.message);
      throw error;
    });
}

async function listReservations(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .whereNot({ status: "cancelled" })
    .orderBy("reservation_time", "asc")
    .catch((error) => {
      console.log("Error listing reservations:", error);
      throw error;
    });
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`,
    )
    .orderBy("reservation_date");
}

async function updateStatus(status, reservation_id) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ status: status })
    .catch((error) => {
      console.log(
        `Error updating status: ${status} on reservation ${reservation_id}, error:${error}`,
      );
    });
}

async function update(newReservation, reservation_id) {
  return knex(tableName)
    .where({ reservation_id: reservation_id })
    .update({ ...newReservation })
    .returning("*") // Return the updated row(s) if supported by the database
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  createReservation,
  getReservation,
  listReservations,
  updateStatus,
  search,
  update,
};
