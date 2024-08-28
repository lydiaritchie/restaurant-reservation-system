const knex = require("../db/connection");

const tableName = "tables";

async function createTable(newTable){
    return knex(tableName)
        .insert(newTable)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

async function listTables(){
    return knex(tableName)
    .select("*")
    .orderBy("table_name", "asc")
    .then((tables) => tables)
    .catch((error) => {
        console.log("Error listing tables:", error);
        throw error;
    })
}

module.exports ={
    createTable,
    listTables,
}