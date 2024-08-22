const knex = require("../db/connection");

const tableName = "reservations";

function createReservation(newReservation){
    return knex(tableName)
        .insert(newReservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);

}

module.exports = {
    createReservation,
}