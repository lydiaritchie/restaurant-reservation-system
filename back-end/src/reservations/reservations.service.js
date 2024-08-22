const knex = require("../db/connection");

const tableName = "reservations";

function createReservation(newReservation){
    return knex(tableName)
        .insert(newReservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);

}

function listReservations(){
    return knex(tableName)
        .select("*")
        .then(reservations => reservations)
        .catch(error => {
            console.log("Error listing reservations:", error)
            throw error;
        })
}

module.exports = {
    createReservation,
    listReservations,
}